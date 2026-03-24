/**
 * autoDispatch.ts
 * Shared helper that geocodes a customer address, fetches a fresh Wolt
 * shipment promise, creates a Wolt delivery, and updates the order store.
 *
 * Used:
 *  1. Automatically from the Stripe webhook (payment_intent.succeeded)
 *  2. As a fallback from /api/wolt/delivery when admin manually retries
 */
import { createDelivery, getShipmentPromise, WoltDeliveryRequest } from '@/lib/wolt';
import { updateOrder, findOrderById } from '@/lib/orderStore';
import { stores } from '@/config/stores';

export interface AutoDispatchResult {
    woltDeliveryId: string | null;
    trackingUrl: string | null;
}

/**
 * Geocodes an address string using the Google Maps Geocoding API.
 * Returns { lat, lng }.
 */
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing');

    const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    const data = await res.json();
    if (data.status !== 'OK' || data.results.length === 0) {
        throw new Error(`Failed to geocode address: ${address}`);
    }
    return data.results[0].geometry.location; // { lat, lng }
}

/**
 * Parses "Street Name, PLZ Stadt" into structured parts Wolt expects.
 */
function parseAddress(rawAddress: string): { street: string; city: string; post_code: string } {
    const trimmed = rawAddress.trim();
    const lastComma = trimmed.lastIndexOf(',');
    const street = lastComma >= 0 ? trimmed.slice(0, lastComma).trim() : trimmed;
    const zipCity = lastComma >= 0 ? trimmed.slice(lastComma + 1).trim() : '';
    const zipMatch = zipCity.match(/^(\d{4})\s+(.+)$/);
    return {
        street,
        post_code: zipMatch ? zipMatch[1] : '',
        city: zipMatch ? zipMatch[2].trim() : zipCity,
    };
}

/**
 * Core auto-dispatch function.
 *
 * @param orderId  The internal order ID (e.g. "WOLT-XXXXXXXX")
 * @returns        { woltDeliveryId, trackingUrl }
 * @throws         If geocoding, Wolt promise, or Wolt delivery fails
 */
export async function autoDispatchOrder(orderId: string): Promise<AutoDispatchResult> {
    const order = await findOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const store = stores.find((s) => s.id === order.storeId);
    if (!store) throw new Error(`Store ${order.storeId} not found`);
    if (!store.woltVenueId) throw new Error(`Wolt Venue ID missing for store ${order.storeId}`);

    // ── Geocode ──────────────────────────────────────────────────────────
    const coords = await geocodeAddress(order.customerAddress);
    const { street, city, post_code } = parseAddress(order.customerAddress);

    // ── Normalise scheduledDropoffTime → UTC ISO (Z suffix) ─────────────
    let scheduledTimeUTC: string | null = null;
    const rawScheduled = (order as any).scheduledDropoffTime;
    if (rawScheduled) {
        scheduledTimeUTC = new Date(rawScheduled).toISOString();
        console.log(`[autoDispatch] 📅 Scheduled time: ${rawScheduled} → UTC ${scheduledTimeUTC}`);
    }

    // ── Fresh Wolt shipment promise ──────────────────────────────────────
    console.log(`[autoDispatch] 📦 Fetching Wolt promise for ${orderId} → ${order.customerAddress}`);
    const freshPromise = await getShipmentPromise(store.woltVenueId, {
        street,
        city,
        post_code,
        lat: coords.lat,
        lon: coords.lng,
        min_preparation_time_minutes: 15, // Default for both ASAP and pre-order
        ...(scheduledTimeUTC ? { scheduled_dropoff_time: scheduledTimeUTC } : {}),
    });
    const activePromiseId: string = freshPromise.id;
    console.log(`[autoDispatch] ✅ Promise ID: ${activePromiseId}`);

    // ── Phone format (E.164) ─────────────────────────────────────────────
    const formattedPhone = order.customerPhone?.startsWith('+')
        ? order.customerPhone
        : `+43${(order.customerPhone || '').replace(/^0+/, '')}`;

    // ── Build Wolt order_number ──────────────────────────────────────────
    const storePrefix = store.id.slice(0, 3).toUpperCase();
    const orderNumber = order.order_number
        ? `${storePrefix}-${order.order_number}`
        : `${storePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const deliveryReq: WoltDeliveryRequest = {
        pickup: {
            comment: 'Das Essen befindet sich im Restaurant Topf & Deckel bei der Kasse.',
        },
        dropoff: {
            location: { lat: coords.lat, lon: coords.lng },
            comment: order.deliveryNote || undefined,
            options: {
                is_no_contact: !!order.noContact,
                ...(scheduledTimeUTC ? { scheduled_time: scheduledTimeUTC } : {}),
            },
        },
        recipient: {
            name: order.customerName || 'Kunde',
            phone_number: formattedPhone,
        },
        parcels: Array.isArray(order.orderDetails) && order.orderDetails.length > 0
            ? order.orderDetails.map((item: any) => ({
                count: item.qty || 1,
                price: {
                    amount: Math.round((item.price || 0) * 100),
                    currency: 'EUR',
                },
                description: `${item.name}${item.size ? ` (${item.size})` : ''}`.trim(),
                identifier: item.id || item.name || 'item',
            }))
            : [{
                count: 1,
                price: { amount: 0, currency: 'EUR' },
                description: 'Topf & Deckel Bestellung',
                identifier: 'generic-item',
            }],
        shipment_promise_id: activePromiseId,
        customer_support: {
            url: 'https://topf-deckel.at',
            email: 'info@topfdeckel.at',
            phone_number: '+436991119181',
        },
        merchant_order_reference_id: orderId,
        order_number: orderNumber,
    };

    console.log(`[autoDispatch] 🚀 Dispatching Wolt courier for ${orderId}...`);
    const woltResponse = await createDelivery(store.woltVenueId, deliveryReq);

    const trackingUrl: string | null = woltResponse.tracking?.url || woltResponse.tracking_url || null;
    const woltDeliveryId: string | null = woltResponse.id || null;

    await updateOrder(orderId, {
        status: 'wolt_dispatched',
        wolt_delivery_id: woltDeliveryId,
        wolt_tracking_id: woltResponse.tracking?.id || null,
        tracking_url: trackingUrl,
    });

    console.log(`[autoDispatch] ✅ Courier dispatched for ${orderId} | DeliveryID: ${woltDeliveryId} | Tracking: ${trackingUrl}`);
    return { woltDeliveryId, trackingUrl };
}

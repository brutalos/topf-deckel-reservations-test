import { NextResponse } from 'next/server';
import { createDelivery, getShipmentPromise, WoltDeliveryRequest } from '@/lib/wolt';
import { stores } from '@/config/stores';
import { updateOrder, findOrderById } from '@/lib/orderStore';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!process.env.ADMIN_API_KEY || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
            return NextResponse.json({ error: 'Unauthorized courier dispatch attempt' }, { status: 401 });
        }

        const { orderId, storeId, customerName, customerPhone, customerAddress, deliveryNote, noContact, promiseId: existingPromiseId, orderDetails, scheduledDropoffTime } = await req.json();

        if (!orderId || !storeId || !customerAddress) {
            return NextResponse.json({ error: 'Missing required parameters: orderId, storeId, customerAddress' }, { status: 400 });
        }

        const store = stores.find((s) => s.id === storeId);
        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        if (!store.woltVenueId) {
            return NextResponse.json({ error: 'Wolt Venue ID missing for store ' + storeId }, { status: 500 });
        }

        // ── Geocode the dropoff address ─────────────────────────────────────
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) throw new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing');

        const geoRes = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(customerAddress)}&key=${apiKey}`
        );
        const geoData = await geoRes.json();
        if (geoData.status !== 'OK' || geoData.results.length === 0) {
            throw new Error(`Failed to geocode dropoff address: ${customerAddress}`);
        }
        const dropoffCoords = geoData.results[0].geometry.location;

        // ── Get a fresh shipment promise ────────────────────────────────────
        // Always re-fetch at dispatch time: the original promise from checkout
        // can expire before the admin dispatches the courier.
        const rawAddress = customerAddress.trim();
        const lastComma = rawAddress.lastIndexOf(',');
        const street = lastComma >= 0 ? rawAddress.slice(0, lastComma).trim() : rawAddress;
        const zipCity = lastComma >= 0 ? rawAddress.slice(lastComma + 1).trim() : '';
        const zipMatch = zipCity.match(/^(\d{4})\s+(.+)$/);
        const post_code = zipMatch ? zipMatch[1] : '';
        const city = zipMatch ? zipMatch[2].trim() : zipCity;

        console.log(`📦 Fetching fresh Wolt promise for ${orderId} → ${customerAddress}`);
        let activePromiseId = existingPromiseId;

        // ── Normalise scheduledDropoffTime to UTC ISO (Z suffix) ─────────────
        // datetime-local inputs yield "2026-03-17T10:08" (no tz). Convert to UTC
        // so Wolt interprets it correctly regardless of server timezone.
        let scheduledTimeUTC: string | null = null;
        if (scheduledDropoffTime) {
            const d = new Date(scheduledDropoffTime);
            scheduledTimeUTC = d.toISOString(); // always UTC with Z suffix
            console.log(`📅 Pre-order scheduled_time: input=${scheduledDropoffTime}  → UTC=${scheduledTimeUTC}`);
        }

        try {
            const freshPromise = await getShipmentPromise(store.woltVenueId, {
                street,
                city,
                post_code,
                lat: dropoffCoords.lat,
                lon: dropoffCoords.lng,
                min_preparation_time_minutes: 10,
                ...(scheduledTimeUTC ? { scheduled_dropoff_time: scheduledTimeUTC } : {}),
            });
            activePromiseId = freshPromise.id;
            console.log(`✅ Fresh promise ID: ${activePromiseId}`);
        } catch (promiseErr: any) {
            // If we have the original promise ID, try using it as fallback
            if (!activePromiseId) {
                throw new Error(`Could not get shipment promise: ${promiseErr.message}`);
            }
            console.warn(`⚠️ Fresh promise failed — using original: ${activePromiseId}`);
        }

        // ── Phone format (must be E.164) ────────────────────────────────────
        const formattedPhone = customerPhone?.startsWith('+')
            ? customerPhone
            : `+43${(customerPhone || '').replace(/^0+/, '')}`;

        // ── Build Wolt order_number — match what admin/tracking shows ──────
        // Use the stored sequential number (e.g. "1000") with a store prefix ("VOR-1000")
        const storedOrder = await findOrderById(orderId);
        const storePrefix = store.id.slice(0, 3).toUpperCase();
        const orderNumber = storedOrder?.order_number
            ? `${storePrefix}-${storedOrder.order_number}`
            : `${storePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

        const deliveryReq: WoltDeliveryRequest = {
            // Field order must exactly match Wolt API docs
            pickup: {
                comment: 'Das Essen befindet sich im Restaurant Topf & Deckel bei der Kasse.',
            },
            dropoff: {
                location: { coordinates: { lat: dropoffCoords.lat, lon: dropoffCoords.lng } } as any,
                comment: deliveryNote || undefined,
                options: {
                    is_no_contact: !!noContact,
                    ...(scheduledTimeUTC ? { scheduled_time: scheduledTimeUTC } : {}),
                },
            },
            recipient: {
                name: customerName || 'Kunde',
                phone_number: formattedPhone,
            },
            parcels: Array.isArray(orderDetails) && orderDetails.length > 0
                ? orderDetails.map((item: any) => ({
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

        console.log(`🚀 Dispatching Wolt courier for order ${orderId}...`);
        const woltResponse = await createDelivery(store.woltVenueId, deliveryReq);

        const trackingUrl = woltResponse.tracking?.url || woltResponse.tracking_url || null;
        const woltDeliveryId = woltResponse.id || null;

        await updateOrder(orderId, {
            status: 'wolt_dispatched',
            wolt_delivery_id: woltDeliveryId,
            wolt_tracking_id: woltResponse.tracking?.id || null,
            tracking_url: trackingUrl,
        });

        console.log(`✅ Courier dispatched for ${orderId} | DeliveryID: ${woltDeliveryId} | Tracking: ${trackingUrl}`);

        return NextResponse.json({
            success: true,
            woltTrackingUrl: trackingUrl,
            woltDeliveryId,
        });
    } catch (error: any) {
        console.error('Wolt Delivery Dispatch Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

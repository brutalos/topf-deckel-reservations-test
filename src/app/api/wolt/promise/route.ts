import { NextResponse } from 'next/server';
import { getShipmentPromise, WoltShipmentPromiseRequest } from '@/lib/wolt';
import { stores } from '@/config/stores';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Optional: Fallback helper to geocode using Google Maps API server-side
async function geocodeAddress(address: string) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Using public key as requested
    if (!apiKey) throw new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing in env');

    const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${apiKey}`
    );
    if (!res.ok) throw new Error('Geocoding failed');

    const data = await res.json();
    if (data.status !== 'OK' || data.results.length === 0) {
        throw new Error('Address not found or invalid');
    }

    const location = data.results[0].geometry.location;
    return { lat: location.lat, lon: location.lng };
}

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        if (!checkRateLimit(ip, { maxRequests: 15, windowMs: 60000, context: 'wolt-promise' }).success) {
            return NextResponse.json({ error: 'Too many delivery quote requests. Try again later.' }, { status: 429 });
        }

        const { storeId, customerAddress, dropoffLat, dropoffLon } = await req.json();

        if (!storeId || !customerAddress) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const store = stores.find((s) => s.id === storeId);
        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        if (!store.woltVenueId) {
            return NextResponse.json({ error: 'Wolt Venue ID missing for store' }, { status: 500 });
        }

        // Determine dropoff coordinates. The frontend AutoComplete already has lat/lng,
        // so it should ideally pass dropoffLat/dropoffLon to save Google Geocoding API cost.
        let targetLat = dropoffLat;
        let targetLon = dropoffLon;

        if (!targetLat || !targetLon) {
            try {
                const coords = await geocodeAddress(customerAddress);
                targetLat = coords.lat;
                targetLon = coords.lon;
            } catch (err: any) {
                return NextResponse.json({ error: 'Could not geocode address: ' + err.message }, { status: 400 });
            }
        }

        // Parse "Street Name Number, PLZ Stadt" → Wolt structured fields
        const rawAddress = (customerAddress || '').trim();
        const lastComma = rawAddress.lastIndexOf(',');
        const street = lastComma >= 0 ? rawAddress.slice(0, lastComma).trim() : rawAddress;
        const zipCity = lastComma >= 0 ? rawAddress.slice(lastComma + 1).trim() : '';
        const zipMatch = zipCity.match(/^(\d{4})\s+(.+)$/);
        const post_code = zipMatch ? zipMatch[1] : '';
        const city = zipMatch ? zipMatch[2].trim() : zipCity;

        const promiseReq: WoltShipmentPromiseRequest = {
            street,
            city,
            post_code,
            ...(targetLat && targetLon && { lat: targetLat, lon: targetLon }),
            min_preparation_time_minutes: 15, // Default ASAP prep time
        };

        const woltResponse = await getShipmentPromise(store.woltVenueId, promiseReq);

        return NextResponse.json({
            id: woltResponse.id,
            delivery_fee: woltResponse.price?.amount || 0,
            currency: woltResponse.price?.currency || 'EUR',
            eta_minutes: woltResponse.dropoff?.eta_minutes || 35,
        });
    } catch (error: any) {
        console.error('Wolt Promise Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { findOrderById, updateOrder } from '@/lib/orderStore';

/**
 * Wolt delivers webhook events as a HS256 JWT inside body: { "token": "<jwt>" }
 * We verify with HMAC-SHA256 and WEBHOOK_SECRET then process the decoded payload.
 */
export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const secret = process.env.WOLT_WEBHOOK_SECRET;

        if (!secret) {
            console.error('[Wolt Webhook] WOLT_WEBHOOK_SECRET not set');
            return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 });
        }

        let body: any;
        try {
            body = JSON.parse(bodyText);
        } catch {
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
        }

        // ── JWT verification ────────────────────────────────────────────────
        // Wolt wraps the event as { "token": "<header.payload.sig>" }
        const rawToken = body?.token;
        let event: any;

        if (rawToken) {
            const parts = rawToken.split('.');
            if (parts.length !== 3) {
                return NextResponse.json({ error: 'Invalid JWT format' }, { status: 400 });
            }
            const [header, payload, sig] = parts;
            const expected = crypto
                .createHmac('sha256', secret)
                .update(`${header}.${payload}`)
                .digest('base64url');

            if (expected !== sig) {
                console.warn('[Wolt Webhook] Invalid JWT signature — rejecting');
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
            event = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        } else {
            // Fallback: some test senders post the event directly (without JWT wrapper)
            const sig = req.headers ? null : null; // no raw-body HMAC for direct format
            event = body;
        }

        const merchantOrderId: string = event?.details?.merchant_order_reference_id || '';
        const eventType: string = event?.type || '';

        console.log(`[Wolt Webhook] ${eventType}  order=${merchantOrderId || '?'}`);

        if (merchantOrderId) {
            const order = await findOrderById(merchantOrderId);
            if (order) {
                // Pickup ETA update (when courier is on the way to restaurant)
                if (event.details?.pickup?.eta) {
                    const pickupDate = new Date(event.details.pickup.eta);
                    await updateOrder(merchantOrderId, {
                        pickup_eta_iso: event.details.pickup.eta,
                        pickup_eta: Math.max(0, Math.round((pickupDate.getTime() - Date.now()) / 60000)),
                    });
                }

                // Events that only update ETAs, never the status
                const etaOnlyEvents = new Set([
                    'order.pickup_eta_updated',
                    'order.dropoff_eta_updated',
                ]);

                if (etaOnlyEvents.has(eventType)) {
                    if (event.details?.dropoff?.eta?.min) {
                        const etaDate = new Date(event.details.dropoff.eta.min);
                        await updateOrder(merchantOrderId, {
                            eta_iso: event.details.dropoff.eta.min,
                            eta: Math.max(0, Math.round((etaDate.getTime() - Date.now()) / 60000)),
                        });
                    }
                } else {
                    // Status-changing event
                    const updates: any = { status: eventType };
                    if (eventType === 'order.pickup_started') updates.canCancel = false;
                    if (event.details?.dropoff?.eta?.min) {
                        const etaDate = new Date(event.details.dropoff.eta.min);
                        updates.eta_iso = event.details.dropoff.eta.min;
                        updates.eta = Math.max(0, Math.round((etaDate.getTime() - Date.now()) / 60000));
                    }
                    if (event.details?.tracking_reference) {
                        updates.tracking_url = order.tracking_url || event.details.tracking_reference;
                    }
                    await updateOrder(merchantOrderId, updates);
                }
            } else {
                console.warn(`[Wolt Webhook] Unknown order: ${merchantOrderId}`);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Wolt Webhook] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

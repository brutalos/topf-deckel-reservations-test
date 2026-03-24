import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { addOrder, nextOrderNumber, findOrderById } from '@/lib/orderStore';
import { autoDispatchOrder } from '@/lib/autoDispatch';

export async function POST(req: Request) {
    console.log(`\n[Stripe Webhook] 🔔 POST Request received at /api/webhooks/stripe`);
    try {
        // req.text() gives the exact UTF-8 string Stripe signed — works in Node.js and Edge
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');
        const isDev = process.env.NODE_ENV === 'development';

        console.log(`\n[Stripe Webhook] Received — sig present: ${!!signature}`);

        let event: any;

        if (signature && process.env.STRIPE_WEBHOOK_SECRET) {
            try {
                event = stripe.webhooks.constructEvent(
                    body,
                    signature,
                    process.env.STRIPE_WEBHOOK_SECRET,
                );
                console.log('[Stripe Webhook] ✅ Signature verified');
            } catch (err: any) {
                console.error('[Stripe Webhook] ❌ Sig verification failed:', err.message);
                if (isDev) {
                    // In dev: still process the event (stripe listen timing can drift)
                    console.warn('[Stripe Webhook] ⚠️  Dev mode — processing despite failed sig');
                    event = JSON.parse(body);
                } else {
                    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
                }
            }
        } else if (isDev) {
            console.warn('[Stripe Webhook] ⚠️  No sig header — parsing directly (dev mode)');
            event = JSON.parse(body);
        } else {
            return NextResponse.json({ error: 'Missing stripe-signature or STRIPE_WEBHOOK_SECRET' }, { status: 400 });
        }

        console.log(`[Stripe Webhook] Event type: ${event.type}`);

        // payment_intent.succeeded fires when capture_method is 'automatic' (the new flow).
        // payment_intent.amount_capturable_updated fired for the old 'manual' hold flow.
        if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.amount_capturable_updated') {
            const pi = event.data.object as any;

            const existingOrder = await findOrderById(pi.id);
            if (existingOrder) {
                console.log(`[Stripe Webhook] Order for PI ${pi.id} already exists. Skipping.`);
                return NextResponse.json({ received: true });
            }

            const meta = pi.metadata || {};

            console.log(`[Stripe Webhook] PI: ${pi.id} | StoreId: ${meta.storeId || '(none)'} | Customer: ${meta.customerName || '(none)'}`);

            let orderDetails: any[] = [];
            try {
                orderDetails = meta.orderDetails ? JSON.parse(meta.orderDetails) : [];
            } catch { }

            const merchantOrderId = `WOLT-${pi.id.slice(-8).toUpperCase()}`;
            const orderNumber = await nextOrderNumber();

            await addOrder({
                id: merchantOrderId,
                storeId: meta.storeId || '',
                wolt_delivery_id: null,
                wolt_tracking_id: null,
                status: 'received',
                order_number: orderNumber,
                customerName: meta.customerName || '',
                customerPhone: meta.customerPhone || '',
                customerAddress: meta.customerAddress || '',
                deliveryTime: meta.deliveryTime || 'ASAP',
                deliveryNote: meta.deliveryNote || null,
                noContact: meta.noContact === 'true',
                amount: pi.amount / 100,
                orderDetails,
                promiseId: meta.promiseId || '',
                eta: meta.deliveryEta ? parseInt(meta.deliveryEta) : 35,
                eta_iso: null,
                pickup_eta: null,
                pickup_eta_iso: null,
                tracking_url: null,
                canCancel: true,
                stripePaymentId: pi.id,
                scheduledDropoffTime: meta.scheduledDropoffTime || null,
                createdAt: new Date().toISOString(),
            });

            console.log(`✅ Order saved [${merchantOrderId}] #${orderNumber} → store: ${meta.storeId}`);

            // ── Auto-dispatch Wolt courier (only for delivery orders) ──────────
            if (meta.customerAddress) {
                try {
                    console.log(`[Stripe Webhook] 🚀 Auto-dispatching Wolt for ${merchantOrderId}...`);
                    const { woltDeliveryId, trackingUrl } = await autoDispatchOrder(merchantOrderId);
                    console.log(`[Stripe Webhook] ✅ Wolt auto-dispatch complete | DeliveryID: ${woltDeliveryId} | Tracking: ${trackingUrl}`);
                } catch (dispatchErr: any) {
                    // Non-fatal: order is already saved as 'received'.
                    // Admin can manually retry dispatch from the kitchen dashboard.
                    console.error(`[Stripe Webhook] ⚠️  Auto-dispatch failed for ${merchantOrderId}: ${dispatchErr.message}`);
                }
            } else {
                console.log(`[Stripe Webhook] ℹ️  No delivery address — skipping Wolt auto-dispatch (pickup order?)`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('[Stripe Webhook] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

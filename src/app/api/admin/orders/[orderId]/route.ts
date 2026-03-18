import { NextResponse } from 'next/server';
import { withFreshEta, findOrderById, updateOrder } from '@/lib/orderStore';
import { stores } from '@/config/stores';

/**
 * GET /api/admin/orders/[orderId]
 * Look up a single order by its in-memory id OR stripePaymentId (pi_xxx).
 * Used by the customer tracking page after payment redirect.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    const order = await findOrderById(orderId);

    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(withFreshEta(order));
}

/**
 * DELETE /api/admin/orders/[orderId]
 * Cancel an order. If a Wolt delivery exists, also cancel it with Wolt.
 * Returns 409 if pickup has already started (canCancel = false).
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    const { reason } = await req.json().catch(() => ({ reason: 'Cancelled' }));

    const order = await findOrderById(orderId);

    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.canCancel) {
        return NextResponse.json(
            { error: 'Cannot cancel: courier has already started pickup' },
            { status: 409 }
        );
    }

    // ── Cancel on Wolt if a delivery was already dispatched ──────────────
    if (order.wolt_delivery_id) {
        const store = stores.find(s => s.id === order.storeId);
        const isProduction = process.env.WOLT_ENV === 'production';
        const baseUrl = isProduction
            ? 'https://daas-public-api.wolt.com'
            : 'https://daas-public-api.development.dev.woltapi.com';
        const apiKey = isProduction ? process.env.API : process.env.WOLT_STAGING_API;

        if (store?.woltVenueId && apiKey) {
            try {
                const woltRes = await fetch(
                    `${baseUrl}/v1/venues/${store.woltVenueId}/deliveries/${order.wolt_delivery_id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ reason: reason || 'Cancelled by merchant' }),
                    }
                );
                console.log(`[Cancel] Wolt delivery ${order.wolt_delivery_id} → HTTP ${woltRes.status}`);
            } catch (err: any) {
                console.warn('[Cancel] Wolt cancellation API failed:', err.message);
                // Still cancel locally even if Wolt call fails
            }
        }
    }

    await updateOrder(order.id, { status: 'cancelled', canCancel: false });
    console.log(`[Cancel] Order ${order.id} cancelled. Reason: ${reason}`);

    const updated = await findOrderById(order.id);
    if (!updated) return NextResponse.json({ success: true });
    return NextResponse.json({ success: true, order: withFreshEta(updated) });
}

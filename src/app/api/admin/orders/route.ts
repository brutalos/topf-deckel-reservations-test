import { NextResponse } from 'next/server';
import { getOrdersByStore, getAllOrders, withFreshEta, addOrder, nextOrderNumber } from '@/lib/orderStore';

/** GET /api/admin/orders?storeId=vorgarten */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('storeId');
    const orders = storeId ? await getOrdersByStore(storeId) : await getAllOrders();
    return NextResponse.json(orders.map(withFreshEta));
}

/** POST /api/admin/orders — dev-only: inject a test order to verify store works */
export async function POST(req: Request) {
    const { storeId = 'vorgarten', ...rest } = await req.json().catch(() => ({}));
    const id = `WOLT-TEST-${Date.now()}`;
    const orderNumber = await nextOrderNumber();
    await addOrder({
        id,
        storeId,
        wolt_delivery_id: null,
        wolt_tracking_id: null,
        status: 'received',
        order_number: orderNumber,
        customerName: rest.customerName || 'Test User',
        customerPhone: rest.customerPhone || '+43000000000',
        customerAddress: rest.customerAddress || 'Teststraße 1, 1010 Wien',
        deliveryTime: 'ASAP',
        deliveryNote: null,
        noContact: false,
        amount: rest.amount || 9.99,
        orderDetails: rest.orderDetails || [{ name: 'Test Item', qty: 1, size: 'S', price: 9.99 }],
        promiseId: rest.promiseId || '',
        eta: 30,
        eta_iso: null,
        pickup_eta: null,
        pickup_eta_iso: null,
        tracking_url: null,
        canCancel: true,
        stripePaymentId: 'pi_test',
        scheduledDropoffTime: null,
        createdAt: new Date().toISOString(),
    });
    console.log(`[Test] Injected test order ${id} into store`);
    return NextResponse.json({ ok: true, id, order_number: orderNumber });
}

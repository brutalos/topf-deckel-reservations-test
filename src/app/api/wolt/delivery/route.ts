import { NextResponse } from 'next/server';
import { autoDispatchOrder } from '@/lib/autoDispatch';
import { isAdminAuthorized, getAuthDebugInfo } from '@/lib/adminAuth';

/**
 * POST /api/wolt/delivery
 * Manual fallback for admin to retry Wolt dispatch when auto-dispatch failed.
 * (In the normal flow this is triggered automatically by the Stripe webhook.)
 */
export async function POST(req: Request) {
    try {
        if (!isAdminAuthorized(req)) {
            console.error(`[Admin API] 401 Unauthorized - POST /api/wolt/delivery. ${getAuthDebugInfo(req)}`);
            return NextResponse.json({ error: 'Unauthorized courier dispatch attempt' }, { status: 401 });
        }

        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json({ error: 'Missing required parameter: orderId' }, { status: 400 });
        }

        console.log(`[Wolt Delivery] 🔄 Manual retry dispatch for ${orderId}...`);
        const { woltDeliveryId, trackingUrl } = await autoDispatchOrder(orderId);

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

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthorized } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: Promise<{ storeId: string }> }) {
    if (!isAdminAuthorized(req)) {
        return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const { storeId } = await params;
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
        return NextResponse.json({ error: 'DATE_REQUIRED' }, { status: 400 });
    }

    try {
        console.log(`[Timeline API] Fetching for Store=${storeId}, Date=${date}`);
        const assignments = await (prisma as any).reservationTableAssignment.findMany({
            where: {
                reservation: { storeId },
                slotDateTime: { startsWith: date }
            },
            include: { reservation: true }
        });

        console.log(`[Timeline API] Found ${assignments.length} assignments`);

        const blocks = await (prisma as any).reservationBlock.findMany({
            where: {
                storeId,
                slotDateTime: { startsWith: date }
            }
        });

        return NextResponse.json({ assignments, blocks });
    } catch (error) {
        return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
    }
}

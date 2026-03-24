import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthorized } from '@/lib/adminAuth';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
    if (!isAdminAuthorized(req)) {
        return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { storeId, tableId, slotDateTime, reason } = body;

        if (!storeId || !slotDateTime) {
            return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
        }

        const block = await (prisma as any).reservationBlock.create({
            data: {
                id: randomUUID(),
                storeId,
                tableId,
                slotDateTime,
                reason
            }
        });

        return NextResponse.json(block);
    } catch (error) {
        return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!isAdminAuthorized(req)) {
        return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID_REQUIRED' }, { status: 400 });
        }

        await (prisma as any).reservationBlock.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
    }
}

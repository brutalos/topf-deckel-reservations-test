import { NextResponse } from 'next/server';
import { ReservationService } from '@/lib/reservations/service';
import { isAdminAuthorized } from '@/lib/adminAuth';
import { adminUpdateSchema } from '@/lib/reservations/validation';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!isAdminAuthorized(req)) {
        return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const { id } = await params;
    try {
        const body = await req.json();
        const parsed = adminUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: 'INVALID_REQUEST', details: parsed.error.format() }, { status: 400 });
        }

        if (parsed.data.status) {
            const reservation = await ReservationService.updateStatus(id, parsed.data.status, parsed.data.notes);
            return NextResponse.json(reservation);
        }

        return NextResponse.json({ error: 'NOT_IMPLEMENTED' }, { status: 501 });
    } catch (error) {
        return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ReservationService } from '@/lib/reservations/service';
import { isBefore, parseISO, subHours } from 'date-fns';

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    try {
        const reservation = await (prisma as any).reservation.findUnique({
            where: { editToken: token },
            include: { assignments: true }
        });

        if (!reservation) {
            return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
        }

        return NextResponse.json(reservation);
    } catch (error) {
        return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ token: string }> }) {
    const { token } = await params;
    try {
        const reservation = await (prisma as any).reservation.findUnique({
            where: { editToken: token }
        });

        if (!reservation) {
            return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
        }

        // Check modification window (e.g., 2 hours before)
        const reservationTime = parseISO(`${reservation.reservationDate}T${reservation.startTime}:00`);
        const limit = subHours(reservationTime, 2);
        
        if (isBefore(new Date(), limit)) {
             const body = await req.json();
             if (body.action === 'CANCEL') {
                 await ReservationService.updateStatus(reservation.id, 'CANCELLED', 'Cancelled by guest');
                 return NextResponse.json({ success: true });
             }
        } else {
            return NextResponse.json({ error: 'TOO_LATE_TO_MODIFY' }, { status: 403 });
        }

        return NextResponse.json({ error: 'INVALID_ACTION' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
    }
}

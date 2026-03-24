import { NextResponse } from 'next/server';
import { ReservationService } from '@/lib/reservations/service';
import { bookingRequestSchema } from '@/lib/reservations/validation';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = bookingRequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: 'INVALID_REQUEST', details: parsed.error.format() }, { status: 400 });
        }

        const reservation = await ReservationService.createReservation(parsed.data);

        return NextResponse.json(reservation);
    } catch (error: any) {
        if (error.message === 'SLOT_NO_LONGER_AVAILABLE') {
            return NextResponse.json({ error: 'SLOT_NO_LONGER_AVAILABLE' }, { status: 409 });
        }
        console.error('[Booking API Error]:', error);
        return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
    }
}

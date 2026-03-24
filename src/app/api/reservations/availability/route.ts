import { NextResponse } from 'next/server';
import { ReservationService } from '@/lib/reservations/service';
import { availabilityRequestSchema } from '@/lib/reservations/validation';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = availabilityRequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: 'INVALID_REQUEST', details: parsed.error.format() }, { status: 400 });
        }

        const slots = await ReservationService.checkAvailability(
            parsed.data.storeId,
            parsed.data.partySize,
            parsed.data.reservationDate
        );

        return NextResponse.json({ availableSlots: slots });
    } catch (error) {
        console.error('[Availability API Error]:', error);
        return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
    }
}

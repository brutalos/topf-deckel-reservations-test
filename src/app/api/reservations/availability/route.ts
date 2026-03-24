import { NextResponse } from 'next/server';
import { ReservationService } from '@/lib/reservations/service';
import { availabilityRequestSchema } from '@/lib/reservations/validation';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('[Availability API] Body:', body);
        const parsed = availabilityRequestSchema.safeParse(body);

        if (!parsed.success) {
            console.log('[Availability API] Validation Failed:', parsed.error.format());
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
        if (error instanceof Error) {
            return NextResponse.json({ error: 'SERVER_ERROR', message: error.message, stack: error.stack }, { status: 500 });
        }
        return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
    }
}

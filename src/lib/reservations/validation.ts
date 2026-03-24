import { z } from 'zod';

export const availabilityRequestSchema = z.object({
    storeId: z.string(),
    partySize: z.number().min(1).max(10),
    reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
});

export const bookingRequestSchema = z.object({
    storeId: z.string(),
    partySize: z.number().min(1).max(10),
    reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    startTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:mm
    guestName: z.string().min(2),
    guestEmail: z.string().email(),
    guestPhone: z.string().min(5),
    notes: z.string().optional(),
});

export const adminUpdateSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'NO_SHOW', 'CANCELLED']).optional(),
    tableId: z.string().optional(),
    notes: z.string().optional(),
});

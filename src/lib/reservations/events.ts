type ReservationEventType = 
    | 'reservation.created' 
    | 'reservation.updated' 
    | 'reservation.cancelled' 
    | 'reservation.seated' 
    | 'reservation.completed' 
    | 'reservation.no_show';

export interface ReservationEvent {
    type: ReservationEventType;
    reservationId: string;
    payload?: any;
}

export function emitReservationEvent(event: ReservationEvent) {
    console.log(`[Reservation Event]: ${event.type} for ${event.reservationId}`, event.payload);
    // Future: Add webhooks, email triggers, etc.
}

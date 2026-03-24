export type ReservationStatus = 
    | 'PENDING' 
    | 'CONFIRMED' 
    | 'SEATED' 
    | 'COMPLETED' 
    | 'NO_SHOW' 
    | 'CANCELLED';

export type ReservationAction = 
    | 'STATUS_CHANGE' 
    | 'EDITED' 
    | 'CANCELLED' 
    | 'CREATED';

export interface ReservationSlot {
    tableId: string;
    slotDateTime: string;
}

export interface AvailabilityResult {
    availableSlots: string[]; // ISO time strings
}

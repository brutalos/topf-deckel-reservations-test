// Copy and adapt.
// Suggested target: src/features/reservations/server/types.ts

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "NO_SHOW"
  | "SEATED"
  | "COMPLETED";

export type AvailabilityRequest = {
  locationId: string;
  date: string; // YYYY-MM-DD in the location timezone
  partySize: number;
  areaPreference?: string;
};

export type AvailabilitySlot = {
  startAt: string;
  endAt: string;
  displayLabel: string;
  bookable: boolean;
  reasons: string[];
  // Keep inventory opaque in public APIs. This field is optional for admin/internal use only.
  candidateComboId?: string;
};

export type CreateReservationInput = {
  locationId: string;
  startAt: string;
  partySize: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  specialRequests?: string;
  areaPreference?: string;
};

export type UpdateReservationInput = {
  startAt?: string;
  partySize?: number;
  customerName?: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  specialRequests?: string | null;
  internalNotes?: string | null;
  status?: ReservationStatus;
  areaPreference?: string | null;
};

export type AdminListReservationsQuery = {
  locationId?: string;
  date?: string;
  status?: ReservationStatus;
  search?: string;
};

export type ReservationEventType =
  | "reservation.created"
  | "reservation.updated"
  | "reservation.cancelled"
  | "reservation.seated"
  | "reservation.completed"
  | "reservation.no_show";

export type ReservationEventAudience = "booker" | "location";

export type ReservationEvent = {
  type: ReservationEventType;
  audience: ReservationEventAudience;
  reservationId: string;
  locationId: string;
  occurredAt: string;
  payload: Record<string, unknown>;
};

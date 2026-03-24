// Copy and adapt.
// Suggested target: src/features/reservations/ui/ReservationWidget.tsx

"use client";

import { useMemo, useState } from "react";

type AvailabilitySlot = {
  startAt: string;
  endAt: string;
  displayLabel: string;
  bookable: boolean;
  reasons: string[];
};

type Props = {
  locationId: string;
};

export function ReservationWidget({ locationId }: Props) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState(today);
  const [areaPreference, setAreaPreference] = useState("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedStartAt, setSelectedStartAt] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<null | {
    referenceCode: string;
    status: string;
  }>(null);
  const [error, setError] = useState("");

  async function loadAvailability() {
    setLoading(true);
    setError("");
    setSelectedStartAt("");

    try {
      const response = await fetch("/api/reservations/availability", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locationId,
          date,
          partySize,
          areaPreference: areaPreference || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to load availability.");
      }

      setSlots(data.slots ?? []);
    } catch (err: any) {
      setError(err.message ?? "Failed to load availability.");
    } finally {
      setLoading(false);
    }
  }

  async function submitReservation() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locationId,
          startAt: selectedStartAt,
          partySize,
          customerName,
          customerEmail: customerEmail || undefined,
          customerPhone: customerPhone || undefined,
          specialRequests: specialRequests || undefined,
          areaPreference: areaPreference || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to create reservation.");
      }

      setConfirmation({
        referenceCode: data.referenceCode,
        status: data.status,
      });
    } catch (err: any) {
      setError(err.message ?? "Failed to create reservation.");
    } finally {
      setLoading(false);
    }
  }

  if (confirmation) {
    return (
      <section className="space-y-3 rounded-xl border p-6">
        <h2 className="text-xl font-semibold">Reservation confirmed</h2>
        <p>Your reference code is <strong>{confirmation.referenceCode}</strong>.</p>
        <p>Status: {confirmation.status}</p>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-xl border p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Book a table</h2>
        <p className="text-sm text-muted-foreground">
          Choose a party size and date to see available times.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <label className="space-y-1">
          <span className="text-sm font-medium">Party size</span>
          <input
            type="number"
            min={1}
            value={partySize}
            onChange={(event) => setPartySize(Number(event.target.value))}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Area preference</span>
          <input
            type="text"
            placeholder="Optional"
            value={areaPreference}
            onChange={(event) => setAreaPreference(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={loadAvailability}
            disabled={loading}
            className="w-full rounded-md border px-4 py-2"
          >
            {loading ? "Loading..." : "Find times"}
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {slots.length > 0 ? (
        <div className="space-y-3">
          <h3 className="font-medium">Available times</h3>
          <div className="flex flex-wrap gap-2">
            {slots
              .filter((slot) => slot.bookable)
              .map((slot) => (
                <button
                  key={slot.startAt}
                  type="button"
                  onClick={() => setSelectedStartAt(slot.startAt)}
                  className={`rounded-md border px-3 py-2 ${
                    selectedStartAt === slot.startAt ? "font-semibold" : ""
                  }`}
                >
                  {slot.displayLabel}
                </button>
              ))}
          </div>
        </div>
      ) : null}

      {selectedStartAt ? (
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Name</span>
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Phone</span>
            <input
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-medium">Special requests</span>
            <textarea
              value={specialRequests}
              onChange={(event) => setSpecialRequests(event.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={submitReservation}
              disabled={loading || !customerName}
              className="rounded-md border px-4 py-2"
            >
              {loading ? "Submitting..." : "Confirm reservation"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

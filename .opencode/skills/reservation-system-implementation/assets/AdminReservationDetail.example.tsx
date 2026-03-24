// Copy and adapt.
// Suggested target: src/features/reservations/ui/AdminReservationDetail.tsx

type ReservationDetail = {
  id: string;
  referenceCode: string;
  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  specialRequests?: string | null;
  internalNotes?: string | null;
  partySize: number;
  status: string;
  reservedFrom: string;
  reservedUntil: string;
  assignments: Array<{ tableName?: string | null; tableId: string }>;
  audits?: Array<{ id: string; action: string; createdAt: string; note?: string | null }>;
};

type Props = {
  reservation: ReservationDetail;
  onAction?: (action: string) => void;
};

export function AdminReservationDetail({ reservation, onAction }: Props) {
  return (
    <aside className="space-y-6 rounded-xl border p-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">{reservation.customerName}</h2>
        <p className="text-sm text-muted-foreground">
          Reference: {reservation.referenceCode}
        </p>
      </header>

      <dl className="grid gap-3 md:grid-cols-2">
        <div>
          <dt className="text-sm text-muted-foreground">Status</dt>
          <dd>{reservation.status}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Party size</dt>
          <dd>{reservation.partySize}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Start</dt>
          <dd>{reservation.reservedFrom}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">End</dt>
          <dd>{reservation.reservedUntil}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Phone</dt>
          <dd>{reservation.customerPhone ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Email</dt>
          <dd>{reservation.customerEmail ?? "—"}</dd>
        </div>
      </dl>

      <div>
        <h3 className="font-medium">Assigned tables</h3>
        <p className="text-sm text-muted-foreground">
          {reservation.assignments
            .map((item) => item.tableName ?? item.tableId)
            .join(", ") || "None"}
        </p>
      </div>

      <div>
        <h3 className="font-medium">Special requests</h3>
        <p className="text-sm text-muted-foreground">
          {reservation.specialRequests ?? "None"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-md border px-3 py-2" onClick={() => onAction?.("CONFIRMED")}>
          Confirm
        </button>
        <button type="button" className="rounded-md border px-3 py-2" onClick={() => onAction?.("SEATED")}>
          Mark seated
        </button>
        <button type="button" className="rounded-md border px-3 py-2" onClick={() => onAction?.("COMPLETED")}>
          Complete
        </button>
        <button type="button" className="rounded-md border px-3 py-2" onClick={() => onAction?.("NO_SHOW")}>
          No-show
        </button>
        <button type="button" className="rounded-md border px-3 py-2" onClick={() => onAction?.("CANCELLED")}>
          Cancel
        </button>
      </div>

      {reservation.audits?.length ? (
        <div className="space-y-2">
          <h3 className="font-medium">Recent activity</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {reservation.audits.map((audit) => (
              <li key={audit.id}>
                <div>{audit.action}</div>
                <div>{audit.createdAt}</div>
                {audit.note ? <div>{audit.note}</div> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}

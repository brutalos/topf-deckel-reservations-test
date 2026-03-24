// Copy and adapt.
// Suggested target: src/features/reservations/ui/AdminReservationsPage.tsx

type ReservationRow = {
  id: string;
  referenceCode: string;
  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  partySize: number;
  status: string;
  reservedFrom: string;
  assignments: Array<{ tableName?: string | null; tableId: string }>;
};

type Props = {
  items: ReservationRow[];
  onSelectReservation?: (reservationId: string) => void;
};

export function AdminReservationsPage({
  items,
  onSelectReservation,
}: Props) {
  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reservations</h1>
          <p className="text-sm text-muted-foreground">
            Manage upcoming and past reservations.
          </p>
        </div>

        <a href="/admin/reservations/new" className="rounded-md border px-4 py-2">
          New reservation
        </a>
      </header>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full divide-y">
          <thead>
            <tr className="text-left text-sm">
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Party</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tables</th>
              <th className="px-4 py-3">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {items.map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer hover:bg-muted/40"
                onClick={() => onSelectReservation?.(item.id)}
              >
                <td className="px-4 py-3">{item.reservedFrom}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{item.customerName}</div>
                  <div className="text-muted-foreground">
                    {item.customerPhone ?? item.customerEmail ?? "—"}
                  </div>
                </td>
                <td className="px-4 py-3">{item.partySize}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">
                  {item.assignments.map((assignment) => assignment.tableName ?? assignment.tableId).join(", ")}
                </td>
                <td className="px-4 py-3">{item.referenceCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

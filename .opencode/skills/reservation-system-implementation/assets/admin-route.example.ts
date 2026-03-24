// Copy and adapt.
// Suggested targets:
// - app/api/admin/reservations/route.ts
// - app/api/admin/reservations/[id]/route.ts
// - app/api/admin/reservation-blocks/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reservationConfig } from "@/config/reservations";
import { validateReservationConfig } from "@/features/reservations/server/config-schema";
import {
  createReservation,
  listReservations,
  updateReservation,
} from "@/features/reservations/server/service";

const config = validateReservationConfig(reservationConfig);

async function requireAdmin() {
  // Replace with the repo's real auth guard.
  // Throw or return a user object as needed.
  return { id: "admin-user-id" };
}

// GET /api/admin/reservations
export async function GET(request: NextRequest) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const items = await listReservations({
    prisma,
    query: {
      locationId: searchParams.get("locationId") ?? undefined,
      date: searchParams.get("date") ?? undefined,
      status: (searchParams.get("status") as any) ?? undefined,
      search: searchParams.get("search") ?? undefined,
    },
  });

  return NextResponse.json({ items });
}

// POST /api/admin/reservations
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  const input = await request.json();

  const reservation = await createReservation({
    prisma,
    config,
    input,
    actor: { type: "ADMIN", id: admin.id },
  });

  return NextResponse.json({ reservation }, { status: 201 });
}

// PATCH /api/admin/reservations/[id]
export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  const { reservationId, ...input } = await request.json();

  const reservation = await updateReservation({
    prisma,
    config,
    reservationId,
    input,
    actor: { type: "ADMIN", id: admin.id },
  });

  return NextResponse.json({ reservation }, { status: 200 });
}

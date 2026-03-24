// Copy and adapt.
// Suggested target: app/api/reservations/availability/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reservationConfig } from "@/config/reservations";
import { validateReservationConfig } from "@/features/reservations/server/config-schema";
import { getAvailability } from "@/features/reservations/server/service";

const config = validateReservationConfig(reservationConfig);

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();

    const result = await getAvailability({
      prisma,
      config,
      input,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[reservation-availability]", error);
    return NextResponse.json(
      { error: "Failed to load reservation availability." },
      { status: 400 },
    );
  }
}

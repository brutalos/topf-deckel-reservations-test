// Copy and adapt.
// Suggested target: app/api/reservations/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reservationConfig } from "@/config/reservations";
import { validateReservationConfig } from "@/features/reservations/server/config-schema";
import { createReservation } from "@/features/reservations/server/service";

const config = validateReservationConfig(reservationConfig);

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();

    const reservation = await createReservation({
      prisma,
      config,
      input,
      actor: { type: "PUBLIC" },
    });

    return NextResponse.json(
      {
        reservationId: reservation.id,
        referenceCode: reservation.referenceCode,
        status: reservation.status,
        startAt: reservation.reservedFrom.toISOString(),
        endAt: reservation.reservedUntil.toISOString(),
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error?.code === "RESERVATION_CONFLICT") {
      return NextResponse.json(
        {
          error: "The selected time is no longer available. Please choose another slot.",
        },
        { status: 409 },
      );
    }

    console.error("[reservation-create]", error);
    return NextResponse.json(
      { error: "Failed to create reservation." },
      { status: 400 },
    );
  }
}

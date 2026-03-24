// Copy and adapt.
// Suggested target: src/features/reservations/server/service.ts

import type { PrismaClient, ReservationStatus as PrismaReservationStatus } from "@prisma/client";
import { buildCandidateAssignments, pickBestAssignment } from "./allocator";
import type {
  AdminListReservationsQuery,
  AvailabilityRequest,
  CreateReservationInput,
  UpdateReservationInput,
} from "./types";
import { getLocationConfig } from "./config-schema";

const ACTIVE_STATUSES: PrismaReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SEATED",
];

function generateReferenceCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function getDurationMinutesForPartySize(location: any, partySize: number): number {
  const match = location.durationByPartySize.find(
    (rule: any) =>
      partySize >= rule.minPartySize && partySize <= rule.maxPartySize,
  );

  return match?.durationMinutes ?? location.defaultDurationMinutes;
}

export async function listReservations(params: {
  prisma: PrismaClient;
  query: AdminListReservationsQuery;
}) {
  const { prisma, query } = params;

  return prisma.reservation.findMany({
    where: {
      locationId: query.locationId,
      status: query.status,
      ...(query.date
        ? {
            reservedFrom: {
              gte: new Date(`${query.date}T00:00:00.000Z`),
              lt: new Date(`${query.date}T23:59:59.999Z`),
            },
          }
        : {}),
      ...(query.search
        ? {
            OR: [
              { customerName: { contains: query.search, mode: "insensitive" } },
              { customerEmail: { contains: query.search, mode: "insensitive" } },
              { customerPhone: { contains: query.search, mode: "insensitive" } },
              { referenceCode: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      assignments: true,
    },
    orderBy: [{ reservedFrom: "asc" }],
  });
}

export async function getAvailability(params: {
  prisma: PrismaClient;
  config: any;
  input: AvailabilityRequest;
}) {
  const { prisma, config, input } = params;
  const location = getLocationConfig(config, input.locationId);

  // Replace this naive UTC date handling with the repo's timezone utilities if present.
  const dateStart = new Date(`${input.date}T00:00:00.000Z`);
  const dateEnd = new Date(`${input.date}T23:59:59.999Z`);

  const existingAssignments = await prisma.reservationTableAssignment.findMany({
    where: {
      locationId: input.locationId,
      active: true,
      reservedFrom: { lt: dateEnd },
      reservedUntil: { gt: dateStart },
      reservation: {
        status: { in: ACTIVE_STATUSES },
      },
    },
  });

  const activeBlocks = await prisma.reservationBlock.findMany({
    where: {
      locationId: input.locationId,
      active: true,
      startsAt: { lt: dateEnd },
      endsAt: { gt: dateStart },
    },
  });

  const durationMinutes = getDurationMinutesForPartySize(
    location,
    input.partySize,
  );

  // The repo should replace this with real slot generation using service windows + timezone-aware helpers.
  const slots: Array<{
    startAt: string;
    endAt: string;
    displayLabel: string;
    bookable: boolean;
    reasons: string[];
  }> = [];

  for (const window of location.serviceWindows) {
    const currentDay = dateStart.getUTCDay() === 0 ? 7 : dateStart.getUTCDay();
    if (!window.daysOfWeek.includes(currentDay)) continue;

    const [startHour, startMinute] = window.start.split(":").map(Number);
    const [endHour, endMinute] = window.end.split(":").map(Number);

    let cursor = new Date(dateStart);
    cursor.setUTCHours(startHour, startMinute, 0, 0);

    const windowEnd = new Date(dateStart);
    windowEnd.setUTCHours(endHour, endMinute, 0, 0);

    while (cursor < windowEnd) {
      const slotStart = new Date(cursor);
      const slotEnd = addMinutes(slotStart, durationMinutes);

      if (slotEnd <= windowEnd) {
        const candidates = buildCandidateAssignments({
          tables: location.tables,
          combinations: location.tableCombinations,
          assignments: existingAssignments,
          blocks: activeBlocks,
          slotStart,
          slotEnd,
          partySize: input.partySize,
          areaPreference: input.areaPreference,
        });

        slots.push({
          startAt: slotStart.toISOString(),
          endAt: slotEnd.toISOString(),
          displayLabel: slotStart.toISOString(),
          bookable: candidates.length > 0,
          reasons: candidates.length > 0 ? [] : ["NO_TABLE_AVAILABLE"],
        });
      }

      cursor = addMinutes(cursor, location.slotIntervalMinutes);
    }
  }

  return { slots };
}

export async function createReservation(params: {
  prisma: PrismaClient;
  config: any;
  input: CreateReservationInput;
  actor?: { type: string; id?: string | null };
}) {
  const { prisma, config, input, actor } = params;
  const location = getLocationConfig(config, input.locationId);

  return prisma.$transaction(async (tx) => {
    // If Prisma uses PostgreSQL and the codebase needs stronger hot-slot serialization,
    // add a raw advisory lock here based on location + startAt.

    const startAt = new Date(input.startAt);
    const durationMinutes = getDurationMinutesForPartySize(
      location,
      input.partySize,
    );
    const endAt = addMinutes(startAt, durationMinutes);

    const overlappingAssignments = await tx.reservationTableAssignment.findMany({
      where: {
        locationId: input.locationId,
        active: true,
        reservedFrom: { lt: endAt },
        reservedUntil: { gt: startAt },
        reservation: {
          status: { in: ACTIVE_STATUSES },
        },
      },
    });

    const activeBlocks = await tx.reservationBlock.findMany({
      where: {
        locationId: input.locationId,
        active: true,
        startsAt: { lt: endAt },
        endsAt: { gt: startAt },
      },
    });

    const candidates = buildCandidateAssignments({
      tables: location.tables,
      combinations: location.tableCombinations,
      assignments: overlappingAssignments,
      blocks: activeBlocks,
      slotStart: startAt,
      slotEnd: endAt,
      partySize: input.partySize,
      areaPreference: input.areaPreference,
    });

    const picked = pickBestAssignment(candidates);
    if (!picked) {
      const error = new Error("Requested slot is no longer available.");
      (error as any).code = "RESERVATION_CONFLICT";
      throw error;
    }

    const reservation = await tx.reservation.create({
      data: {
        referenceCode: generateReferenceCode(),
        locationId: input.locationId,
        locationSlug: location.slug,
        status: location.defaultStatus,
        source: "PUBLIC",
        partySize: input.partySize,
        reservedFrom: startAt,
        reservedUntil: endAt,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        specialRequests: input.specialRequests,
        areaPreference: input.areaPreference,
        assignedComboId: picked.comboId,
        configVersion: config.version,
      },
    });

    await tx.reservationTableAssignment.createMany({
      data: picked.tableIds.map((tableId) => {
        const table = location.tables.find((item: any) => item.id === tableId);
        return {
          reservationId: reservation.id,
          locationId: input.locationId,
          tableId,
          tableName: table?.name,
          areaId: table?.areaId,
          comboId: picked.comboId,
          reservedFrom: startAt,
          reservedUntil: endAt,
          active: true,
        };
      }),
    });

    await tx.reservationAuditLog.create({
      data: {
        reservationId: reservation.id,
        action: "CREATED",
        actorType: actor?.type ?? "PUBLIC",
        actorId: actor?.id ?? null,
        after: {
          status: reservation.status,
          reservedFrom: reservation.reservedFrom.toISOString(),
          reservedUntil: reservation.reservedUntil.toISOString(),
          assignedTableIds: picked.tableIds,
        },
      },
    });

    return tx.reservation.findUniqueOrThrow({
      where: { id: reservation.id },
      include: { assignments: true },
    });
  });
}

export async function updateReservation(params: {
  prisma: PrismaClient;
  config: any;
  reservationId: string;
  input: UpdateReservationInput;
  actor?: { type: string; id?: string | null };
}) {
  const { prisma, reservationId, input, actor } = params;

  // Keep this function as the single place for admin edits and status transitions.
  // If date/time/party size changes, re-run allocation with the same create-time rules.
  // If status changes to CANCELLED/COMPLETED/NO_SHOW, release active assignments.
  // Always write an audit log entry.
  return prisma.$transaction(async (tx) => {
    const existing = await tx.reservation.findUniqueOrThrow({
      where: { id: reservationId },
      include: { assignments: true },
    });

    const updated = await tx.reservation.update({
      where: { id: reservationId },
      data: {
        customerName: input.customerName ?? undefined,
        customerEmail:
          input.customerEmail === null ? null : input.customerEmail ?? undefined,
        customerPhone:
          input.customerPhone === null ? null : input.customerPhone ?? undefined,
        specialRequests:
          input.specialRequests === null
            ? null
            : input.specialRequests ?? undefined,
        internalNotes:
          input.internalNotes === null
            ? null
            : input.internalNotes ?? undefined,
        areaPreference:
          input.areaPreference === null
            ? null
            : input.areaPreference ?? undefined,
        status: input.status ?? undefined,
        cancelledAt: input.status === "CANCELLED" ? new Date() : undefined,
        seatedAt: input.status === "SEATED" ? new Date() : undefined,
        completedAt: input.status === "COMPLETED" ? new Date() : undefined,
        noShowAt: input.status === "NO_SHOW" ? new Date() : undefined,
      },
    });

    if (
      input.status &&
      ["CANCELLED", "COMPLETED", "NO_SHOW"].includes(input.status)
    ) {
      await tx.reservationTableAssignment.updateMany({
        where: { reservationId, active: true },
        data: { active: false, releasedAt: new Date() },
      });
    }

    await tx.reservationAuditLog.create({
      data: {
        reservationId,
        action: input.status ? "STATUS_CHANGED" : "UPDATED",
        actorType: actor?.type ?? "ADMIN",
        actorId: actor?.id ?? null,
        before: {
          status: existing.status,
        },
        after: {
          status: updated.status,
        },
      },
    });

    return tx.reservation.findUniqueOrThrow({
      where: { id: reservationId },
      include: { assignments: true, audits: true },
    });
  });
}

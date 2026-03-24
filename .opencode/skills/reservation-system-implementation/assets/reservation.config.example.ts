// Copy and adapt.
// Suggested target: src/config/reservations.ts

import type { ReservationSystemConfig } from "@/features/reservations/server/config-schema";

export const reservationConfig = {
  version: 1,
  timezone: "Europe/Vienna",
  bookingWindowDays: 60,
  publicDefaults: {
    requirePhone: true,
    requireEmail: false,
    allowSpecialRequests: true,
  },
  locations: [
    {
      id: "main",
      slug: "main",
      name: "Main Restaurant",
      timezone: "Europe/Vienna",
      bookingWindowDays: 60,
      leadTimeMinutes: 90,
      cancellationCutoffMinutes: 120,
      slotIntervalMinutes: 15,
      defaultDurationMinutes: 90,
      durationByPartySize: [
        { minPartySize: 1, maxPartySize: 2, durationMinutes: 90 },
        { minPartySize: 3, maxPartySize: 4, durationMinutes: 105 },
        { minPartySize: 5, maxPartySize: 8, durationMinutes: 120 },
      ],
      minPartySize: 1,
      maxPartySize: 8,
      defaultStatus: "CONFIRMED",
      serviceWindows: [
        { daysOfWeek: [2, 3, 4, 5], start: "17:00", end: "22:00" },
        { daysOfWeek: [6, 7], start: "12:00", end: "22:30" },
      ],
      closures: [
        // { date: "2026-12-24", reason: "Closed for holiday" },
      ],
      areas: [
        { id: "main-dining", name: "Main Dining" },
        { id: "patio", name: "Patio" },
      ],
      publicPreferences: {
        allowAreaPreference: true,
        allowedAreaIds: ["main-dining", "patio"],
      },
      tables: [
        {
          id: "T1",
          name: "Table 1",
          areaId: "main-dining",
          minPartySize: 1,
          maxPartySize: 2,
          priority: 10,
        },
        {
          id: "T2",
          name: "Table 2",
          areaId: "main-dining",
          minPartySize: 1,
          maxPartySize: 2,
          priority: 20,
        },
        {
          id: "T3",
          name: "Table 3",
          areaId: "main-dining",
          minPartySize: 2,
          maxPartySize: 4,
          priority: 10,
        },
        {
          id: "T4",
          name: "Table 4",
          areaId: "main-dining",
          minPartySize: 2,
          maxPartySize: 4,
          priority: 20,
        },
        {
          id: "P1",
          name: "Patio 1",
          areaId: "patio",
          minPartySize: 2,
          maxPartySize: 4,
          priority: 10,
        },
      ],
      tableCombinations: [
        {
          id: "T3-T4",
          tableIds: ["T3", "T4"],
          minPartySize: 5,
          maxPartySize: 8,
          priority: 10,
        },
      ],
      notifications: {
        emitBookerEvents: true,
        emitLocationEvents: true,
      },
    },
  ],
} satisfies ReservationSystemConfig;

// Copy and adapt.
// Suggested target: src/features/reservations/server/config-schema.ts

import { z } from "zod";

export const reservationStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "NO_SHOW",
  "SEATED",
  "COMPLETED",
]);

const durationRuleSchema = z.object({
  minPartySize: z.number().int().positive(),
  maxPartySize: z.number().int().positive(),
  durationMinutes: z.number().int().positive(),
});

const serviceWindowSchema = z.object({
  daysOfWeek: z.array(z.number().int().min(1).max(7)).min(1),
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
});

const closureSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().optional(),
});

const areaSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

const tableSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  areaId: z.string().min(1),
  minPartySize: z.number().int().positive(),
  maxPartySize: z.number().int().positive(),
  priority: z.number().int().default(100),
});

const tableCombinationSchema = z.object({
  id: z.string().min(1),
  tableIds: z.array(z.string().min(1)).min(2),
  minPartySize: z.number().int().positive(),
  maxPartySize: z.number().int().positive(),
  priority: z.number().int().default(100),
});

const locationSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  timezone: z.string().min(1),
  bookingWindowDays: z.number().int().positive().default(60),
  leadTimeMinutes: z.number().int().nonnegative().default(90),
  cancellationCutoffMinutes: z.number().int().nonnegative().default(120),
  slotIntervalMinutes: z.number().int().positive().default(15),
  defaultDurationMinutes: z.number().int().positive().default(90),
  durationByPartySize: z.array(durationRuleSchema).default([]),
  minPartySize: z.number().int().positive().default(1),
  maxPartySize: z.number().int().positive().default(8),
  defaultStatus: reservationStatusSchema.default("CONFIRMED"),
  serviceWindows: z.array(serviceWindowSchema).min(1),
  closures: z.array(closureSchema).default([]),
  areas: z.array(areaSchema).min(1),
  publicPreferences: z
    .object({
      allowAreaPreference: z.boolean().default(false),
      allowedAreaIds: z.array(z.string()).default([]),
    })
    .default({ allowAreaPreference: false, allowedAreaIds: [] }),
  tables: z.array(tableSchema).min(1),
  tableCombinations: z.array(tableCombinationSchema).default([]),
  notifications: z
    .object({
      emitBookerEvents: z.boolean().default(true),
      emitLocationEvents: z.boolean().default(true),
    })
    .default({ emitBookerEvents: true, emitLocationEvents: true }),
});

export const reservationSystemConfigSchema = z.object({
  version: z.number().int().positive().default(1),
  timezone: z.string().min(1),
  bookingWindowDays: z.number().int().positive().default(60),
  publicDefaults: z
    .object({
      requirePhone: z.boolean().default(true),
      requireEmail: z.boolean().default(false),
      allowSpecialRequests: z.boolean().default(true),
    })
    .default({
      requirePhone: true,
      requireEmail: false,
      allowSpecialRequests: true,
    }),
  locations: z.array(locationSchema).min(1),
});

export type ReservationSystemConfig = z.infer<
  typeof reservationSystemConfigSchema
>;
export type ReservationLocationConfig = ReservationSystemConfig["locations"][number];
export type ReservationStatus = z.infer<typeof reservationStatusSchema>;

export function validateReservationConfig<T>(config: T): ReservationSystemConfig {
  return reservationSystemConfigSchema.parse(config);
}

export function getLocationConfig(
  config: ReservationSystemConfig,
  locationId: string,
): ReservationLocationConfig {
  const location = config.locations.find((item) => item.id === locationId);
  if (!location) {
    throw new Error(`Unknown reservation location: ${locationId}`);
  }
  return location;
}

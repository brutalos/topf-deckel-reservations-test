-- PostgreSQL-only example. Adapt table names to the generated migration.
-- Useful when Prisma is backed by Postgres and you want stronger overlap protection.

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Prevent two active assignments for the same table from overlapping.
ALTER TABLE "ReservationTableAssignment"
  ADD CONSTRAINT reservation_table_assignment_no_overlap
  EXCLUDE USING gist (
    "locationId" WITH =,
    "tableId" WITH =,
    tstzrange("reservedFrom", "reservedUntil", '[)') WITH &&
  )
  WHERE ("active");

-- Prevent two active TABLE-scoped blocks for the same table from overlapping.
ALTER TABLE "ReservationBlock"
  ADD CONSTRAINT reservation_block_table_no_overlap
  EXCLUDE USING gist (
    "locationId" WITH =,
    "tableId" WITH =,
    tstzrange("startsAt", "endsAt", '[)') WITH &&
  )
  WHERE ("active" AND "scope" = 'TABLE');

-- Notes:
-- 1) This does NOT replace transactional revalidation in application code.
-- 2) Keep ReservationTableAssignment.active = false when a reservation is cancelled,
--    rescheduled, or otherwise no longer blocks inventory.
-- 3) If the repo's DB is not Postgres, skip this file and use the strongest safe
--    transaction/locking strategy available for that provider.

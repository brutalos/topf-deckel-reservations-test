# Architecture and Data Model

## Goal

Implement a **restaurant reservation system inside an existing Next.js + Prisma codebase** without turning it into a separate scheduling platform.

## Reduced-scope architecture

Keep these layers separate:

1. **Config layer**
   - locations
   - hours
   - policies
   - areas
   - tables
   - predefined combinations

2. **Domain/server layer**
   - slot generation
   - allocation
   - create/edit/cancel/status transitions
   - conflict checking
   - event emission

3. **Persistence layer (Prisma)**
   - reservations
   - table assignments
   - audit logs
   - operational blocks

4. **Presentation layer**
   - public booking UI
   - admin list/detail/forms

## What belongs in config vs Prisma

## Config file
Put structural, relatively stable information here:

- location identity
- timezone
- hours / service windows
- booking policy flags
- slot interval
- lead time
- booking window
- default duration
- duration by party size
- areas
- tables
- predefined table combinations

## Prisma
Put transactional or operational data here:

- actual reservations
- active table assignments
- reservation status history / audit log
- manual blocks for specific dates/times/tables/areas
- optional delivery outbox later

## Why not DB-managed table config now?

Because this skill is for adding reservations **inside an existing codebase quickly and safely**. File-based config is simpler, easier to review, and enough for v1. It also avoids building an admin settings editor and migration tooling too early.

## Core Prisma entities

### `Reservation`
The booking record shown to admins and guests.

Recommended fields:

- `id`
- `referenceCode`
- `locationId`
- `locationSlug`
- `status`
- `source`
- `partySize`
- `reservedFrom`
- `reservedUntil`
- customer details
- guest-facing notes / special requests
- internal notes
- optional area preference
- timestamps for cancel/seated/completed/no-show
- `configVersion` or equivalent if helpful

### `ReservationTableAssignment`
The tables that currently block inventory for a reservation.

Important design choice:

- keep `reservedFrom` and `reservedUntil` on the assignment row too

Why:
- easier overlap checks
- easier DB-level constraints in Postgres
- easier release/deactivation logic

Recommended fields:

- `reservationId`
- `locationId`
- `tableId`
- `tableName`
- `areaId`
- `comboId`
- `reservedFrom`
- `reservedUntil`
- `active`
- `releasedAt`

### `ReservationBlock`
Manual operational closures.

Use this for:
- private events
- broken table
- section unavailable
- holiday/service exception entered by admin

Recommended scopes:
- `LOCATION`
- `AREA`
- `TABLE`

### `ReservationAuditLog`
Track mutations and status changes.

Use this for:
- creation
- edits
- status changes
- assignment changes
- block actions
- manual notes about why something changed

## Recommended status model

Keep it simple:

- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `NO_SHOW`
- `SEATED`
- `COMPLETED`

Default public flow:
- `CONFIRMED`

If manual approval is enabled:
- `PENDING` on create
- admin changes to `CONFIRMED` later

## Allocation model

This skill is **inventory-first** even inside one app.

A reservation claims:

- one location
- one time window
- one best-fit table or predefined table combination

### v1 rule
Use **predefined combinations only**.

Do not implement generic “search every possible connected table merge graph” unless explicitly asked.

## Best-fit ranking for tables

Prefer, in order:

1. smallest total capacity that fits the party
2. fewer tables
3. lower priority score / preferred table ranking from config
4. preferred area when requested and allowed

## Availability search

Availability should consider all of:

- service windows
- closures
- lead time
- booking window
- active reservations
- active blocks
- party-size fit
- predefined combination compatibility

Public availability responses should not expose raw internal table IDs.

## Conflict prevention

## Always re-check in a transaction
When writing a reservation or rescheduling:

1. start transaction
2. re-read overlapping active assignments/blocks
3. select a valid assignment
4. write reservation and active assignments
5. write audit log

## Postgres-specific enhancement
If Prisma uses PostgreSQL:

- use raw SQL in migrations for exclusion constraints where helpful
- use transaction-scoped locking in hot paths if needed

See `assets/postgres-constraints.sql`.

## DB-provider notes

### PostgreSQL
Best fit. Use it if available.

### MySQL
Acceptable, but some overlap-prevention patterns are less elegant. Use transactions and careful writes.

### SQLite
Fine for development or very low-risk single-user testing, but warn about production contention and correctness limits.

## Event modularity

Create one small event adapter layer and emit reservation lifecycle events from domain functions, not from UI components.

Two audiences should exist in the model from day one:

- `booker`
- `location`

This lets the repo add webhooks, email, SMS, or internal notifications later without changing core reservation logic.

## Route and file placement

Follow the repo’s existing style first.

Fallback suggestion:

```text
src/
  config/
    reservations.ts
  features/
    reservations/
      server/
        allocator.ts
        service.ts
        channels.ts
        config-schema.ts
        types.ts
      ui/
        ReservationWidget.tsx
        AdminReservationsPage.tsx
        AdminReservationDetail.tsx
```

## Do not overbuild

Do not add:

- payments
- waitlists
- walk-ins
- table map drag/drop
- customer CRM
- generic cross-vertical service segments
- calendar sync
- file-writing admin settings editor

Those can come later.

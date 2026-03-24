# Reference Index

Use this skill in the following order.

## 1) `01-audit-and-scope.md`
Read this first after the conversation. It tells you:

- what to inspect in the repo
- how to summarize the audit
- which scoping questions are mandatory
- which defaults are safe to assume

## 2) `02-architecture-and-data-model.md`
Read this before changing Prisma or starting backend logic. It covers:

- reduced-scope architecture for this codebase
- what belongs in config vs Prisma
- status model
- allocation model
- conflict prevention
- DB-provider caveats

## 3) `03-api-ui-and-admin.md`
Read this before wiring routes/pages. It covers:

- public API surface
- admin API surface
- public page/section behavior
- admin page behavior
- config summary handling
- event modularity

## 4) `04-testing-and-done.md`
Read this before wrapping up. It includes:

- unit/integration/manual QA matrix
- deployment sanity checks
- done checklist

## 5) `05-copy-map.md`
Read this when you are ready to move from plan to code. It maps asset files to likely target locations.

---

# Asset overview

## Config and schema
- `assets/reservation.config.example.ts`
- `assets/reservation-config.schema.example.ts`

## Prisma and DB
- `assets/prisma-reservation-models.prisma`
- `assets/postgres-constraints.sql`

## Domain/server files
- `assets/reservation-types.example.ts`
- `assets/allocator.example.ts`
- `assets/reservation-service.example.ts`
- `assets/channels.example.ts`

## Route handler examples
- `assets/availability-route.example.ts`
- `assets/create-reservation-route.example.ts`
- `assets/admin-route.example.ts`

## UI examples
- `assets/ReservationWidget.example.tsx`
- `assets/AdminReservationsPage.example.tsx`
- `assets/AdminReservationDetail.example.tsx`

---

# Defaults for this skill

These defaults are already baked into the assets and examples:

- restaurant-focused reservations
- single tenant
- file-based structural config
- Prisma-backed transactional records
- inventory awareness through tables/areas/combinations
- no payments, waitlists, or walk-ins
- future-proof event/channel abstraction
- read-only admin config summary by default

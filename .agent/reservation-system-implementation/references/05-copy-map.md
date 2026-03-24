# Copy Map

Use this map when turning the assets into repo files.

## Fallback target layout

If the repo does not already have a preferred feature layout, use something close to:

```text
src/
  config/
    reservations.ts
  features/
    reservations/
      server/
        config-schema.ts
        types.ts
        allocator.ts
        service.ts
        channels.ts
      ui/
        ReservationWidget.tsx
        AdminReservationsPage.tsx
        AdminReservationDetail.tsx
app/
  api/
    reservations/
      availability/route.ts
      route.ts
    admin/
      reservations/route.ts
      reservations/[id]/route.ts
```

Adapt for `pages/api` if the repo still uses Pages Router.

## Asset -> likely target mapping

### Config
- `assets/reservation.config.example.ts`
  - target: `src/config/reservations.ts`
- `assets/reservation-config.schema.example.ts`
  - target: `src/features/reservations/server/config-schema.ts`

### Prisma / DB
- `assets/prisma-reservation-models.prisma`
  - merge into: `prisma/schema.prisma`
- `assets/postgres-constraints.sql`
  - adapt into a Prisma SQL migration if using PostgreSQL

### Domain
- `assets/reservation-types.example.ts`
  - target: `src/features/reservations/server/types.ts`
- `assets/allocator.example.ts`
  - target: `src/features/reservations/server/allocator.ts`
- `assets/reservation-service.example.ts`
  - target: `src/features/reservations/server/service.ts`
- `assets/channels.example.ts`
  - target: `src/features/reservations/server/channels.ts`

### Routes
- `assets/availability-route.example.ts`
  - target: `app/api/reservations/availability/route.ts`
- `assets/create-reservation-route.example.ts`
  - target: `app/api/reservations/route.ts`
- `assets/admin-route.example.ts`
  - target: adapt into admin list/detail/update/block routes

### UI
- `assets/ReservationWidget.example.tsx`
  - target: public landing page section or `src/features/reservations/ui/ReservationWidget.tsx`
- `assets/AdminReservationsPage.example.tsx`
  - target: `src/features/reservations/ui/AdminReservationsPage.tsx`
- `assets/AdminReservationDetail.example.tsx`
  - target: `src/features/reservations/ui/AdminReservationDetail.tsx`

## Important adaptation notes

- adjust imports to the repo’s alias/path conventions
- replace styling classes with the repo’s design system if needed
- replace placeholder auth checks with the repo’s real auth guard
- replace placeholder date helpers with the repo’s preferred date utilities
- do not copy raw assets blindly without adapting route paths, import aliases, and auth

## When to skip an asset

Skip or heavily adapt an asset if the repo already has:

- a strong API wrapper pattern
- a standard server action mutation pattern
- a reusable table/list component
- a central event bus
- an existing audit log model
- an existing admin shell/layout

The skill’s job is to **fit the repo**, not overwrite it with a foreign structure.

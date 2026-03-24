---
name: reservation-system-implementation
description: Implement or retrofit a restaurant-style reservation system inside an existing Next.js + Prisma codebase, especially when the repo already has a landing page and may already have an admin dashboard. Use this skill whenever the user wants public reservations, availability search, booking APIs, table/capacity logic, or admin reservation management added to an existing Next.js project. Review the current codebase first, extract answers already present in the conversation, ask only missing scoping questions, then scaffold the backend and frontend inside the repo rather than proposing a separate service unless the user explicitly asks for one.
---

# Reservation System Implementation

Use this skill for **in-repo implementation**. The default target is a **single-tenant, restaurant-focused reservation system** added to an existing **Next.js + Prisma** project.

This skill is intentionally **reduced scope** compared with a standalone scheduling platform:

- implement **inside the current codebase**
- prefer **file-based configuration**
- keep **transactional records in Prisma**
- build both:
  - **public visitor booking flow** on the landing site
  - **admin reservation management** in the existing admin area if present
- keep architecture **modular enough for later channels/webhooks**, but do not overbuild now

## Defaults and boundaries

Unless the user says otherwise, assume:

- single tenant
- restaurant/dining reservations first
- one or more locations can exist in config, even if only one is used now
- no payments, deposits, waitlists, or walk-ins
- no fully generic cross-vertical scheduling engine
- no separate microservice
- no DB-backed config editor by default
- inventory matters, so use **tables/areas/combinations** rather than a naive “covers remaining” integer
- predefined table combinations only in v1

## Start here every time

1. **Read the conversation first.**
   - Do not re-ask questions the user already answered.
   - Pull requirements, constraints, preferred stack patterns, and status flow from the existing conversation.

2. **Audit the codebase before proposing implementation details.**
   Inspect these first:
   - `package.json`
   - `next.config.*`
   - `tsconfig.json`
   - `prisma/schema.prisma`
   - existing migrations
   - `app/` or `src/app/`
   - `pages/` or `src/pages/`
   - auth, middleware, and admin routes/layouts
   - Prisma client wrapper / DB helpers
   - existing API patterns
   - UI component system
   - form, validation, and date libraries
   - any existing booking/contact widgets or CRM/admin tables

3. **Summarize the audit before coding.**
   Give the user a short, concrete summary:
   - router style: app router or pages router
   - auth/admin protection status
   - Prisma provider / DB shape
   - existing UI system
   - best place to mount public reservation UI
   - best place to mount admin reservation UI
   - libraries to reuse
   - risks or blockers

4. **Ask only missing scoping questions.**
   Use `references/01-audit-and-scope.md`.
   Group them into:
   - **must-answer before coding**
   - **nice-to-have, with safe defaults**

5. **Then implement.**
   Do not stay in planning mode once the repo and scope are clear enough.

## One question you must not guess if the repo lacks it

If there is **no existing admin authentication/protection**, do **not** ship open admin mutation endpoints.

Ask how admin access should be protected, or implement only the public side plus protected server modules until the user confirms an auth approach.

## Target shape

Implement **within the repo**, following current conventions.

Preferred default structure if the repo has no strong competing pattern:

```text
src/
  config/
    reservations.ts
  features/
    reservations/
      server/
      ui/
      types/
```

But if the project already has a clear feature/module layout, follow that instead.

### Use this architecture

- **Config in code/file**
  - hours
  - slot interval
  - duration rules
  - locations
  - areas
  - tables
  - predefined table combinations
  - policy flags

- **Prisma for transactional records**
  - reservations
  - table assignments
  - audit log
  - operational blocks

- **Server-only domain functions**
  - availability search
  - table allocation
  - booking create/edit/cancel
  - status transitions
  - admin list/detail/create/update
  - block management

- **Thin route handlers or server actions**
  - public APIs
  - admin APIs
  - call domain functions instead of embedding business logic inline

## Codebase adaptation rules

### Routing

- If the repo already uses **App Router**, prefer route handlers in `app/api/...` and server components/actions where appropriate.
- If the repo still uses **Pages Router**, fit that structure rather than force-migrating the project.

### UI

- Reuse the repo’s existing UI kit, CSS system, data table, modal/dialog, and form components.
- Do not introduce a new component library just for this feature.

### Validation

- Reuse the repo’s validation stack if it already has one.
- If there is none, adding **Zod** is reasonable for request/config validation.

### Dates and time zones

- Reuse existing date utilities if present.
- If the repo has no reliable timezone utilities, add a minimal, well-understood solution.
- Do not hand-wave timezone handling.

## Required v1 data model

At minimum, implement or adapt these transactional entities in Prisma:

- `Reservation`
- `ReservationTableAssignment`
- `ReservationAuditLog`
- `ReservationBlock` (recommended if admin operations exist)

Optional only if user asks now:

- `ReservationOutbox` or similar delivery table

Keep structural inventory like tables and areas in config unless the user explicitly wants DB-managed configuration now.

Read `references/02-architecture-and-data-model.md` and `assets/prisma-reservation-models.prisma`.

## Availability and clash prevention

This is the core correctness rule:

> Never trust previously returned availability when writing a booking.

On **create**, **edit**, or **manual admin reassignment**:

1. start a DB transaction
2. lock the contention domain if the DB supports it
3. re-query active overlapping assignments and blocks
4. pick the best-fitting available table or predefined combination
5. insert/update the reservation and active assignments
6. write an audit log entry
7. emit internal reservation events through one central module

### Important

- Public clients should **not** control internal table assignment.
- The server must re-allocate or validate assignment at write time.
- If the chosen slot is no longer available, return a clear conflict response and nearby alternatives.

### Database-specific guidance

- If Prisma is backed by **PostgreSQL**, strongly prefer transactional recheck plus raw-SQL locking/constraints where justified.
- If it is **MySQL**, use the strongest safe transaction/locking approach available.
- If the production DB is **SQLite**, warn the user that concurrency guarantees are weaker and recommend Postgres for real usage.

Read `references/02-architecture-and-data-model.md` and `assets/postgres-constraints.sql`.

## Public visitor functionality to implement

Implement the smallest solid public flow that fits the site.

Minimum expected flow:

1. visitor chooses location if relevant
2. visitor chooses party size and date
3. app fetches available times
4. visitor selects a time
5. visitor enters booking details
6. app creates reservation
7. app shows confirmation with reference code

### Public UX requirements

- integrate into the existing landing page or add a dedicated `/reservations` page
- show useful empty states when no times are available
- offer nearby alternative times when possible
- validate input on both client and server
- avoid exposing internal inventory IDs in public responses
- if the repo already has spam protection patterns, reuse them

Optional only if clearly requested:

- self-service lookup
- self-service cancellation
- special experience selection
- area preference in public flow

See `references/03-api-ui-and-admin.md` and `assets/ReservationWidget.example.tsx`.

## Admin functionality to implement

If an admin area already exists, integrate there. If not, create the smallest secure admin surface the repo can support.

Minimum admin scope:

- reservation list with filters
- reservation detail view or panel
- manual reservation creation
- edit reservation date/time/party size/contact/notes
- status actions:
  - confirm
  - cancel
  - mark seated
  - mark completed
  - mark no-show
- view assigned tables
- optionally create/manage operational blocks if the repo supports it cleanly

### Admin config handling

Because this skill assumes **file-based config by default**:

- expose config **read-only** in admin if helpful
- do **not** build an endpoint that writes server files unless the user explicitly asks for it and the deployment model supports it

If the user wants “edit configuration” in v1, the safest default is:

- editable **code config file**
- admin **read-only summary page**
- clear comments on how to move config to DB later

See `references/03-api-ui-and-admin.md`, `assets/AdminReservationsPage.example.tsx`, and `assets/AdminReservationDetail.example.tsx`.

## Recommended route surface

Public:

- `POST /api/reservations/availability`
- `POST /api/reservations`

Admin:

- `GET /api/admin/reservations`
- `POST /api/admin/reservations`
- `GET /api/admin/reservations/[id]`
- `PATCH /api/admin/reservations/[id]`
- `POST /api/admin/reservation-blocks`
- `PATCH /api/admin/reservation-blocks/[id]`
- `DELETE /api/admin/reservation-blocks/[id]`
- `GET /api/admin/reservation-config`

Adapt names and placement to the repo’s conventions. If server actions are already the dominant mutation pattern in admin, you may use them, but keep the booking domain logic centralized.

## Modular channels and future integrations

Keep side effects modular from the start.

Create one central event module for reservation lifecycle events such as:

- `reservation.created`
- `reservation.updated`
- `reservation.cancelled`
- `reservation.seated`
- `reservation.completed`
- `reservation.no_show`

Support two audiences in the abstraction:

- `booker`
- `location`

Do not hardwire email, SMS, or webhooks directly inside route handlers. Use a small adapter layer so future channels can be added without rewriting booking logic.

See `assets/channels.example.ts`.

## Implementation order

Use this order unless the repo forces a different one:

1. audit repo
2. clarify missing scope
3. add config file + config validation
4. add Prisma models/migration
5. implement domain types and allocator
6. implement availability search
7. implement reservation create flow
8. implement admin list/detail/create/update
9. implement blocks and audit
10. add modular event hooks
11. wire public UI
12. wire admin UI
13. add tests
14. document configuration and usage

## Testing requirements

Before finishing, cover:

- config validation
- slot generation
- table allocation
- overlap rejection
- booking creation conflict path
- admin status transitions
- edit/reschedule path
- block interactions
- typecheck and lint
- manual QA of public and admin flows

Use existing test tools in the repo. Only add new test tooling if absolutely necessary.

Read `references/04-testing-and-done.md`.

## How to talk to the user while using this skill

Before coding, send:

1. **audit summary**
2. **missing questions only**
3. **implementation plan**

After coding, send:

1. **what was added/changed**
2. **which defaults were assumed**
3. **new routes/pages/components**
4. **Prisma and migration changes**
5. **how to configure locations/hours/tables**
6. **follow-up items or risks**

## Anti-patterns

Do **not**:

- split this into a separate microservice unless explicitly asked
- build a generic multi-tenant scheduling platform
- store all configuration in DB by default
- expose insecure admin mutation routes
- trust client-selected tables without server validation
- skip transactional revalidation on booking writes
- implement arbitrary table-combination search in v1
- add waitlists, walk-ins, payments, or drag-and-drop calendar UX unless asked
- force a large router/UI refactor just to fit the feature

## Asset and reference map

Read in this order:

1. `references/00-index.md`
2. `references/01-audit-and-scope.md`
3. `references/02-architecture-and-data-model.md`
4. `references/03-api-ui-and-admin.md`
5. `references/04-testing-and-done.md`
6. `references/05-copy-map.md`

Copy and adapt these as needed:

- `assets/reservation.config.example.ts`
- `assets/reservation-config.schema.example.ts`
- `assets/prisma-reservation-models.prisma`
- `assets/postgres-constraints.sql`
- `assets/reservation-types.example.ts`
- `assets/allocator.example.ts`
- `assets/reservation-service.example.ts`
- `assets/channels.example.ts`
- `assets/availability-route.example.ts`
- `assets/create-reservation-route.example.ts`
- `assets/admin-route.example.ts`
- `assets/ReservationWidget.example.tsx`
- `assets/AdminReservationsPage.example.tsx`
- `assets/AdminReservationDetail.example.tsx`

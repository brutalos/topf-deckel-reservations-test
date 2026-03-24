# Topf & Deckel Reservation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a multi-store reservation system with table-level allocation, public booking widget, guest self-service, and admin timeline view.

**Architecture:** Use a discrete 15-minute slot-based allocation system in Prisma to prevent overlaps. Centralize business logic in a `ReservationService`.

**Tech Stack:** Next.js App Router, Prisma (SQLite), Tailwind CSS v4, date-fns.

---

### Task 1: Prisma Schema & DB Push

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Update `prisma/schema.prisma`**
  Add `Reservation`, `ReservationTableAssignment`, `ReservationBlock`, and `ReservationAuditLog` models.
- [ ] **Step 2: Sync DB and Generate Client**
  Run: `npx prisma db push && npx prisma generate`
- [ ] **Step 3: Verify Client Types**
  Check if `import { Reservation } from '@prisma/client'` works.
- [ ] **Step 4: Commit**
  ```bash
  git add prisma/schema.prisma
  git commit -m "db: add reservation models to schema"
  ```

### Task 2: Configuration, Types & Validation

**Files:**
- Create: `src/config/reservations.ts`
- Create: `src/lib/reservations/types.ts`
- Create: `src/lib/reservations/validation.ts`

- [ ] **Step 1: Define `src/config/reservations.ts`**
  Add `TABLES_PER_STORE` (5 x 2-seaters, 5 x 4-seaters) and rules for each store.
- [ ] **Step 2: Define types in `src/lib/reservations/types.ts`**
  Define `ReservationStatus`, `TableConfig`, etc.
- [ ] **Step 3: Define Zod schemas in `src/lib/reservations/validation.ts`**
  Schemas for `availabilityRequest`, `bookingRequest`, and `adminUpdate`.
- [ ] **Step 4: Commit**
  ```bash
  git add src/config/reservations.ts src/lib/reservations/types.ts src/lib/reservations/validation.ts
  git commit -m "feat: add reservation config, types, and validation"
  ```

### Task 3: Reservation Domain Service & Events

**Files:**
- Create: `src/lib/reservations/service.ts`
- Create: `src/lib/reservations/events.ts`

- [ ] **Step 1: Implement `src/lib/reservations/events.ts`**
  Define a central event emitter for `reservation.created`, `reservation.updated`, etc.
- [ ] **Step 2: Implement `checkAvailability` in `service.ts`**
  Logic to find available tables/combinations (e.g., join 4+2 for party of 6).
- [ ] **Step 3: Implement `createReservation` in `service.ts`**
  Transactional logic: check availability -> create booking -> assign slots -> write `ReservationAuditLog`.
- [ ] **Step 4: Implement `updateStatus` and `cancelReservation`**
  Manage status transitions and emit events.
- [ ] **Step 5: Commit**
  ```bash
  git add src/lib/reservations/
  git commit -m "feat: add reservation domain service and event emitter"
  ```

### Task 4: Public APIs

**Files:**
- Create: `src/app/api/reservations/availability/route.ts`
- Create: `src/app/api/reservations/route.ts`

- [ ] **Step 1: Implement `availability` POST handler**
  Validate with Zod and expose service's `checkAvailability`.
- [ ] **Step 2: Implement booking creation POST handler**
  Validate with Zod and expose service's `createReservation`. Include `editToken` generation.
- [ ] **Step 3: Implement Email Notification** (Stub for now)
  Log the `editToken` to the console as a stub for the email service.
- [ ] **Step 4: Commit**
  ```bash
  git add src/app/api/reservations/
  git commit -m "api: add public reservation endpoints with validation"
  ```

### Task 5: Public UI - Booking Widget

**Files:**
- Create: `src/app/reservations/page.tsx`
- Create: `src/app/reservations/ClientPage.tsx`
- Create: `src/app/reservations/components/BookingForm.tsx`

- [ ] **Step 1: Create `BookingForm` Client Component**
  Multi-step flow: Location -> Guests/Date -> Time Slot -> Details.
- [ ] **Step 2: Create `reservations/page.tsx`**
  Simple server component that renders `ClientPage`.
- [ ] **Step 3: Commit**
  ```bash
  git add src/app/reservations/
  git commit -m "feat: add public reservations page and widget"
  ```

### Task 6: Guest Management Page

**Files:**
- Create: `src/app/reservations/manage/[token]/page.tsx`
- Create: `src/app/api/reservations/manage/[token]/route.ts`

- [ ] **Step 1: Implement API handlers**
  GET to fetch details, PATCH to cancel. Validate `token`.
- [ ] **Step 2: Create Management UI**
  Show details + Cancel button.
- [ ] **Step 3: Commit**
  ```bash
  git add src/app/reservations/manage/ src/app/api/reservations/manage/
  git commit -m "feat: add guest management portal"
  ```

### Task 7: Admin APIs - Timeline & Blocks

**Files:**
- Create: `src/app/api/admin/[storeId]/reservations/timeline/route.ts`
- Create: `src/app/api/admin/reservations/[id]/route.ts`
- Create: `src/app/api/admin/reservation-blocks/route.ts`

- [ ] **Step 1: Implement Timeline API**
  Fetch data for matrix. Use `isAdminAuthorized`.
- [ ] **Step 2: Implement update API**
  Update status/table. Use `isAdminAuthorized`.
- [ ] **Step 3: Implement Blocks API**
  POST/DELETE handlers for maintenance blocks. Use `isAdminAuthorized`.
- [ ] **Step 4: Commit**
  ```bash
  git add src/app/api/admin/
  git commit -m "api: add admin reservation endpoints and blocks"
  ```

### Task 8: Admin UI - Dashboard Integration

**Files:**
- Create: `src/app/admin/[storeId]/reservations/page.tsx`
- Create: `src/app/admin/[storeId]/reservations/components/TimelineView.tsx`

- [ ] **Step 1: Create `TimelineView` Component**
  The "Table Matrix" showing all 10 tables and slots.
- [ ] **Step 2: Create Admin Reservations Page**
  List view + Timeline view + Status controls.
- [ ] **Step 3: Commit**
  ```bash
  git add src/app/admin/
  git commit -m "feat: add admin reservations dashboard"
  ```

### Task 9: Verification & Finishing

- [ ] **Step 1: End-to-end Test**
  Manually verify public booking -> admin seating -> guest cancellation.
- [ ] **Step 2: Run Lint and Typecheck**
  Run: `npx tsc --noEmit`
- [ ] **Step 3: Brain Activity Log**
  Call the activity endpoint to log completion.
- [ ] **Step 4: Commit**
  ```bash
  git commit -m "chore: final verification and cleanup"
  ```

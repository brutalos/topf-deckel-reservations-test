# Design Specification: Topf & Deckel Reservation System

**Date:** 2026-03-24  
**Author:** opencode  
**Topic:** Reservation System Implementation

## 1. Overview
A single-tenant, multi-store reservation system integrated into the existing Next.js + Prisma codebase. It provides a public booking flow, a self-service management portal for guests, and a comprehensive admin dashboard for store managers.

## 2. Goals
- Provide a seamless public booking experience.
- Enable guests to modify or cancel their own bookings via a secure link.
- Empower store managers with a real-time table timeline and status management.
- Ensure strict table-level allocation to prevent double-booking.

## 3. Data Model (Prisma)
The following models will be added to `prisma/schema.prisma`:

- **Reservation**:
    - `id`: String (Primary Key)
    - `storeId`: String (References `stores.ts`)
    - `guestName`: String
    - `guestEmail`: String
    - `guestPhone`: String
    - `partySize`: Int
    - `reservationDate`: String (ISO date format)
    - `startTime`: String (ISO time format)
    - `durationMinutes`: Int (Default 60)
    - `status`: String (PENDING, CONFIRMED, SEATED, COMPLETED, NO_SHOW, CANCELLED)
    - `notes`: String?
    - `editToken`: String @unique (Secure token for guest self-service)
    - `createdAt`: DateTime @default(now)
    - `updatedAt`: DateTime @updatedAt

- **ReservationTableAssignment**:
    - `id`: String (Primary Key)
    - `reservationId`: String
    - `tableId`: String
    - `slotDateTime`: String (ISO date-time for each 15-minute block)
    - (Unique index on `tableId` and `slotDateTime`)
    - *Note: A 60-minute reservation will create 4 assignment records.*

- **ReservationBlock**:
    - `id`: String (Primary Key)
    - `storeId`: String
    - `tableId`: String? (Optional, can block all tables)
    - `slotDateTime`: String
    - (Unique index on `tableId` and `slotDateTime`)
    - *Note: Blocks follow the same slot-based architecture as assignments.*

- **ReservationAuditLog**:
    - `id`: String (Primary Key)
    - `reservationId`: String
    - `action`: String (STATUS_CHANGE, EDITED, CANCELLED)
    - `details`: String
    - `timestamp`: DateTime @default(now)

## 4. Configuration (`src/config/reservations.ts`)
A file-based configuration to define store capacities:
- **Default Layout**: 10 tables per store.
    - 5 x 2-seaters (T1–T5)
    - 5 x 4-seaters (T6–T10)
- **Rules**:
    - Minimum party size: 1.
    - **Maximum party size**: 6 (requires joining one 4-seater and one 2-seater).
    - Slot interval: 15 minutes.
    - Booking lead time: Minimum 1 hour in advance.
    - Modification window: Allowed up to 2 hours before the time.

## 5. Notifications
- **Confirmation Email**: Upon successful booking, the system will send an email to the guest including:
    - Booking summary (Store, Date, Time, Party Size).
    - The `editToken` as part of a "Manage My Booking" link.
- **Admin Alert**: Optional email or webhook notification to the store's manager when a new reservation is created.

## 6. Security & Rate Limiting
- **Public API Rate Limiting**: Limit to 3 booking attempts per 10 minutes per IP to prevent spam and automated reservation-scraping.
- **Modification Security**: The `editToken` is a cryptographically secure random string. Accessing `/reservations/manage/[token]` validates this token before revealing any booking details.

## 7. UI Components
- **Public Widget**: Multi-step flow for `/reservations`.
- **Guest Management**: Secure portal at `/reservations/manage/[token]`.
- **Admin Timeline**: A "Table Matrix" view showing table availability across the daily 11:00 AM – 3:00 PM window.
- **Reservation Detail Panel**: Slide-over or modal for guest info and status actions.

## 8. API Endpoints
- **Public**:
    - `POST /api/reservations/availability`: Check slot availability.
    - `POST /api/reservations`: Create booking.
    - `GET/PATCH /api/reservations/manage/[token]`: Manage individual booking.
- **Admin** (Protected by `isAdminAuthorized`):
    - `GET /api/admin/reservations`: List and timeline data.
    - `PATCH /api/admin/reservations/[id]`: Update status or table.
    - `POST /api/admin/reservation-blocks`: Manage maintenance blocks.

## 9. Technical Considerations
- **Concurrency**: Use Prisma transactions for the allocation logic to ensure a table isn't double-booked if two users click "Confirm" at the same time.
- **Time Zones**: Use ISO strings for storage and `date-fns-tz` for display consistency (Europe/Vienna).
- **Validation**: Zod for all request schemas.
- **Security**: The `editToken` should be a cryptographically secure random string (UUID or similar).

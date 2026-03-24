# API, UI, and Admin

## Public route surface

Minimum public API:

- `POST /api/reservations/availability`
- `POST /api/reservations`

Optional later:
- `POST /api/reservations/lookup`
- `POST /api/reservations/cancel`

## Public availability contract

Input should usually include:

- `locationId`
- `date`
- `partySize`
- optional `areaPreference`

Output should include:

- available times
- display labels
- enough info to submit booking
- nearby alternatives if relevant
- no internal raw table inventory IDs

If the repo wants a stronger anti-tamper pattern, return a signed/opaque slot token. Otherwise, re-run allocation on create and return `409` with alternatives if the slot disappeared.

## Public create contract

Input should usually include:

- `locationId`
- `startAt`
- `partySize`
- customer name
- phone/email depending on config
- special requests
- optional area preference

Server responsibilities:

- validate input
- recompute or validate duration
- re-run conflict check
- allocate best-fit table(s)
- create reservation
- create active assignment rows
- create audit log
- emit reservation event(s)
- return confirmation payload with reference code

## Admin route surface

Minimum admin API:

- `GET /api/admin/reservations`
- `POST /api/admin/reservations`
- `GET /api/admin/reservations/[id]`
- `PATCH /api/admin/reservations/[id]`
- `GET /api/admin/reservation-config`

Recommended if admin operations need them:

- `POST /api/admin/reservation-blocks`
- `PATCH /api/admin/reservation-blocks/[id]`
- `DELETE /api/admin/reservation-blocks/[id]`

## Admin list page requirements

At minimum:

- filter by date
- filter by status
- search by guest name/email/phone/reference code
- filter by location if relevant
- show party size, time, status, location, assigned tables
- provide quick actions or open detail

Nice-to-have if the repo already has the right components:

- tabs for today/upcoming/past
- dayboard/timeline view
- block management UI
- bulk actions

## Admin detail requirements

At minimum:

- reservation summary
- guest contact
- special requests
- internal notes
- assigned tables
- audit trail or recent changes
- actions:
  - confirm
  - cancel
  - mark seated
  - mark completed
  - mark no-show
  - reschedule/edit fields

## Admin manual create

Admins should be able to create reservations manually if admin exists. Use the same domain allocation logic as public booking creation. Do not create a second ad hoc booking code path.

## Config summary page

Because structural config is code-based by default, admin should usually get:

- read-only summary of:
  - locations
  - hours
  - slot interval
  - duration rules
  - party size rules
  - areas/tables/combos

Avoid building file-writing APIs unless explicitly requested and deployment-safe.

## Public page behavior

Preferred public UX:

1. choose location if needed
2. choose party size
3. choose date
4. load time options
5. select time
6. enter details
7. submit
8. show confirmation

Public booking UI should:

- live on existing landing page if that is natural
- fall back to dedicated `/reservations` page if cleaner
- match the site’s current design system
- handle “no availability” gracefully
- handle race-condition conflicts gracefully

## Server action vs route handler guidance

### Public
Prefer route handlers for public reservation APIs unless the repo has a very strong server-action-only pattern.

### Admin
Use whatever the repo already prefers:
- route handlers
- server actions
- direct server component data loading

But keep domain logic in one place so both public and admin use the same booking engine.

## Error model

Use explicit and user-friendly errors.

Suggested categories:

- validation error
- not available / conflict
- outside booking window
- location closed
- party size unsupported
- admin unauthorized / forbidden
- unexpected server error

When create fails because the slot disappeared, prefer:

- `409 Conflict`
- include nearby alternatives if easy to compute

## Side effects and channels

Create one central module for event emission.

Events should be typed and support:

- audience = `booker`
- audience = `location`

Possible adapters later:

- webhook
- email
- SMS
- internal dashboard notification
- CRM sync

The v1 code only needs the abstraction and a no-op or logger-backed implementation unless the user requests more now.

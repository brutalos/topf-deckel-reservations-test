# Audit and Scope

## Repository audit checklist

Inspect these before you propose file paths or implementation details:

- `package.json`
- `next.config.*`
- `tsconfig.json`
- `prisma/schema.prisma`
- existing migrations
- app router vs pages router structure
- auth and middleware
- admin routes/layouts
- Prisma client wrapper
- current API conventions
- UI component library
- table/list components
- forms and validation libraries
- date/time libraries
- environment variable patterns
- any existing booking/contact/request forms
- landing page composition and where a reservation widget could fit

## Audit summary template

Use a short format like this before coding:

```md
Audit summary
- Router: App Router / Pages Router
- Auth: existing provider / missing / partial
- Admin area: yes/no + route path
- Prisma: provider + existing helper path
- UI kit: ...
- Validation/date libs: ...
- Public placement: ...
- Admin placement: ...
- Risks: ...
```

## Must-answer questions

Ask these only if you cannot infer them safely from the conversation, codebase, or existing content.

### A. Reservation rules
1. Which locations are in scope now?
2. What timezone should each location use?
3. What are the bookable service windows by day of week?
4. What is the default reservation duration?
5. Does duration vary by party size?
6. What is the minimum and maximum party size?
7. How far ahead can people book?
8. What is the minimum lead time before a reservation?
9. Are public reservations auto-confirmed or created as pending?

### B. Inventory
10. What tables exist per location and area?
11. Which predefined table combinations are allowed?
12. Do we support area preference publicly, internally, or not at all?
13. Are operational blocks needed in v1?

### C. Booking fields
14. Which fields are required from the visitor?
15. Is phone required?
16. Is email required?
17. Are special requests stored?
18. Should a reference code be shown to the guest?

### D. Admin
19. Where should the admin UI live?
20. How should admin routes be protected if auth is missing or partial?
21. Do admins need manual reservation creation?
22. Do admins need status transitions beyond confirm/cancel?

### E. Side effects
23. Are notifications/webhooks needed now, or only a modular stub?
24. Should booker/location audiences be separated in the event abstraction?

## Nice-to-have questions with safe defaults

You can proceed with defaults if these are unanswered:

- patio / area preference
- cancellation wording and UX copy
- no-show handling copy
- labels for areas/tables
- “occasion” or special experience tags
- internal note taxonomy
- guest lookup or self-service cancellation
- admin calendar/dayboard view vs list-only
- delivery adapters beyond a typed event stub

## Safe defaults

If the user does not answer, default to:

- one config-defined location
- 15-minute slot interval
- 90-minute default duration
- 60-day booking window
- 90-minute lead time
- party size 1–8
- public bookings auto-confirmed
- name + phone required, email optional
- special requests optional
- admin can confirm/cancel/seat/complete/no-show
- blocks supported if there is an admin area
- modular channel/event stub only, no real webhook/email implementation yet

## Special handling for missing admin auth

If there is no secure admin auth pattern already in the repo, do **not** invent open write endpoints.

Pick one of these paths:

1. ask the user how admin should be protected
2. scaffold server modules and admin UI shells only
3. use an existing internal-only guard pattern from the repo if one exists

Do not silently ship insecure admin mutations.

## Recommendation on configuration editing

Because this skill assumes config in code:

- treat operational edits (reservations, statuses, blocks) as DB-backed admin features
- treat structural edits (hours, tables, combinations, policies) as code/config changes unless the user explicitly wants DB-managed settings

That means “admin can edit configuration” should usually be interpreted as:

- a read-only config summary page in admin now
- code-config edits by developers
- optional DB settings later as a follow-up

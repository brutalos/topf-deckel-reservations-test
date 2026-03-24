# Testing and Done Checklist

## Unit tests

Add or adapt tests for:

- config parsing and validation
- duration lookup by party size
- slot generation for a single day
- service window filtering
- table fit checks
- combination ranking / best-fit selection
- block filtering
- overlap detection
- status transition rules

## Integration tests

Cover these end-to-end server paths where practical:

1. availability returns slots
2. create reservation succeeds
3. create reservation fails on conflict
4. edit/reschedule reassigns inventory correctly
5. cancel releases inventory
6. admin manual create works
7. block prevents booking
8. invalid inputs return expected validation errors

## Manual QA scenarios

Run these manually if the repo lacks automated coverage:

### Public flow
- happy path booking
- no availability day
- conflict during final submit
- invalid form values
- alternative times shown

### Admin flow
- list and filters
- detail panel/page
- confirm/cancel/seat/complete/no-show
- manual create
- edit reservation
- block creation
- config summary page

### Cross-checks
- cancelled reservation no longer blocks availability
- completed reservation no longer blocks future slots
- admin edit preserves audit trail
- assigned tables are visible internally, hidden publicly

## Type/lint/build checks

Before finishing, run the repo’s normal checks:

- typecheck
- lint
- tests
- build if appropriate

If any check cannot be run, say exactly why.

## Done checklist

Do not consider the work done until all of these are true:

- codebase audit was performed
- missing questions were asked or safe defaults were stated
- config file exists and is validated
- Prisma schema/migrations exist
- domain logic is centralized
- public flow works
- admin flow works or is safely scoped if auth blocked it
- clash prevention is implemented
- active assignments release correctly on cancel/reschedule
- event adapter exists
- tests or manual QA notes exist
- user receives config instructions and changed file summary

## Wrap-up response template

Use a concise wrap-up like this:

```md
Implemented
- ...

Defaults assumed
- ...

Routes/pages added
- ...

Prisma/migration changes
- ...

How to configure
- ...

Known follow-ups
- ...
```

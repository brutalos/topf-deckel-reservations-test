---
name: tsc-cli-syntax
description: Error prevention rules compiled from real incidents
---

# Error Prevention

Rules compiled from real build/runtime errors. Apply these when generating or editing code to prevent known failures.

## [TSC] typescript_error
**Symptom:** error TS6231: Could not resolve the path '2>&1' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
**Project pattern:** alt-wiener-stuben-shop-v6
**Prevention rule:** Avoid passing shell redirection characters as literal arguments to the tsc command and ensure they are processed by a shell environment.
**When seen:** Do NOT repeat this pattern. Apply the fix above.

---
name: shell-redirection-handling
description: Error prevention rules compiled from real incidents
---

# Error Prevention

Rules compiled from real build/runtime errors. Apply these when generating or editing code to prevent known failures.

## [TSC] typescript_error
**Symptom:** error TS6231: Could not resolve the path '2>&1' with the extensions: '.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'.
**Prevention rule:** Do not pass shell-specific redirection operators like '2>&1' as arguments to CLI tools; ensure the command is executed within a shell context or use native stream handling.
**When seen:** Do NOT repeat this pattern. Apply the fix above.

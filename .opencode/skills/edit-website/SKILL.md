---
description: Surgical website edit workflow — grep to locate, read only that file, edit with precision
---

# Edit Website Skill

Use this skill for ANY task that modifies an existing Next.js/React project.

## The Only Workflow Allowed

### Step 1: GREP to find the file
Never read files blindly. Always grep first:
```bash
grep -r "text or component name" . --include="*.tsx" --include="*.ts" --include="*.css" -l
grep -r "broken image\|img src\|Image" . --include="*.tsx" -l
grep -rn "component name\|className" . --include="*.tsx"
```

### Step 2: Read ONLY the file(s) grep found
- Read MAX 2 files — the ones grep pointed to
- Do NOT read layout.tsx, globals.css, or other files unless grep led you there
- Do NOT list directories to "understand the project"

### Step 3: Edit surgically
- Use the **Edit** tool for targeted find-and-replace
- NEVER rewrite the entire file — only change the exact section requested
- PRESERVE: all imports, other components, routes, styling, functionality

### Step 4: Verify
- `cat` the edited section only — confirm the change is correct
- Do NOT re-read the whole file

## What NOT to do
- ❌ `ls -R` or listing directories to "explore the project"
- ❌ Reading `app/layout.tsx`, `app/globals.css`, `next.config.*` unless that IS the file to edit
- ❌ Reading component files that aren't related to the task
- ❌ Rewriting entire files — always prefer the Edit tool
- ❌ Running `npm install`, `next build`, `npx tsc`
- ❌ Creating `PLAN.md` for small edits

## Common Grep Patterns

```bash
# Find broken image references
grep -rn "img\|Image\|src=" . --include="*.tsx" -l

# Find a specific component
grep -rn "ComponentName\|component-name" . --include="*.tsx" -l

# Find where a color/style is defined
grep -rn "bg-red\|color-primary\|--color" . --include="*.tsx" --include="*.css" -l

# Find text content
grep -rn "button label\|heading text" . --include="*.tsx" -l

# Find an API route
grep -rn "route name\|api endpoint" . --include="*.ts" -l
```

## Edit Tool Usage

After reading the file, use Edit for surgical replacement:
```
Edit: find exact text → replace with new text
```
Never output the full file content. Just the targeted change.

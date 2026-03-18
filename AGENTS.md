# AGENTS.md — Coding Agent Instructions

## FORBIDDEN Actions (CRITICAL)
- Do NOT run `next build` or `npx next lint` — these are slow and unnecessary.
- Do NOT change `package.json` dependency versions — they are pre-configured and correct (Next.js 16, React 19, Tailwind v4).
- Do NOT run `npm install` to add new packages — use ONLY the dependencies already in package.json.
- Do NOT investigate or analyze build errors — just fix the code directly.
- If you encounter an error, fix the CODE, never the dependency versions.

## Self-Verification (MANDATORY — do this after every file change)
- After writing or editing TypeScript files, run: `npx tsc --noEmit 2>&1 | head -40`
- If errors are found, fix them immediately in the same session before finishing.
- Do NOT stop until `npx tsc --noEmit` reports no errors.

## Data & Database Rules (CRITICAL)
- **Default: SQLite via Prisma** (zero-config, no server needed). The `.env` already has the correct `DATABASE_URL` — do NOT change it.
- Do NOT change DATABASE_URL. Do NOT use `prisma+postgres://` proxy URLs. Do NOT let Prisma spin up its own database.
- Do NOT run `npx prisma init` — it overwrites .env. Just create `prisma/schema.prisma` manually with `provider = "sqlite"`.
- ALWAYS include `binaryTargets = ["native", "linux-arm64-openssl-3.0.x"]` in the `generator client` block — required for Docker (Debian bookworm uses OpenSSL 3.x).
- Run `npx prisma db push` to create/sync the SQLite file, `npx prisma generate` for TypeScript types.
- **SCHEMA-CODE SYNC**: Every field you pass to prisma create/update calls MUST exist in `prisma/schema.prisma`. If you add a new field to an API route's data object, you MUST ALSO add it to the schema FIRST. Mismatches cause "Unknown argument" runtime crashes.
- **SCHEMA UPDATES**: When modifying an existing `prisma/schema.prisma` (adding fields, models, etc.):
  1. Run `npx prisma db push` to sync the database with the new schema.
  2. Run `npx prisma generate` to regenerate the TypeScript client types.
  These steps are REQUIRED after every schema change — without them, the DB and client types are stale.

## Import Rules (CRITICAL — WILL CRASH IF VIOLATED)
- ALL import statements MUST be at the TOP of the file, BEFORE any other code.
- NEVER put imports at the bottom or middle of a file.
- If you use `React.useState`, you MUST import React at the top: `import React from 'react'`

## Backend Logic (CRITICAL — TypeScript Only)
- ALL server-side logic MUST use Next.js API routes in `app/api/` written in TypeScript.
- Admin pages, webhooks, database queries, payment endpoints → all go in `app/api/` route handlers.
- NEVER create Python files, Python scripts, or Python connectors for website features.
- NEVER write `.py` files in this project — this is a TypeScript/Next.js project.

## General Rules
- **CRITICAL: ONLY work within the current project directory (`.` / `$PWD`). NEVER read, write, or search files outside this directory. Do NOT access parent directories, `/Users/`, home folders, or any path outside the project root.**
- Read files before modifying them to understand current state.
- Prefer targeted edits over rewriting entire files.
- Do NOT run `npx tsc` or `npx next lint` — validation runs automatically.
- Use Tailwind CSS for styling when the project uses it.
- Do NOT modify `app/globals.css` or `tailwind.config.ts` unless explicitly asked — these are pre-configured.
- You MAY (and SHOULD) modify `app/layout.tsx` to import shared Navbar and Footer components.

## Navigation & Layout Consistency (CRITICAL)
- Create ONE `components/Navbar.tsx` and ONE `components/Footer.tsx` — shared across ALL pages.
- Import Navbar and Footer in `app/layout.tsx` so they render on EVERY page automatically:
  ```tsx
  <Navbar />
  <main>{children}</main>
  <Footer />
  ```
- NEVER put navigation or footer markup directly in individual page files (`app/page.tsx`, `app/*/page.tsx`).
- EVERY page must show the EXACT SAME navigation: same logo, same links, same order, same styling.
- If the Navbar needs to be transparent over a hero image, use absolute/fixed positioning WITHIN the Navbar component — do NOT create different navbars per page.
- The Navbar must work on both dark backgrounds (e.g. hero sections) and light backgrounds (e.g. white content pages). Use a single consistent style or detect scroll/route and adapt within the ONE component.
- **Cart Icon (MANDATORY for shops)**: If the project has a cart, the Navbar MUST include a clearly visible `ShoppingCart` icon from `lucide-react` that links to `/cart`. Use high-contrast colors (white/accent on dark bg). Include an item count badge — always render it in the DOM and toggle visibility with CSS (`hidden`/`block`), NOT conditional rendering. The cart icon must be visible on mobile (outside the hamburger menu).

## Tailwind CSS v4 Rules (CRITICAL)
This project uses **Tailwind CSS v4**. The syntax has CHANGED from v3:
- ✅ `@import "tailwindcss";` — correct v4 import
- ❌ `@tailwind base; @tailwind components; @tailwind utilities;` — OLD v3 syntax, will BREAK the build
- ✅ `@theme inline { }` — v4 way to define custom theme values
- ❌ `tailwind.config.js` / `tailwind.config.ts` — v4 uses CSS-based config, NOT JS config files
- ⚠️ `@theme inline` values MUST be **literal** (e.g. `--color-background: #0A0A0A;`) — NEVER use `var()` refs (e.g. `--color-background: var(--background);`). `var()` is a runtime browser feature that Tailwind cannot resolve at build time → theme colors become empty in production → white page instead of dark theme.
- If you need `@apply` in a separate CSS file, add `@reference "tailwindcss"` at the top
- ⚠️ **`@theme inline` COMPLETENESS (CRITICAL — white-on-white bug)**: Every semantic color name used in ANY component (e.g. `bg-accent`, `text-accent`, `bg-light`, `text-light`) MUST have a matching `--color-<name>` entry in `@theme inline`. Numbered palette entries (`--color-0` … `--color-19`) are NOT usable as Tailwind utilities — only NAMED entries are. A missing `--color-accent` means `bg-accent text-white` renders as white text on a transparent (white) background — invisible. ALWAYS define at minimum: `--color-primary`, `--color-accent`, `--color-light`, `--color-dark`.

## CSS Rules (CRITICAL — WILL CRASH IF VIOLATED)
- All `@import` statements in `globals.css` MUST be at the **very top**, BEFORE any other CSS rules.
- ✅ `@import url(...)` for Google Fonts FIRST, then `@import "tailwindcss";` LAST (it expands inline into ~1200 lines), then body/classes
- ❌ Putting `@import url(...)` AFTER `@import "tailwindcss"` → tailwindcss expands inline, pushing the url import to line 1200+ → "Parsing CSS source code failed"
- ❌ Putting `@import url(...)` AFTER body styles → same crash
- NEVER truncate CSS files. Every `{` MUST have a matching `}`. Missing closing braces → "Unclosed block" crash.
- When editing `globals.css`, ALWAYS write the COMPLETE file — do NOT cut it short.

## Next.js App Router Rules (CRITICAL — READ CAREFULLY)
In Next.js 16 with App Router, all files in `app/` are **Server Components** by default.
Server Components CANNOT use event handlers, hooks, or browser APIs.

### ABSOLUTE RULES for files in `app/` (page.tsx, layout.tsx, etc.):
- ❌ NEVER use `onError`, `onSubmit`, `onClick`, `onChange`, `onLoad` or ANY event handler
- ❌ NEVER use `useState`, `useEffect`, `useRef` or ANY React hook
- ❌ NEVER use `window`, `document`, `localStorage`
- ❌ NEVER add `'use client'` to `app/page.tsx` or `app/layout.tsx` — it BREAKS the build
- ❌ NEVER write `import React, { useState, useEffect } from 'react'` in ANY file under `app/` — this WILL crash
- ❌ NEVER write `import { useState } from 'react'` in ANY file under `app/` — same crash
- ✅ Use plain `<img src={...} alt={...} className={...} />` — NO onError, NO onLoad
- ✅ Use plain `<form>` — NO onSubmit
- ✅ If you need interactivity (cart, checkout, forms), create a `components/` file with `'use client'` and import it

### For `components/` files that need interactivity:
- Add `'use client'` at the very top of the file
- Then you CAN use hooks, event handlers, browser APIs
- Example: `components/AddToCartButton.tsx` with `'use client'` → import in `app/products/[id]/page.tsx`
- Example: `components/CheckoutForm.tsx` with `'use client'` → import in `app/checkout/page.tsx`
- The `app/` page file stays a server component and just renders `<CheckoutForm />`

### Image rules:
- Use `<img>` tags, NOT `next/image` `<Image>`
- NEVER add `onError` to any `<img>` tag in a server component
- If an image might fail to load, just let it fail — do NOT add error handlers
- NEVER use external image URLs (Unsplash, Pexels, loremflickr, picsum, placeholder.com, or ANY https:// image URL)
- ALL product images MUST use local paths from `public/images/` like `/images/product-name.png`
- In seed data, use `/images/product-name.png` paths — the images will be auto-generated

### Google Places API rules (CRITICAL — WILL CRASH IF VIOLATED):
- NEVER use `new google.maps.places.Autocomplete(...)` — this is the LEGACY API and triggers `LegacyApiNotActivatedMapError`
- NEVER create `PlaceAutocompleteElement` inside a `<Script onLoad>` callback — the Places library is NOT ready in `onLoad`. Causes runtime `TypeError: Cannot read properties of undefined (reading 'PlaceAutocompleteElement')`.
- ALWAYS load Places via `await google.maps.importLibrary('places')` — this returns a Promise that resolves ONLY when the library is fully loaded. Use it in a `useEffect`.
- ALWAYS use `new places.PlaceAutocompleteElement(...)` where `places` comes from `importLibrary('places')` — this is the NEW API
- Listen for `gmp-select` event (NOT `place_changed`)
- Use `place.fetchFields({ fields: ['addressComponents', 'formattedAddress', 'location'] })` to get details
- Address components use `longText`/`shortText` (NOT `long_name`/`short_name`)
- **TypeScript types**: `@types/google.maps` is NOT installed. NEVER use `typeof google.maps.*` in type annotations — use `any` instead. Access the API via `(window as any).google.maps`.

### Stripe rules (CRITICAL — WILL CRASH IF VIOLATED):
- NEVER pass `apiVersion` to the `new Stripe()` constructor — the SDK uses its built-in default. Specifying a version string causes a TypeScript type error because the string must exactly match the SDK's version.
- ✅ `new Stripe(process.env.STRIPE_SECRET_KEY)` — correct
- ❌ `new Stripe(key, { apiVersion: '2024-12-18.acacia' })` — WRONG, type error
- ❌ `new Stripe(key, { typescript: true })` — WRONG, not a valid option
- NEVER pass a dummy/placeholder string as `clientSecret` to Stripe `<Elements>` — it validates the format on mount and crashes with `IntegrationError`.
- ALWAYS guard StripeProvider: `if (!clientSecret || !clientSecret.includes('_secret_')) return null;` — only render `<Elements>` when clientSecret is a real PaymentIntent secret.

### TypeScript type safety rules (CRITICAL — WILL CRASH IF VIOLATED):
- NEVER reference global type namespaces (like `google`, `stripe`, `gapi`) in type annotations unless `@types/*` is installed.
- If a library is loaded via `<script>` tag at runtime, access it via `(window as any).libraryName` and type return values as `any`.
- NEVER use `as const` assertions on string literals passed to library constructors that expect specific union types — let the library infer the type.
- When in doubt about a library's TypeScript types, use `any` — a working build is more important than type precision.

### JSX/TSX rules (CRITICAL — WILL CRASH IF VIOLATED):
- NEVER truncate JSX/TSX files. Every opening tag `<div>`, `<section>`, `<form>`, etc. MUST have a matching closing tag.
- When editing large component files, ALWAYS write the COMPLETE return statement — do NOT cut it short.
- Missing closing tags cause `"Parsing ecmascript source code failed"` / `"Expected '</', got 'jsx text'"` build crashes.
- If a component is too large to write in one pass, split it into smaller sub-components in separate files.

### Form field readability rules (CRITICAL for dark themes):
- ALL form inputs (`<input>`, `<textarea>`, `<select>`) MUST have sufficient contrast for BOTH placeholder text AND user-typed text
- On dark backgrounds: use dark input backgrounds (`bg-zinc-900`, `bg-zinc-950`, `bg-black`) with light text (`text-white`, `text-zinc-100`) and medium placeholder (`placeholder:text-zinc-500`)
- NEVER use white/light input backgrounds (`bg-white`, `bg-gray-100`) on dark-themed pages — it looks broken and placeholder text becomes invisible
- ✅ `className="bg-zinc-900 text-white placeholder:text-zinc-500 border border-zinc-700"`
- ❌ `className="bg-white text-gray-900"` on a dark page — jarring contrast, unreadable placeholders
- Google Places autocomplete elements: style the container AND the dropdown to match the site theme

### Form rules:
- In server components: `<form>` with NO `onSubmit` — use `action` attribute or a client component
- If you need `onSubmit`, put the ENTIRE form in a `components/ContactForm.tsx` with `'use client'`

## Available Skills

- **api-patterns**: Common API integration patterns including OAuth, API keys, pagination, rate limiting, and error handling. Use when working with external APIs or authentication.
- **app-builder**: Main application building orchestrator. Creates full-stack applications from natural language requests. Determines project type, selects tech stack, coordinates agents.
- **architecture-patterns**: Implement proven backend architecture patterns including Clean Architecture, Hexagonal Architecture, and Domain-Driven Design. Use when architecting complex backend systems or refactoring existing applications for better maintainability.
- **backend-architect**: Expert backend architect specializing in scalable API design, microservices architecture, and distributed systems. Masters REST/GraphQL/gRPC APIs, event-driven architectures, service mesh patterns, and modern backend frameworks. Handles service boundary definition, inter-service communication, resilience patterns, and observability. Use PROACTIVELY when creating new backend services or APIs.
- **business-audit**: Comprehensive business digital presence audit & ongoing monitoring — analyzes website, Google Business Profile, social media, SEO, online ordering/booking, loyalty, marketing automation, voice agent potential, and sets up ongoing weekly/monthly monitoring. Works for ANY business type (restaurant, hotel, retail, clinic, salon, gym, service). Use PROACTIVELY when user asks to research, audit, analyze, monitor, or improve any business.
- **canvas-design**: Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create original visual designs, never copying existing artists' work to avoid copyright violations.
- **code-reviewer**: Elite code review expert specializing in modern AI-powered code analysis, security vulnerabilities, performance optimization, and production reliability. Masters static analysis tools, security scanning, and configuration review with 2024/2025 best practices. Use PROACTIVELY for code quality assurance.
- **connector-creator**: Best practices for creating Brutalos connectors. Use when building new service integrations, creating API connectors, or setting up new data sources.
- **connector-lifecycle-management**: Best practices for creating, maintaining, and manually deleting connectors.
- **connector-management**: Best practices for managing connector lifecycles, including creation and manual deletion.
- **context-driven-development**: Use this skill when working with Conductor's context-driven development methodology, managing project context artifacts, or understanding the relationship between product.md, tech-stack.md, and workflow.md files.
- **ecommerce-builder**: Guides the creation of a buildable, consistent Next.js online shop with SQLite by default. Defaults to creating ONLY the core shop experience (listing, product pages, cart) and strictly inherits the logo and design from reference sites.
- **edit-website**: Surgical website edit workflow — grep to locate, read only that file, edit with precision
- **image-generator**: "Generate images via AI. Run: python .agent/skills/image-generator/scripts/generate_image.py --prompt \"...\" --filename \"name\" --aspect-ratio \"1:1\". Valid aspect ratios: 1:1 (square), 16:9 (banner), 9:16 (mobile), 4:3 (landscape), 3:4 (portrait). Saves PNG to public/images/."
- **image-validator**: Validates that images in generated websites are not broken. Checks URLs, flags placeholders, suggests reliable alternatives.
- **pdf**: Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms. When Claude needs to fill in a PDF form or programmatically process, generate, or analyze PDF documents at scale.
- **pptx-official**: "Presentation creation, editing, and analysis. When Claude needs to work with presentations (.pptx files) for: (1) Creating new presentations, (2) Modifying or editing content, (3) Working with layouts, (4) Adding comments or speaker notes, or any other presentation tasks"
- **prompt-engineer**: Expert prompt engineer specializing in advanced prompting techniques, LLM optimization, and AI system design. Masters chain-of-thought, constitutional AI, and production prompt strategies. Use when building AI features, improving agent performance, or crafting system prompts.
- **prompt-engineering-patterns**: Master advanced prompt engineering techniques to maximize LLM performance, reliability, and controllability in production. Use when optimizing prompts, improving LLM outputs, or designing production prompt templates.
- **python-performance-optimization**: Profile and optimize Python code using cProfile, memory profilers, and performance best practices. Use when debugging slow Python code, optimizing bottlenecks, or improving application performance.
- **react-best-practices**: Comprehensive React and Next.js performance optimization guide with 40+ rules for eliminating waterfalls, optimizing bundles, and improving rendering. Use when optimizing React apps, reviewing performance, or refactoring components.
- **react-modernization**: Upgrade React applications to latest versions, migrate from class components to hooks, and adopt concurrent features. Use when modernizing React codebases, migrating to React Hooks, or upgrading to latest React versions.
- **ready2order-analyst**: Expert in analyzing ready2order POS data, sales trends, and inventory management via API.
- **restaurant-growth-report**: Generate a branded 11-page BRUTAL.AI growth report PDF for restaurants, cafes, and hospitality businesses using ReportLab. Calculates € revenue impact for 5 growth levers with HEUTE vs MIT BRUTAL.AI comparison cards, summary tables, before/after revenue visualization, and 8-week implementation timeline. Dark/white alternating pages, neon green accents. Use PROACTIVELY when the audited business is a restaurant, cafe, bar, bistro, Wirtshaus, or hospitality venue.
- **reverse-engineer**: Expert reverse engineer specializing in binary analysis, disassembly, decompilation, and software analysis. Masters IDA Pro, Ghidra, radare2, x64dbg, and modern RE toolchains. Handles executable analysis, library inspection, protocol extraction, and vulnerability research. Use PROACTIVELY for binary analysis, CTF challenges, security research, or understanding undocumented software.
- **security-auditor**: Expert security auditor specializing in DevSecOps, comprehensive cybersecurity, and compliance frameworks. Masters vulnerability assessment, threat modeling, secure authentication (OAuth2/OIDC), OWASP standards, cloud security, and security automation. Handles DevSecOps integration, compliance (GDPR/HIPAA/SOC2), and incident response. Use PROACTIVELY for security audits, DevSecOps, or compliance implementation.
- **senior-backend**: Comprehensive backend development skill for building scalable backend systems using NodeJS, Express, Go, Python, Postgres, GraphQL, REST APIs. Includes API scaffolding, database optimization, security implementation, and performance tuning. Use when designing APIs, optimizing database queries, implementing business logic, handling authentication/authorization, or reviewing backend code.
- **senior-frontend**: Comprehensive frontend development skill for building modern, performant web applications using ReactJS, NextJS, TypeScript, Tailwind CSS. Includes component scaffolding, performance optimization, bundle analysis, and UI best practices. Use when developing frontend features, optimizing performance, implementing UI/UX designs, managing state, or reviewing frontend code.
- **seo-authority-builder**: Analyzes content for E-E-A-T signals and suggests improvements to build authority and trust. Identifies missing credibility elements. Use PROACTIVELY for YMYL topics.
- **seo-content-auditor**: Analyzes provided content for quality, E-E-A-T signals, and SEO best practices. Scores content and provides improvement recommendations based on established guidelines. Use PROACTIVELY for content review.
- **seo-content-planner**: Creates comprehensive content outlines and topic clusters for SEO. Plans content calendars and identifies topic gaps. Use PROACTIVELY for content strategy and planning.
- **seo-content-writer**: Writes SEO-optimized content based on provided keywords and topic briefs. Creates engaging, comprehensive content following best practices. Use PROACTIVELY for content creation tasks.
- **seo-keyword-strategist**: Analyzes keyword usage in provided content, calculates density, suggests semantic variations and LSI keywords based on the topic. Prevents over-optimization. Use PROACTIVELY for content optimization.
- **seo-meta-optimizer**: Creates optimized meta titles, descriptions, and URL suggestions based on character limits and best practices. Generates compelling, keyword-rich metadata. Use PROACTIVELY for new content.
- **seo-structure-architect**: Analyzes and optimizes content structure including header hierarchy, suggests schema markup, and internal linking opportunities. Creates search-friendly content organization. Use PROACTIVELY for content structuring.
- **shell-redirection-handling**: Error prevention rules compiled from real incidents
- **skill-creator**: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.
- **startup-analyst**: Expert startup business analyst specializing in market sizing, financial modeling, competitive analysis, and strategic planning for early-stage companies. Use PROACTIVELY when the user asks about market opportunity, TAM/SAM/SOM, financial projections, unit economics, competitive landscape, team planning, startup metrics, or business strategy for pre-seed through Series A startups.
- **stripe-integration**: Implement Stripe payment processing in Next.js/TypeScript projects. Covers Stripe Checkout (redirect), Stripe Elements (embedded PaymentElement), webhooks, and admin refunds. All code is TypeScript for Next.js App Router.
- **theme-factory**: Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can apply to any artifact that has been creating, or can generate a new theme on-the-fly.
- **tsc-cli-syntax**: Error prevention rules compiled from real incidents
- **ui-design-system**: UI design system toolkit for Senior UI Designer including design token generation, component documentation, responsive design calculations, and developer handoff tools. Use for creating design systems, maintaining visual consistency, and facilitating design-dev collaboration.
- **ui-ux-pro-max**: UI/UX design intelligence. 50 styles, 21 palettes, 50 font pairings, 20 charts, 9 stacks. Use PROACTIVELY for any website, page, UI, design, styling, color, font, or layout task.
- **ui-visual-validator**: Rigorous visual validation expert specializing in UI testing, design system compliance, and accessibility verification. Masters screenshot analysis, visual regression testing, and component validation. Use PROACTIVELY to verify UI modifications have achieved their intended goals through comprehensive visual analysis.
- **use-attached-image**: How to use an image the user attached in the OpenCode chat. Use this skill IMMEDIATELY when the user attaches an image and wants it on the website.
- **webapp-testing**: Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.
- **website-cloner**: Create a pixel-perfect exact clone of a live website — same layout, same content, same images, same spacing, same everything. Recreates it as a Brutalos React + Tailwind project. Use when user asks to clone, copy, duplicate, replicate, or remake an existing website.
- **wolt-drive-integration**: Expert guide for integrating Wolt Drive (last-mile delivery) into e-commerce checkouts. Covers authentication, shipment promises, venueful/venueless delivery orders, delivery fees, tracking, webhooks, and full Next.js API route examples. Based on official docs at https://developer.wolt.com/docs/wolt-drive

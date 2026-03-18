---
name: website-cloner
description: Create a pixel-perfect exact clone of a live website — same layout, same content, same images, same spacing, same everything. Recreates it as a Brutalos React + Tailwind project. Use when user asks to clone, copy, duplicate, replicate, or remake an existing website.
triggers:
  - clone
  - duplicate
  - replicate
  - remake
  - copy this
  - make it like
  - same as
  - recreate
  - nachbauen
  - kopieren
invocation: auto
requires:
  - ui-ux-pro-max
  - frontend-developer
  - seo-meta-optimizer
  - image-validator
---

# Website Cloner — Pixel-Perfect Exact Clone

Create an **EXACT replica** of a live website. The clone must look **identical** to the original — same layout, same colors, same fonts, same images, same text, same spacing, same everything. This is NOT a "redesign with similar colors" — it is a 1:1 copy.

## ⚠️ GOLDEN RULE

**The finished clone must be visually indistinguishable from the original.** If you put the original and the clone side by side, they should look the same. Every section, every pixel gap, every font weight, every border radius, every shadow — must match.

## Workflow — FOLLOW THIS EXACT ORDER

### Phase 0: CRAWL & SCREENSHOT — Capture ALL pages as visual reference FIRST

0. **Crawl the entire site and screenshot ALL pages** before anything else:
   ```
   crawl_website(url="<URL>", max_pages=10)
   ```
   This visits the homepage, discovers ALL navigation links (nav, header, footer), and takes **full-page screenshots** of every page found. Each screenshot is saved as a reference image.
   
   The result gives you:
   - List of all pages with their URLs, paths, and titles
   - Full-page screenshot paths for EACH page
   - Which pages are navigation links vs other internal links
   
   **Every page must be cloned.** Use these screenshots as the EXACT visual target for each page. Do NOT skip any nav page.

### Phase 1: USE EXTRACTED DATA — Design tokens are already available

`crawl_website` already extracted design tokens from each page. They are in `reference-screenshots/design-tokens.json` and also injected into the prompt context. The tokens include:
- **colors** — exact hex values sorted by frequency (background, text, border, accent)
- **fonts** — font-family + weight + size combos from computed styles
- **spacing** — section padding, container max-width, gaps
- **borders** — border-radius values from cards/buttons
- **shadows** — box-shadow values
- **nav_items** — exact navigation text and hrefs
- **headings** — h1/h2/h3 text with font specs and color
- **text_content** — paragraph and button text (verbatim)
- **images** — src URLs with dimensions
- **google_fonts** — Google Fonts link URLs
- **css_variables** — CSS custom properties from :root

**Use these EXACT values. Do NOT approximate or substitute.**

1. **Read the design tokens** — they are in `reference-screenshots/design-tokens.json`

2. **Read EVERY screenshot** in `reference-screenshots/` — each `.png` is the pixel-perfect target for that page

3. **Fetch the FULL HTML** of each page for structural reference:
   ```bash
   curl -sL "<URL>"
   curl -sL "<URL>/about"
   curl -sL "<URL>/services"
   # ... for each page found by crawl_website
   ```

4. **Cross-reference** HTML structure with screenshots + tokens to build the exact blueprint

5. **Images** — use the exact URLs from `design_tokens.images`. Hotlink original URLs directly.

### Phase 2: BLUEPRINT — Map every element precisely

7. **Create a section-by-section blueprint** with EXACT specifications:
   ```
   === SECTION 1: NAVIGATION ===
   Type: Fixed/sticky top
   Height: 80px
   Background: #ffffff (or transparent over hero)
   Logo: Left-aligned, image URL: <url>, height: 40px
   Menu items: "Home" | "About" | "Services" | "Contact" (right-aligned)
   Font: Montserrat 500 16px #333333
   CTA button: "Book Now", bg: #e94560, text: #fff, border-radius: 8px, padding: 10px 24px
   Mobile: Hamburger menu at 768px breakpoint

   === SECTION 2: HERO ===
   Height: 100vh (or specific px)
   Background: image <url> with dark overlay rgba(0,0,0,0.5)
   Layout: centered text
   H1: "Exact Headline Text Here" — Montserrat 700 56px #ffffff, line-height: 1.2
   Subtitle: "Exact subtitle text" — Open Sans 400 20px #ffffffcc
   CTA: "Get Started" — bg: #e94560, text: #fff, padding: 16px 32px, border-radius: 8px
   Spacing: h1 margin-bottom: 20px, subtitle margin-bottom: 40px

   === SECTION N: ... ===
   [Continue for EVERY section]
   ```

8. **Map layouts precisely**:
   - If original has 3-column grid → use exact same grid (not 2 or 4)
   - If original has specific gap between cards → match exact gap
   - If original has asymmetric layout (60/40 split) → match exact ratio
   - If original has specific section padding (80px top/bottom) → match exactly

### Phase 3: BUILD the exact clone

9. **Create the website project**:
   ```
   create_website(name="<business-name>", business_type="<type>", theme="<dark|light>")
   ```

10. **Generate the code** — the opencode_generate prompt MUST include the full blueprint AND the original HTML as reference:

    ```
    Create a PIXEL-PERFECT exact clone of this website. The clone must look IDENTICAL to the original.

    ## ORIGINAL HTML (for reference — match this structure exactly)
    ```html
    [paste the key sections of the original HTML here]
    ```

    ## EXACT DESIGN TOKENS (use these EXACTLY — do not approximate)
    - Background: #0f0f0f
    - Primary: #e94560
    - Text: #ffffff
    - Text secondary: #a0a0a0
    - Font heading: 'Montserrat', sans-serif (weights: 700, 600)
    - Font body: 'Open Sans', sans-serif (weights: 400, 300)
    - Container max-width: 1200px
    - Section padding: 80px 0
    - Card border-radius: 12px
    - Card shadow: 0 4px 20px rgba(0,0,0,0.15)
    - Button border-radius: 8px
    - Button padding: 12px 28px
    - Nav height: 72px

    ## EXACT SECTIONS (in this order — do NOT skip or reorder)
    [Full blueprint from Phase 2]

    ## EXACT TEXT CONTENT (copy verbatim — do NOT rewrite)
    [All extracted text]

    ## IMAGES (use these exact URLs)
    - Logo: <url>
    - Hero bg: <url>
    - [All other images with their exact URLs]

    ## TECHNICAL
    - React + Tailwind CSS (extend tailwind.config.js with exact colors/fonts)
    - Add Google Fonts link in index.html for exact font families
    - Responsive breakpoints matching original
    - Framer Motion ONLY if original has animations
    - Forms are visual only (no backend submission)
    ```

11. **Configure Tailwind with exact design tokens** — extend the theme in tailwind.config.js:
    ```js
    theme: {
      extend: {
        colors: {
          primary: '#exact-hex',
          secondary: '#exact-hex',
          // every color from the original
        },
        fontFamily: {
          heading: ['Montserrat', 'sans-serif'],
          body: ['Open Sans', 'sans-serif'],
        },
        // exact spacing, border-radius, shadows from original
      }
    }
    ```

12. **Add Google Fonts** to index.html `<head>`:
    ```html
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@300;400&display=swap" rel="stylesheet">
    ```

### Phase 4: PIXEL-PERFECT VERIFICATION

13. **Verify EVERY section** against the original:
    - [ ] Same number of sections in same order
    - [ ] Same navigation items in same order
    - [ ] Same hero layout, text, and image
    - [ ] Same grid columns and card count per section
    - [ ] Same footer structure and content
    - [ ] Same colors everywhere (backgrounds, text, buttons, borders)
    - [ ] Same fonts and font sizes
    - [ ] Same spacing (padding, margins, gaps)
    - [ ] Same border-radius and shadows
    - [ ] Same images in same positions
    - [ ] ALL text matches verbatim

14. **Fix ANY discrepancy** — if something doesn't match, fix it immediately. Do NOT leave differences.

## ⛔ FORBIDDEN — Things That Break the Clone

- ❌ **Do NOT redesign** — this is a clone, not a "fresh take"
- ❌ **Do NOT change colors** — use the EXACT hex values from the original
- ❌ **Do NOT change fonts** — use the EXACT font families from the original
- ❌ **Do NOT rewrite text** — use the EXACT words from the original
- ❌ **Do NOT rearrange sections** — keep the EXACT same order
- ❌ **Do NOT add sections** that don't exist on the original
- ❌ **Do NOT remove sections** that exist on the original
- ❌ **Do NOT substitute images** with Unsplash unless original images are completely inaccessible
- ❌ **Do NOT use generic spacing** (like Tailwind's default p-8) — match the EXACT pixel values
- ❌ **Do NOT guess** — if you can't read a value, fetch the CSS again and look harder
- ❌ **Do NOT add your own animations** if the original doesn't have them
- ❌ **Do NOT use default Tailwind colors** (blue-500, gray-700, etc.) — always use the extracted colors

## ✅ REQUIRED — Non-Negotiable

- ✅ Fetch and read the FULL HTML + CSS before writing any code
- ✅ Extract EXACT hex values, font names, pixel spacing from the CSS
- ✅ Use the original images (hotlink or download to public/ folder)
- ✅ Copy ALL text verbatim — every heading, paragraph, button, label, footer line
- ✅ Match the exact number of columns, cards, items in every section
- ✅ Configure tailwind.config.js with the exact design tokens
- ✅ Add Google Fonts (or whatever fonts the original uses) to index.html
- ✅ Test every section against the original before delivering

## Multi-Page Sites

`crawl_website` already discovered and screenshotted all pages. Now clone every one:

1. Install react-router-dom: add to package.json dependencies
2. Create a shared Layout component with the EXACT header + footer from original
3. For EACH page returned by `crawl_website`:
   - Fetch the HTML with `curl -sL "<page_url>"`
   - Extract that page's unique content (between header and footer)
   - Create a component matching the screenshot EXACTLY
4. Set up BrowserRouter with routes matching original URL paths
5. Navigation links use React Router `<Link>` with same text and order
6. Every page must match its corresponding screenshot — verify each one

## Handling Images

Priority order for images:
1. **Hotlink the original image URL** — simplest, use `<img src="https://original-site.com/image.jpg">`
2. **Download to public/ folder** — if hotlinking is blocked by CORS:
   ```bash
   curl -sL "<image-url>" -o public/images/<filename>
   ```
3. **Use verified Unsplash ID** — ONLY if image is completely inaccessible AND you cannot download it. This is the LAST resort, not the default.

## After Cloning — Tell the User

1. "I've created an exact clone of [website]"
2. Share the preview URL
3. "The clone matches the original: same layout, colors, fonts, images, and content"
4. Ask: "Want me to modify anything — update text, swap images, change colors?"

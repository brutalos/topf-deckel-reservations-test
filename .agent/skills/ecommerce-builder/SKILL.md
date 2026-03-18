---
name: ecommerce-builder
description: Guides the creation of a buildable, consistent Next.js online shop with SQLite by default. Defaults to creating ONLY the core shop experience (listing, product pages, cart) and strictly inherits the logo and design from reference sites.
---

# E-commerce Builder Skill

This skill provides a structured workflow and strict coding rules for creating robust online shops.

## Workflow

### 1. Design & Context Discovery
Before generating any code, establish the visual identity:
- **Check Projects**: Call `list_projects` to see if a related website (e.g., a landing page for the same business) already exists.
- **Extract Design**: If a project exists, `switch_project` to it and use `screenshot_website` to extract the logo, primary/secondary colors, and typography.
- **External Reference**: If no existing project is found, ask the user for a reference URL. Use `screenshot_website(url=...)` to capture and analyze the design.
- **Logo Inheritance (MANDATORY)**: ALWAYS get the logo from the existing website or reference URL. DO NOT create a new logo or use placeholders if a logo can be extracted from the reference.
- **Confirmation**: Present the extracted design tokens (colors, fonts, logo) to the user for approval before building.

### 1b. Product Discovery (MANDATORY — DO NOT INVENT PRODUCTS)
Before creating any product data, you MUST extract REAL products from the actual business website:
- **Use `crawl_website`** — call `crawl_website(url="https://the-business.com", max_pages=15)` to crawl ALL pages of the website. This captures screenshots AND HTML of every page including product/shop pages. Do NOT use `screenshot_website` for this — it only captures ONE page.
- **Read the crawled HTML files**: After `crawl_website` finishes, read the HTML files in `reference-screenshots/` or `_mirror/` to extract product data (names, descriptions, prices, images).
- **Extract EVERYTHING**: Product names, descriptions, prices, weights, categories, and image URLs. Be thorough — the crawl captures sub-pages automatically.
- **Product images are in `public/images/`**: The crawl downloads images from the site. Use `ls public/images/` to see what's available. Use these images first.
- **Generate missing images**: For any product that lacks a local image after the crawl, use the `generate_image` tool to create a product photo: `generate_image(prompt="<product name>, product photography, white background, studio lighting")`. The image is saved to `public/images/` automatically.
- **NEVER invent fake products**: Do NOT use placeholder names like "Product 1", "Sample Item", "Artisan Blend", or made-up prices. Every product MUST come from the actual business website.
- **NEVER use external image URLs**: Do NOT use Unsplash, Pexels, loremflickr, placeholder.com, picsum, or ANY https:// image URL. ALL images must be local files in `public/images/` with paths like `/images/product-name.png`. Use `generate_image` for any missing product photos.
- **If no products found**: Ask the user to provide their product catalog. Do NOT proceed with dummy data — STOP and ask.
- **Seed the database**: Use the extracted real products to seed the SQLite database via Prisma.

### 2. Architecture & Stack
Always use the following stack:
- **Framework**: Next.js 16 (App Router).
- **Database**: SQLite via Prisma (zero-config). The `.env` already has the correct `DATABASE_URL` — do NOT change it.
- **ORM**: Prisma.
- **Styling**: Tailwind CSS v4.
- **State**: React 19 `useActionState` and `useOptimistic` for cart and checkout.
- **Database**: ALWAYS SQLite via Prisma. NEVER switch to PostgreSQL.

### 3. Strict Coding Rules (Anti-Break Protocol)
To ensure the site is always buildable and high-quality:
- **Global Layout**: Define exactly ONE `components/Navbar.tsx` and ONE `components/Footer.tsx`. Import both in `app/layout.tsx`.
- **Cart Icon (MANDATORY)**: The Navbar MUST have a clearly visible shopping cart icon (use `ShoppingCart` from `lucide-react`) that links to `/cart`. The icon must be high-contrast — white or accent color on dark backgrounds, dark on light backgrounds. Include an item count badge next to the icon. The badge must always be rendered in the DOM (use CSS `hidden`/`block` toggle, NOT conditional rendering like `{count > 0 && ...}`) to avoid hydration mismatch.
- **Page Isolation**: Individual page files (e.g., `app/products/page.tsx`) must NOT contain navbar or footer markup.
- **Mobile First**: Use Tailwind breakpoints (`md:`, `lg:`) for all layouts. Ensure the navbar has a functional mobile hamburger menu. The cart icon must be visible on mobile too (not hidden inside the hamburger menu).
- **Verification**: After EVERY `opencode_generate` call, call `screenshot_website()` to check for `has_errors`. If errors exist, fix them immediately before proceeding.
- **CSS Imports**: Google Fonts `@import url(...)` FIRST, then `@import "tailwindcss";` LAST (it expands inline into ~1200 lines). Never put url imports after tailwindcss.
- **`@theme inline` completeness (CRITICAL — white-on-white bug)**: Every semantic color name used in components MUST have a matching `--color-<name>` entry in `@theme inline`. Numbered palette variables (`--color-0` … `--color-19`) are NOT usable as utilities — only named ones are. If your components use `bg-accent`, `text-accent`, `bg-light`, `text-light`, etc., you MUST define `--color-accent` and `--color-light` in `@theme inline`. Missing entries silently produce no CSS → text becomes invisible against the background (white-on-white). Always define at minimum: `--color-primary`, `--color-accent`, `--color-light`, `--color-dark` in `@theme inline`.
- **Hydration Safety**: NEVER conditionally render/remove DOM elements based on client-only state (cart count, localStorage, context). This causes hydration mismatch because server HTML differs from client HTML. Instead, **always render the element and toggle visibility with CSS**:
  ```tsx
  // ❌ BAD — conditional rendering causes hydration mismatch
  {totalItems > 0 && <span className="badge">{totalItems}</span>}

  // ✅ GOOD — always render, hide with CSS class
  <span className={`badge ${totalItems > 0 ? 'block' : 'hidden'}`}>{totalItems}</span>
  ```
  This applies to: cart item count badges, "items in cart" text, auth-dependent UI, any value from React context or localStorage.

### 4. Database Schema
Create `prisma/schema.prisma` with SQLite provider:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```
Standard e-commerce models:
- `Product`: id, name, description, price, imageUrl, categoryId, stockCount.
- `Category`: id, name, slug.
- `Order`: id, customerEmail, totalAmount, status, createdAt.
- `OrderItem`: id, orderId, productId, quantity, price.

Setup commands:
1. `npx prisma db push` — creates the SQLite file and tables.
2. `npx prisma generate` — generates the TypeScript client.
3. Create `prisma/seed.ts` with real product data, run `npx prisma db seed`.

### FK Violation Prevention (CRITICAL — "Foreign key constraint violated" crash)

**Seed order (MUST follow this sequence):**
1. Delete in reverse: `orderItems` → `orders` → `products` → `categories`
2. Create: `categories` first → `products` (with valid `categoryId`) → never seed orders

**Order creation in API route — ALWAYS validate product IDs first:**
```typescript
// app/api/orders/route.ts
export async function POST(req: NextRequest) {
  const { items, ... } = await req.json();

  // ALWAYS verify all product IDs exist before creating order
  const productIds = items.map((i: any) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: 'One or more products not found' }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      customerEmail: ...,
      totalAmount: ...,
      status: 'PENDING',
      items: {
        create: items.map((i: any) => ({
          quantity: i.quantity,
          price: i.price,
          product: { connect: { id: i.productId } },  // ✅ connect, NOT create
        })),
      },
    },
  });
}
```

- ❌ `productId: i.productId` — direct field assignment can violate FK if ID doesn't exist
- ✅ `product: { connect: { id: i.productId } }` — explicit connect, Prisma gives clearer error
- ❌ Using localStorage cart item IDs directly — they may be stale/fake. Always fetch fresh product from DB by ID before connecting.
- ✅ Cart items stored in localStorage should use the Prisma `product.id` (UUID/cuid from DB), set when the product is first loaded from `/api/products`.

**Cart item source (CRITICAL — prevents FK violations at root):**
- The `AddToCartButton` component MUST receive the full product object as a prop — sourced from a server component that fetched it via Prisma. NEVER construct product objects with hardcoded or invented IDs.
- `CartContext` `addItem()` must accept a product object whose `id` field came directly from the DB response. Any item added to the cart MUST have been fetched from `/api/products` or `/api/products/[id]` first.
- NEVER generate or guess product IDs. NEVER use array indices or slugs as IDs in cart items — only use the actual Prisma `id` field.
- Pattern:
  ```tsx
  // ✅ Server component fetches from DB, passes to client button
  // app/products/[id]/page.tsx (Server Component)
  const product = await prisma.product.findUnique({ where: { id: params.id } })
  return <AddToCartButton product={product} />  // id comes from DB

  // components/AddToCartButton.tsx ('use client')
  // addItem({ id: product.id, name: product.name, price: product.price, ... })
  // id is guaranteed to exist in DB — no FK violation possible
  ```

### 5. Scope Control (CRITICAL — DO NOT CREATE EXTRA PAGES)
**Create ONLY the core shopping pages. NOTHING ELSE.**
- **Core (ONLY these)**: `/` = Product Listing (PLP), `/products/[id]` = Product Detail (PDP), `/cart` = Cart, `/checkout` = Checkout.
- **FORBIDDEN unless user explicitly asks**: Home page (separate from shop), "About Us", "About", "FAQ", "Contact", "Terms of Service", "Blog", "Story", or ANY other non-shop page. Do NOT create these. Do NOT add nav links to them.
- **The root `/` page IS the shop** — it shows the product listing directly. Do NOT create a separate "welcome" or "landing" homepage.
- **Nav Links**: ONLY link to pages that exist: Shop, Cart. Nothing else unless the user asked for it.
- **If in doubt, DON'T create it.** The user will ask for additional pages if they want them.

### 6. Conditional Features
Only implement the following if explicitly requested by the user:
- **Stripe Integration**: Load the `stripe-integration` skill for full reference. The `stripe`, `@stripe/stripe-js`, and `@stripe/react-stripe-js` packages are already in `package.json`. Use **Stripe Checkout (redirect)** for simple shops or **Stripe Elements (embedded PaymentElement)** for custom checkout UIs. MUST follow the skill's CRITICAL rules — do NOT create fake placeholder card input divs.
- **Wolt Drive Delivery**: Load the `wolt-drive-integration` skill for full API reference. **CRITICAL: Delivery dispatch is ALWAYS manual via an admin dashboard (`/admin/orders`). The merchant clicks "Dispatch Wolt Courier" on each order. NEVER auto-dispatch from checkout, payment webhooks, or order creation. The checkout only collects the address and shows the delivery fee.**
- **Inventory Management**: Add an admin dashboard route (`/admin`) with CRUD operations for products and stock tracking.

## Implementation Steps
1. Create project with `create_project(project_type="website", website_mode="multipage")`.
2. Create `prisma/schema.prisma` with SQLite provider and e-commerce models.
3. Run `npx prisma db push` and `npx prisma generate`.
4. Create `prisma/seed.ts` with real product data, run `npx prisma db seed`.
5. Scaffold core components (Navbar, Footer, Layout).
6. Build Product Listing Page (PLP) and Product Detail Page (PDP) with Prisma queries.
7. Implement Shopping Cart (localStorage-based via client component).
8. Verify build with `screenshot_website`.

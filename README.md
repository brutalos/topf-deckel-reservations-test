# Topf & Deckel Multi-Store Platform

A unified Next.js App Router application serving as storefront, checkout, and kitchen dashboard for all Topf & Deckel locations.

## Features

- **Multi-Store Storefront** — each store served at `/:storeId` with its own branding and menu
- **Dynamic Live Menu** — Automatic background fetching from the remote `menu.js` service synced natively into the Next.js cache (`src/lib/menuFetcher.ts`)
- **Kombo Selection Modal** — guided 2-step UI for combo meals (starter/soup + main, or main + dessert)
- **Local SQLite Database** — robust native persistence via Prisma ORM for seamless stock control and historical order tracking
- **Ordering Window Restrictions** — ASAP and pre-order availability enforced by Vienna timezone rules (peak hour 12:00–13:00 checkout blocked)
- **Stripe Elements Checkout** — embedded payment UI with pre-order scheduling
- **Wolt Drive Integration** — venueful integration; kitchen confirms orders and dispatches Wolt couriers
- **Kitchen Dashboard** — real-time order board with sound alerts, ETA countdown, cancellation

---

## Environment Variables

Create a `.env` file in `topf-deckel/`:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...       # from: stripe listen --print-secret

# Wolt — set staging for dev, production for live
WOLT_ENV=staging                      # change to "production" for live deployment
WOLT_STAGING_API=vwolt_...            # staging API key
API=vwolt_...                         # production API key
WOLT_WEBHOOK_SECRET=...               # shared secret for JWT signature verification
MX_STAGING=...                        # staging merchant ID
MX=...                                # production merchant ID

# Google Maps (geocoding)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...

# Public URL (used by webhook registration)
PUBLIC_URL=https://your-domain.com
```

> `WOLT_ENV=staging` → dev API + staging keys  
> `WOLT_ENV=production` → live API + production keys  

---

## Running Locally

```bash
npm install
npx prisma db push    # Initialize the local SQLite database 
npx prisma generate
npm run dev           # http://localhost:3000
```

| URL | What |
|-----|------|
| `http://localhost:3000` | Store locator |
| `http://localhost:3000/judengasse` | Storefront |
| `http://localhost:3000/admin/judengasse` | Kitchen dashboard |

### Test Stripe Webhooks Locally

> **Important:** `stripe listen` must use the **same Stripe account** that your `.env` keys belong to.
> The `.env` uses a **restricted key** (`rk_test_...`) which the CLI cannot authenticate with.
> You need the **full secret key** (`sk_test_...`) from the Stripe Dashboard for the CLI.

#### Step-by-step

**1. Get your full test secret key**

Stripe Dashboard → **Developers → API Keys → Secret key** (test mode)  
→ Click **Reveal test key** and copy the `sk_test_51TBWyS...` value

**2. Start the webhook forwarder** (run alongside `npm run dev`)

```bash
stripe listen \
  --api-key sk_test_51TBWySRRO3IXlvQ8YOUR_FULL_KEY \
  --forward-to localhost:3000/api/webhooks/stripe
```

**3. Update the signing secret in `.env`**

Copy the `whsec_...` printed by the CLI and set:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
```
> ⚠️ This secret changes every time you restart `stripe listen`. Update `.env` each time.  
> ⚠️ Restart `npm run dev` after changing `.env` so Next.js picks up the new value.

**4. Place a test order**

Use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC.

**Expected server logs on success:**
```
[Stripe Webhook] 🔔 POST Request received at /api/webhooks/stripe
[Stripe Webhook] ✅ Signature verified
[Stripe Webhook] Event type: payment_intent.succeeded
✅ Order saved [WOLT-XXXXXXXX] #1001 → store: wipplingerstrasse
[Stripe Webhook] 🚀 Auto-dispatching Wolt for WOLT-XXXXXXXX...
```

#### Fallback: webhook-free operation

Even without `stripe listen`, orders are still created.  
The success page (`/[storeId]/success`) calls `POST /api/checkout/confirm` on load,
which verifies the PaymentIntent directly with Stripe and creates the order if the webhook hasn't.
Both paths use the same deduplication logic — no duplicate orders are ever created.


### Test Wolt API Locally

For Wolt webhook delivery status updates, expose localhost with [ngrok](https://ngrok.com):
```bash
ngrok http 3000

# Register the ngrok URL
curl -X POST http://localhost:3000/api/admin/register-webhook \
  -H "Content-Type: application/json" \
  -d '{"publicUrl": "https://YOUR-NGROK-URL.ngrok-free.app"}'
```

---

## Ordering Window Rules

The store operates **Mon–Fri 11:00–15:00 (Vienna time)**. Peak hour 12:00–13:00 automatically blocks checkout.

| Mode | Window |
|------|--------|
| ASAP | 11:00–11:45 and 13:00–14:45 |
| Pre-order delivery | 11:00–12:15 and 13:30–15:00 |
| Min advance (Wolt) | 60 minutes |

These rules are enforced client-side in `src/lib/orderingWindows.ts`.

---

## Deployment to GCP (Native Node.js)

Because the project relies on native file-system capabilities via Prisma (SQLite) and standard Next.js caching algorithms, memory-restricted edge deployment platforms like Cloudflare Workers are strictly incompatible. Setting this up on any standard Virtual Machine (e.g., Google Cloud Compute Engine, DigitalOcean, AWS EC2) running Node.js is simple:

### 1. Build the production application

```bash
npm install
npx prisma db push --accept-data-loss
npx prisma generate
npm run build
```

### 2. Start the server (PM2 Recommended)

To keep the application running permanently in the background on your VM:
```bash
npm install -g pm2
pm2 start npm --name "topf-deckel" -- start
```

### 3. Register live webhooks (once after first deploy)

**Stripe** — Stripe Dashboard → Webhooks → Add endpoint:
- URL: `https://your-domain.com/api/webhooks/stripe`

**Wolt:**
```bash
curl -X POST https://your-domain.com/api/admin/register-webhook \
  -H "Content-Type: application/json" \
  -d '{"publicUrl": "https://your-domain.com"}'
```

---

## Project Structure

```
src/
├── app/
│   ├── [storeId]/          # Customer storefront
│   │   ├── components/     # MenuGrid, CartSidebar, KomboModal
│   │   ├── ClientPage.tsx  # Interactive UI boundaries
│   │   └── page.tsx        # Server Component injecting cached menu data
│   ├── admin/[storeId]/    # Kitchen dashboard
│   └── api/
│       ├── checkout/       # Stripe session creation
│       ├── stock/          # Per-store sold-out state (Database)
│       ├── wolt/           # Wolt promise + delivery APIs
│       ├── admin/          # Order management + webhook registration
│       └── webhooks/       # Stripe + Wolt webhook handlers
├── config/
│   └── stores.ts           # Store definitions (IDs, venue IDs, coordinates)
├── lib/
│   ├── menuFetcher.ts      # Instantiates cached fetch from Cloud Run
│   ├── orderStore.ts       # Database (Prisma) access functions
│   ├── orderingWindows.ts  # Vienna-tz ordering window logic
│   ├── stripe.ts
│   └── wolt.ts             # Wolt API client
└── prisma/
    └── schema.prisma       # SQLite Schema Tables structure
```

---

## Checking Backend Logs (Production)

If running via `pm2` on your cloud server instance:
```bash
pm2 logs topf-deckel
```

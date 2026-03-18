---
name: wolt-drive-integration
description: Expert guide for integrating Wolt Drive (last-mile delivery) into e-commerce checkouts. Covers authentication, shipment promises, venueful/venueless delivery orders, delivery fees, tracking, webhooks, and full Next.js API route examples. Based on official docs at https://developer.wolt.com/docs/wolt-drive
---

# Wolt Drive Integration Skill

Complete reference for integrating Wolt Drive's last-mile delivery service into any online shop or e-commerce platform built with Next.js. All request/response formats are taken directly from the official Wolt Drive API documentation.

## When to Use

- Adding "Delivery by Wolt" as a shipping option in a checkout flow
- Calculating real-time shipping costs based on customer location
- Building an admin dashboard where the merchant manually dispatches Wolt couriers
- Providing customers with real-time tracking links for their orders

**CRITICAL: NEVER auto-dispatch Wolt deliveries.** The dispatch must ALWAYS be a manual action
triggered by the merchant from an admin dashboard. The checkout flow only collects the address
and shows the delivery fee — the actual courier dispatch happens later when the admin clicks
"Dispatch Wolt Courier" on the order.

## Credential Requirement (MUST DO BEFORE BUILDING)

When calling `opencode_generate`, you MUST pass `services="wolt-drive,google-maps"` (add to any other services, e.g. `services="stripe,wolt-drive,google-maps"`).
This ensures real Wolt API credentials from the credential store are injected into `.env.local`.
If credentials are missing, `opencode_generate` will fail and tell you to collect them from the user first via `request_credentials`.

**MUST ASK the user BEFORE building:**
1. **Support email** — e.g. "What email should customers see for order support?" → store as `STORE_SUPPORT_EMAIL` in `.env.local`
2. **Support phone** (optional) — e.g. "What phone number for delivery support? (E.164 format like +43...)" → store as `STORE_SUPPORT_PHONE` in `.env.local`
3. **Wolt API Credentials** — If not already available in the environment, ask for `WOLT_DRIVE_API_KEY`, `WOLT_DRIVE_VENUE_ID` (for venueful), and/or `WOLT_DRIVE_MERCHANT_ID` (for venueless).

These are passed to Wolt in every `createDelivery()` call via `customer_support`. Wolt returns 422 if `customer_support` is missing.

---

## 1. Environment Setup

### Required Credentials

| Variable | Description |
|----------|-------------|
| `WOLT_DRIVE_API_KEY` | Merchant Key (Bearer token). Staging key from Wolt during dev, production key after go-live. Also referred to as "merchant key" or "access token". |
| `WOLT_DRIVE_VENUE_ID` | Venue ID — identifies the physical pickup location. Required for **venueful** endpoints. |
| `WOLT_DRIVE_MERCHANT_ID` | Merchant ID — required for **venueless** endpoints and `available-venues`. |
| `WOLT_DRIVE_BASE_URL` | API base URL. See table below. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps/Places API key for address autocomplete in checkout. Must have Places API enabled. |
| `STORE_SUPPORT_EMAIL` | Store/business support email — **REQUIRED** by Wolt in every delivery request. Ask the user for this before building. |
| `STORE_SUPPORT_PHONE` | Store/business support phone (E.164 format) — optional but recommended. Ask the user for this before building. |

### Base URLs

| Environment | Base URL |
|-------------|----------|
| **Staging** | `https://daas-public-api.development.dev.woltapi.com` |
| **Production** | `https://daas-public-api.wolt.com` |

### `.env` Example

```env
WOLT_DRIVE_API_KEY=your_merchant_key_here
WOLT_DRIVE_VENUE_ID=your_venue_id_here
WOLT_DRIVE_MERCHANT_ID=your_merchant_id_here
WOLT_DRIVE_BASE_URL=https://daas-public-api.development.dev.woltapi.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
STORE_SUPPORT_EMAIL=support@yourstore.com
STORE_SUPPORT_PHONE=+4312345678
```

### Authentication

All requests use Bearer authentication:

```
Authorization: Bearer <merchant_key>
Content-Type: application/json
```

One token per merchant — same token for all endpoints. Staging and production tokens are different.

---

## 2. API Reference

Wolt Drive has two integration paths:
- **Venueful** (recommended) — pickup venue is pre-configured in Wolt's system. Uses `venue_id` in the URL. Endpoints: `shipment-promises`, `deliveries`, `available-venues`.
- **Venueless** — merchant provides pickup address with every request. Uses `merchant_id` in the URL. Endpoints: `delivery-fee`, `delivery-order`.

### 2.1 Shipment Promise (Venueful)

Check delivery availability, get price estimate and ETA.

```
POST /v1/venues/{venue_id}/shipment-promises
```

**IMPORTANT: The request body uses FLAT top-level address fields, NOT a nested `dropoff.location` object.**

**CRITICAL: Use address fields ONLY (street, city, post_code). Do NOT use lat/lon coordinates. Do NOT implement any radius/distance checks — Wolt handles delivery area validation via the `is_binding` field.**

**Request Body (ASAP delivery):**

```json
{
  "street": "Stephansplatz 1",
  "city": "Wien",
  "post_code": "1010"
}
```

**Request Body (with parcels for accurate price including extra fees):**

```json
{
  "street": "Stephansplatz 1",
  "city": "Wien",
  "post_code": "1010",
  "min_preparation_time_minutes": 15,
  "parcels": [
    {
      "count": 1,
      "dimensions": {
        "weight_gram": 1500,
        "width_cm": 30,
        "height_cm": 20,
        "depth_cm": 15
      },
      "price": { "amount": 2500, "currency": "EUR" }
    }
  ]
}
```

**Request Body (scheduled delivery — more than 1 hour out):**

```json
{
  "street": "Stephansplatz 1",
  "city": "Wien",
  "post_code": "1010",
  "scheduled_dropoff_time": "2025-03-15T18:00:00Z",
  "min_preparation_time_minutes": 20
}
```

**Address field formatting rules:**
- The `street` field MUST include the house number (e.g. `"Wiedner Hauptstraße 42"`)
- Entrance/apartment numbers can be included in `street` or as dropoff comments on the delivery
- Floor number, door code, delivery instructions → do NOT put in `street`, use dropoff `comment` on delivery request instead

**Binding vs Non-Binding Promises:**

| Input combination | Binding? | Can create delivery? |
|-------------------|----------|---------------------|
| `street` + `post_code` + `city` | ✅ Yes (accurate) | ✅ Yes |
| `street` + `city` | ✅ Yes (risk of address mixups) | ✅ Yes |
| `street` + `post_code` | ✅ Yes (risk of address mixups) | ✅ Yes |
| `post_code` or `city` only | ❌ No (rough area estimate) | ❌ No |

**ALWAYS send all three fields** (`street` + `city` + `post_code`) for the most accurate binding promise. Google Places Autocomplete provides all three automatically — enforce this by making address fields read-only (populated only via autocomplete selection).

**Response (201 Created):**

```json
{
  "id": "promise_abc123",
  "created_at": "2025-01-30T10:00:13.123Z",
  "valid_until": "2025-01-30T10:15:13.123Z",
  "pickup": {
    "venue_id": "699c137d2e4bdf15aeed6768",
    "location": {
      "coordinates": { "lat": 48.1951, "lon": 16.3654 },
      "formatted_address": "Wiedner Hauptstraße 42, 1040 Wien"
    },
    "options": { "min_preparation_time_minutes": 15 },
    "eta_minutes": 5
  },
  "dropoff": {
    "location": {
      "coordinates": { "lat": 48.2082, "lon": 16.3738 },
      "formatted_address": "Stephansplatz 1, 1010 Wien"
    },
    "options": { "scheduled_time": null },
    "eta_minutes": 25
  },
  "price": {
    "amount": 490,
    "currency": "EUR"
  },
  "time_estimate_minutes": 25,
  "is_binding": true,
  "parcels": []
}
```

**Key response fields:**
- `id` — **Save this!** Required to create the delivery later.
- `price.amount` — Price in **smallest currency unit** (cents). 490 = €4.90. VAT included.
- `dropoff.eta_minutes` — Estimated minutes until delivery (use this, NOT `time_estimate_minutes` which is deprecated).
- `is_binding` — If `false`, you CANNOT create a delivery from this promise.
- `valid_until` — Promise expires. Get a fresh one if expired.
- `dropoff.location.formatted_address` — Geocoded address string (for display only, NOT needed for delivery request).

### 2.2 Create Delivery Order (Venueful)

Convert a shipment promise into a live delivery. Call this AFTER payment is confirmed.

```
POST /v1/venues/{venue_id}/deliveries
```

**Request Body:**

```json
{
  "shipment_promise_id": "promise_abc123",
  "merchant_order_reference_id": "order_12345",
  "order_number": "A1234",
  "pickup": {
    "comment": "Order ready at counter, ask for order A1234"
  },
  "dropoff": {
    "location": {
      "coordinates": { "lat": 48.2082, "lon": 16.3738 }
    },
    "comment": "Ring bell 3, 2nd floor",
    "options": {
      "is_no_contact": false
    }
  },
  "recipient": {
    "name": "Max Mustermann",
    "phone_number": "+436641234567",
    "email": "max@example.com"
  },
  "parcels": [
    {
      "count": 1,
      "description": "2x Chicken Tikka Masala, 1x Naan",
      "identifier": "A1234",
      "dimensions": { "weight_gram": 1500 },
      "tags": []
    }
  ],
  "customer_support": {
    "email": "support@myshop.at",
    "phone_number": "+4312345678",
    "url": "https://myshop.at/support"
  },
  "sms_notifications": {
    "received": "Your order from MyShop is confirmed! Track: {tracking_url}",
    "picked_up": "Your order is on its way! Track: {tracking_url}"
  }
}
```

**CRITICAL delivery request rules:**
- `shipment_promise_id` — REQUIRED. The `id` from the promise response.
- `dropoff.location` — Use `coordinates` from the **shipment promise response** (`promise.dropoff.location.coordinates`). Do NOT pass address strings — the Wolt API expects `coordinates: {lat, lon}` as an object, not flat address fields.
- `recipient.name` and `recipient.phone_number` — Courier uses these. **Phone MUST be E.164 format** (e.g. `+436641234567`). Invalid phone numbers cause 422 errors.
- `parcels` — Include for best courier experience. `description` and `identifier` are shown to courier.
- `order_number` — Keep ≤5 chars. Shown to courier. If absent, `merchant_order_reference_id` is shown instead.
- `sms_notifications` — Wolt sends SMS to recipient with `{tracking_url}` replaced by the actual tracking link.

**Response (201 Created):**

```json
{
  "id": "wolt_del_xyz789",
  "status": "INFO_RECEIVED",
  "tracking": {
    "id": "trk_abc",
    "url": "https://wolt.com/tracking/trk_abc"
  },
  "pickup": {
    "location": {
      "coordinates": { "lat": 48.1951, "lon": 16.3654 },
      "formatted_address": "Wiedner Hauptstraße 42, 1040 Wien"
    },
    "comment": "Order ready at counter, ask for order A1234",
    "options": { "min_preparation_time_minutes": 15 },
    "eta": "2025-01-30T10:20:00Z",
    "display_name": "My Restaurant"
  },
  "dropoff": {
    "location": {
      "coordinates": { "lat": 48.2082, "lon": 16.3738 },
      "formatted_address": "Stephansplatz 1, 1010 Wien"
    },
    "comment": "Ring bell 3, 2nd floor",
    "options": { "is_no_contact": false },
    "eta": "2025-01-30T10:45:00Z"
  },
  "price": { "amount": 490, "currency": "EUR" },
  "recipient": {
    "name": "Max Mustermann",
    "phone_number": "+436641234567",
    "email": "max@example.com"
  },
  "wolt_order_reference_id": "wolt_ref_123",
  "merchant_order_reference_id": "order_12345",
  "order_number": "A1234"
}
```

**Key fields to save in your DB:**
- `wolt_order_reference_id` — for cancellation and webhook matching
- `tracking.url` → show to customer
- `status` — initial is always `INFO_RECEIVED`

### 2.3 Available Venues

Pre-filter which venues can deliver to a given location.

```
POST /merchants/{merchant_id}/available-venues
```

**Request Body:**

```json
{
  "dropoff": {
    "location": {
      "formatted_address": "Stephansplatz 1, 1010 Wien",
      "coordinates": { "lat": 48.2082, "lon": 16.3738 }
    }
  },
  "scheduled_dropoff_time": null
}
```

**Response (201 Created):**

```json
[
  {
    "pickup": {
      "venue_id": "699c137d2e4bdf15aeed6768",
      "name": [{ "lang": "de", "value": "Mein Restaurant" }],
      "location": {
        "formatted_address": "Wiedner Hauptstraße 42, 1040 Wien",
        "coordinates": { "lat": 48.1951, "lon": 16.3654 }
      }
    },
    "fee": { "amount": 490, "currency": "EUR" },
    "pre_estimate": {
      "pickup_minutes": 5,
      "delivery_minutes": 20,
      "total_minutes": { "min": 20, "mean": 25, "max": 35 }
    }
  }
]
```

Empty array = no venue can deliver to that location.

### 2.4 Cancel Delivery

```
PATCH /order/{wolt_order_reference_id}/status/cancel
```

**IMPORTANT:** Use the `wolt_order_reference_id` from the delivery response, NOT the delivery `id`.

**Request Body:**

```json
{
  "reason": "Customer cancelled the order"
}
```

**Response (200 OK):**

```json
{
  "status": "REJECTED"
}
```

**Cancellation rules:**
- Can only cancel BEFORE the courier accepts the pickup task
- Use webhook event `order.pickup_started` to know when cancellation window closes
- Cancellation after pickup started returns 400 — must contact Wolt support
- `reason` is required (free-form text, visible in Wolt's system)

### 2.5 Delivery Fee (Venueless)

Alternative to shipment promises when the pickup address is not pre-configured.

```
POST /merchants/{merchant_id}/delivery-fee
```

**Request Body:**

```json
{
  "pickup": {
    "location": {
      "formatted_address": "Wiedner Hauptstraße 42, 1040 Wien",
      "coordinates": { "lat": 48.1951, "lon": 16.3654 }
    }
  },
  "dropoff": {
    "location": {
      "formatted_address": "Stephansplatz 1, 1010 Wien",
      "coordinates": { "lat": 48.2082, "lon": 16.3738 }
    }
  },
  "scheduled_dropoff_time": null,
  "contents": [
    {
      "count": 1,
      "dimensions": { "weight_gram": 1500 },
      "price": { "amount": 2500, "currency": "EUR" }
    }
  ]
}
```

**Response (200 OK):**

```json
{
  "created_at": "2025-01-30T10:00:13.123Z",
  "pickup": {
    "location": {
      "formatted_address": "Wiedner Hauptstraße 42, 1040 Wien",
      "coordinates": { "lat": 48.1951, "lon": 16.3654 }
    }
  },
  "dropoff": {
    "location": {
      "formatted_address": "Stephansplatz 1, 1010 Wien",
      "coordinates": { "lat": 48.2082, "lon": 16.3738 }
    }
  },
  "fee": { "amount": 590, "currency": "EUR" },
  "time_estimate_minutes": 30,
  "scheduled_dropoff_time": null
}
```

**Note:** Delivery fee response does NOT contain an `id` or `valid_until`. It's a stateless estimate. The venueless delivery order does NOT require a prior delivery-fee call (but it's strongly recommended for UX).

### 2.6 Venueless Delivery Order

```
POST /merchants/{merchant_id}/delivery-order
```

**Request Body:**

```json
{
  "pickup": {
    "location": {
      "formatted_address": "Wiedner Hauptstraße 42, 1040 Wien",
      "coordinates": { "lat": 48.1951, "lon": 16.3654 }
    },
    "comment": "Ring at the back door",
    "contact_details": {
      "name": "My Shop",
      "phone_number": "+4312345678",
      "send_tracking_link_sms": false
    },
    "display_name": "My Shop Wien"
  },
  "dropoff": {
    "location": {
      "formatted_address": "Stephansplatz 1, 1010 Wien",
      "coordinates": { "lat": 48.2082, "lon": 16.3738 }
    },
    "comment": "Ring bell 3, 2nd floor",
    "contact_details": {
      "name": "Max Mustermann",
      "phone_number": "+436641234567",
      "send_tracking_link_sms": true
    }
  },
  "customer_support": {
    "email": "support@myshop.at"
  },
  "is_no_contact": false,
  "merchant_order_reference_id": "order_12345",
  "contents": [
    {
      "count": 1,
      "description": "2x Chicken Tikka Masala",
      "identifier": "A1234",
      "tags": [],
      "price": { "amount": 2500, "currency": "EUR" },
      "dimensions": { "weight_gram": 1500 }
    }
  ],
  "min_preparation_time_minutes": 15,
  "order_number": "A1234"
}
```

**Response (201 Created):** Same structure as venueful delivery response but includes full pickup details.

---

## 3. Implementation Guide (Next.js)

### CRITICAL Implementation Rules (DO NOT SKIP)

1. **MUST copy `lib/wolt.ts` EXACTLY as shown** — including ALL type interfaces (`WoltPromise`, `WoltDelivery`). Do NOT use `any` types.
2. **MUST throw errors on failure** — do NOT return `null`. Callers handle errors with try/catch.
3. **MUST include `cancelDelivery()`** function — admin needs it.
4. **MUST check `promise.is_binding`** in checkout UI — if false, delivery is not available for that address.
5. **MUST save `promise.id`** AND `promise.dropoff.location.coordinates` from the promise response — both are needed for `createDelivery`.
6. **MUST debounce** the Wolt promise API call in the checkout form — do NOT fire on every keystroke.
7. **MUST validate `street` and `city`** in `app/api/wolt/promise/route.ts` — return 400 if missing.
8. **MUST use `coordinates` from the promise response** in the delivery request (`dropoff.location.coordinates`). Do NOT pass address strings in `dropoff.location` — the API expects `{coordinates: {lat, lon}}`.
9. **MUST NOT implement radius/distance checks** — no `getDistance()`, no Haversine formula, no km limits. Wolt's `is_binding` field handles delivery area validation.
10. **MUST use Google Places Autocomplete** for the address input in the checkout form. This gives structured address fields + lat/lon. See Section 3.6.
11. **MUST validate phone number is E.164 format** (e.g. `+436641234567`) before saving to DB. Invalid phone numbers cause Wolt 422 errors.
12. **MUST require `post_code`** in both the promise route and dispatch route. Validate `if (!street || !city || !post_code)` → 400. Vienna (and other cities) have duplicate street names across districts — `post_code` disambiguates.
13. **MUST use `locationBias`** on `PlaceAutocompleteElement` centered on venue coordinates. Do NOT use `includedRegionCodes` — customers may be cross-border (e.g. Germany). Address fields MUST be read-only, populated only via Google Places `gmp-select` event — no manual typing allowed.
14. **MUST include `customer_support`** in every `createDelivery()` call — at minimum `{ email: 'support@...' }`. This field is **REQUIRED** by the Wolt API. Omitting it causes a 422 error: `{"detail":[{"type":"missing","loc":["body","customer_support"],"msg":"Field required"}]}`.
15. **MUST include `parcels`** in every `createDelivery()` call — this field is **REQUIRED** by the Wolt API. Omitting it causes a 422 error: `{"detail":[{"type":"missing","loc":["body","parcels"],"msg":"Field required"}]}`. Build parcels from actual order items: `parcels: [{ count: items.length, description: items.map(i => i.quantity + 'x ' + i.name).join(', '), identifier: orderId.slice(-5) }]`.

### Common Mistakes (AVOID THESE)

- ❌ Typing `createDelivery(params: any)` — MUST use the full typed interface shown below
- ❌ Returning `null` on API errors — MUST throw so callers get meaningful error messages
- ❌ Calling Wolt API on every `onChange` event — MUST debounce (300-500ms) or call on blur
- ❌ Ignoring `is_binding` field — if false, the address is outside Wolt's delivery area
- ❌ Not saving `promise.id` and `promise.dropoff.location.coordinates` — both needed for `createDelivery`
- ❌ Passing address strings in `dropoff.location` — Wolt expects `coordinates: {lat, lon}` object, NOT `{address, city, post_code}`
- ❌ Implementing manual radius/distance checks — Wolt handles this via `is_binding`
- ❌ Using plain text inputs for address — use Google Places Autocomplete for structured address + coordinates
- ❌ Accepting phone numbers without E.164 validation — causes Wolt 422 errors
- ❌ Omitting `post_code` from promise/dispatch — causes wrong delivery address when streets have duplicate names across districts
- ❌ Letting users type addresses manually — address fields MUST be read-only, populated only via Google Places `gmp-select`
- ❌ Using `includedRegionCodes` to lock country — use `locationBias` instead (customers may be cross-border)
- ❌ Omitting `parcels` from `createDelivery()` — REQUIRED by Wolt API. Causes 422: `{"detail":[{"type":"missing","loc":["body","parcels"],"msg":"Field required"}]}`. Always include at least `parcels: [{ count: 1, description: 'Order items' }]`.
- ❌ Sending `parcels: [{ count: 1, description: 'Order ' + id }]` — build rich parcels from actual order items (name, weight, price)

### 3.1 Service Layer — `lib/wolt.ts`

This is the core API client. All API routes call these functions. **Copy this EXACTLY — do NOT simplify types or error handling.**

```typescript
// lib/wolt.ts

const WOLT_DRIVE_API_KEY = process.env.WOLT_DRIVE_API_KEY;
const WOLT_DRIVE_VENUE_ID = process.env.WOLT_DRIVE_VENUE_ID;
const WOLT_DRIVE_MERCHANT_ID = process.env.WOLT_DRIVE_MERCHANT_ID;
const BASE_URL = process.env.WOLT_DRIVE_BASE_URL || 'https://daas-public-api.development.dev.woltapi.com';

// --- Types ---

interface WoltPromise {
  id: string;
  created_at: string;
  valid_until: string;
  pickup: {
    venue_id: string;
    location: { coordinates: { lat: number; lon: number }; formatted_address: string };
    eta_minutes: number;
  };
  dropoff: {
    location: { coordinates: { lat: number; lon: number }; formatted_address: string };
    eta_minutes: number;
  };
  price: { amount: number; currency: string };
  is_binding: boolean;
}

interface WoltDelivery {
  id: string;
  status: string;
  tracking: { id: string; url: string };
  wolt_order_reference_id: string;
  merchant_order_reference_id: string;
  pickup: { eta: string };
  dropoff: { eta: string };
  price: { amount: number; currency: string };
}

interface VenuelessDeliveryFee {
  fee: { amount: number; currency: string };
  time_estimate_minutes: number;
}

// --- Shipment Promise (Venueful) ---
// IMPORTANT: Request body uses FLAT top-level fields (street, city, post_code),
// NOT a nested dropoff.location object.

export async function getShipmentPromise(params: {
  street: string;
  city: string;
  post_code: string;
  min_preparation_time_minutes?: number;
  scheduled_dropoff_time?: string;
  parcels?: Array<{
    count: number;
    dimensions?: { weight_gram?: number; width_cm?: number; height_cm?: number; depth_cm?: number };
    price?: { amount: number; currency: string };
  }>;
}): Promise<WoltPromise> {
  if (!WOLT_DRIVE_API_KEY) throw new Error('WOLT_DRIVE_API_KEY is missing');
  if (!WOLT_DRIVE_VENUE_ID) throw new Error('WOLT_DRIVE_VENUE_ID is missing');

  const response = await fetch(
    `${BASE_URL}/v1/venues/${WOLT_DRIVE_VENUE_ID}/shipment-promises`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WOLT_DRIVE_API_KEY}`,
      },
      body: JSON.stringify(params),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Wolt Promise error ${response.status}: ${err}`);
  }

  return response.json();
}

// --- Delivery Fee (Venueless) ---

export async function getVenuelessDeliveryFee(params: {
  pickup: { location: { formatted_address: string; coordinates: { lat: number; lon: number } } };
  dropoff: { location: { formatted_address: string; coordinates: { lat: number; lon: number } } };
  scheduled_dropoff_time?: string;
  contents: Array<{
    count: number;
    dimensions?: { weight_gram?: number };
    price?: { amount: number; currency: string };
  }>;
}): Promise<VenuelessDeliveryFee> {
  if (!WOLT_DRIVE_API_KEY) throw new Error('WOLT_DRIVE_API_KEY is missing');
  if (!WOLT_DRIVE_MERCHANT_ID) throw new Error('WOLT_DRIVE_MERCHANT_ID is missing');

  const response = await fetch(
    `${BASE_URL}/merchants/${WOLT_DRIVE_MERCHANT_ID}/delivery-fee`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WOLT_DRIVE_API_KEY}`,
      },
      body: JSON.stringify(params),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Wolt Venueless Fee error ${response.status}: ${err}`);
  }

  return response.json();
}

// --- Create Delivery (Venueful) ---
// Uses the promise ID + COORDINATES from the promise response.
// The Wolt API expects dropoff.location.coordinates as {lat, lon} — NOT address strings.

export async function createDelivery(params: {
  shipment_promise_id: string;
  merchant_order_reference_id: string;
  order_number?: string;
  recipient: { name: string; phone_number: string; email?: string };
  dropoff: {
    location: {
      coordinates: { lat: number; lon: number };
    };
    comment?: string;
    options?: { is_no_contact?: boolean };
  };
  parcels: Array<{  // REQUIRED by Wolt API — 422 "Field required" if missing
    count: number;
    description?: string;
    identifier?: string;
    dimensions?: { weight_gram?: number; width_cm?: number; height_cm?: number; depth_cm?: number };
    price?: { amount: number; currency: string };
    tags?: string[];
    dropoff_restrictions?: { age_limit?: number; identity_verification?: { name: string } };
  }>;
  customer_support: { email: string; phone_number?: string; url?: string }; // REQUIRED by Wolt API — 422 if missing
  pickup?: { comment?: string };
}): Promise<WoltDelivery> {
  if (!WOLT_DRIVE_API_KEY) throw new Error('WOLT_DRIVE_API_KEY is missing');
  if (!WOLT_DRIVE_VENUE_ID) throw new Error('WOLT_DRIVE_VENUE_ID is missing');

  const response = await fetch(
    `${BASE_URL}/v1/venues/${WOLT_DRIVE_VENUE_ID}/deliveries`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WOLT_DRIVE_API_KEY}`,
      },
      body: JSON.stringify(params),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Wolt Delivery error ${response.status}: ${err}`);
  }

  return response.json();
}

// --- Create Venueless Delivery ---

export async function createVenuelessDelivery(params: {
  pickup: {
    location: { formatted_address: string; coordinates: { lat: number; lon: number } };
    comment?: string;
    contact_details: { name: string; phone_number: string; send_tracking_link_sms?: boolean };
    display_name?: string;
  };
  dropoff: {
    location: { formatted_address: string; coordinates: { lat: number; lon: number } };
    comment?: string;
    contact_details: { name: string; phone_number: string; send_tracking_link_sms?: boolean };
  };
  customer_support: { email: string; phone_number?: string; url?: string };
  is_no_contact?: boolean;
  merchant_order_reference_id: string;
  contents: Array<{
    count: number;
    description?: string;
    identifier?: string;
    tags?: string[];
    price?: { amount: number; currency: string };
    dimensions?: { weight_gram?: number };
  }>;
  min_preparation_time_minutes?: number;
  order_number?: string;
}): Promise<WoltDelivery> {
  if (!WOLT_DRIVE_API_KEY) throw new Error('WOLT_DRIVE_API_KEY is missing');
  if (!WOLT_DRIVE_MERCHANT_ID) throw new Error('WOLT_DRIVE_MERCHANT_ID is missing');

  const response = await fetch(
    `${BASE_URL}/merchants/${WOLT_DRIVE_MERCHANT_ID}/delivery-order`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WOLT_DRIVE_API_KEY}`,
      },
      body: JSON.stringify(params),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Wolt Venueless Delivery error ${response.status}: ${err}`);
  }

  return response.json();
}

// --- Cancel Delivery ---
// Uses wolt_order_reference_id (from delivery response), NOT the delivery id.

export async function cancelDelivery(
  woltOrderReferenceId: string,
  reason: string
): Promise<{ status: string }> {
  if (!WOLT_DRIVE_API_KEY) throw new Error('WOLT_DRIVE_API_KEY is missing');

  const response = await fetch(
    `${BASE_URL}/order/${woltOrderReferenceId}/status/cancel`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WOLT_DRIVE_API_KEY}`,
      },
      body: JSON.stringify({ reason }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Wolt Cancel error ${response.status}: ${err}`);
  }

  return response.json();
}
```

### 3.2 API Route — Get Shipping Cost (`app/api/wolt/promise/route.ts`)

Called from the checkout UI when the user enters their address.

```typescript
// app/api/wolt/promise/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getShipmentPromise } from '@/lib/wolt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Address fields only — no coordinates
    const { street, city, post_code } = body;
    if (!street || !city || !post_code) {
      return NextResponse.json(
        { error: 'street, city, and post_code are required' },
        { status: 400 }
      );
    }

    const promise = await getShipmentPromise({
      street,
      city,
      post_code,
    });

    return NextResponse.json(promise);
  } catch (error: any) {
    console.error('Wolt Promise Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 3.2.2 API Route — Get Venueless Shipping Cost (`app/api/wolt/venueless-fee/route.ts`)

```typescript
// app/api/wolt/venueless-fee/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getVenuelessDeliveryFee } from '@/lib/wolt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pickup, dropoff, contents } = body;

    if (!pickup || !dropoff || !contents) {
      return NextResponse.json({ error: 'pickup, dropoff, and contents are required' }, { status: 400 });
    }

    const fee = await getVenuelessDeliveryFee({
      pickup,
      dropoff,
      contents,
    });

    return NextResponse.json(fee);
  } catch (error: any) {
    console.error('Wolt Venueless Fee Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 3.2.3 Checkout UX Flow (MANDATORY)


The user MUST see the Wolt delivery fee BEFORE they can pay. Follow this exact pattern:

**Rules:**
1. **Debounce** — call `/api/wolt/promise` 500ms after the user stops typing. Do NOT fire on every keystroke.
2. **Fee before payment** — the "Pay" / "Place Order" button MUST be disabled until the delivery fee is displayed.
3. **Check `is_binding`** — if `false`, show "Delivery not available for this address" and keep payment disabled.
4. **Save `promise.id`** in state — pass it to the backend when creating the order (needed for dispatch later).
5. **Re-fetch on any address change** — any change to `street`, `city`, or `postCode` triggers a new debounced promise call.
6. **Show fee + ETA** — display: "Delivery by Wolt: €X.XX, ~Y min" next to the order total.

**Debounce pattern (copy this):**

```typescript
// Inside your CheckoutForm component ('use client')
const debounceRef = useRef<NodeJS.Timeout | null>(null);
const [promiseId, setPromiseId] = useState<string | null>(null);
const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
const [deliveryEta, setDeliveryEta] = useState<number | null>(null);
const [deliveryError, setDeliveryError] = useState<string | null>(null);

function onAddressFieldChange(updatedFormData: typeof formData) {
  setFormData(updatedFormData);
  setDeliveryFee(null);
  setPromiseId(null);
  setDeliveryError(null);

  // Clear previous debounce
  if (debounceRef.current) clearTimeout(debounceRef.current);

  const { address, city, postCode } = updatedFormData;
  if (address.length < 3 || city.length < 2 || postCode.length < 3) return;

  // Debounce 500ms
  debounceRef.current = setTimeout(async () => {
    try {
      const res = await fetch('/api/wolt/promise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ street: address, city, postCode }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setDeliveryError(data.error || 'Failed to check delivery');
        return;
      }

      if (!data.is_binding) {
        setDeliveryError('Delivery not available for this address');
        return;
      }

      setPromiseId(data.id);  // SAVE for createDelivery later
      setDeliveryFee(data.price.amount / 100);
      setDeliveryEta(data.dropoff.eta_minutes);
    } catch {
      setDeliveryError('Could not check delivery availability');
    }
  }, 500);
}

// Disable payment until fee is known:
// <button disabled={!promiseId || !deliveryFee || loading}>Pay</button>
```

**Scheduled delivery selector (add to checkout state + UI):**

```typescript
// State
const [deliveryMode, setDeliveryMode] = useState<'asap' | 'scheduled'>('asap');
const [scheduledTime, setScheduledTime] = useState('');

// Validation: scheduled time must be 60min–7days in future
function isValidScheduledTime(iso: string): boolean {
  const t = new Date(iso).getTime();
  const now = Date.now();
  return t >= now + 60 * 60 * 1000 && t <= now + 7 * 24 * 60 * 60 * 1000;
}
```

```tsx
{/* Delivery mode selector — show after address is entered */}
{deliveryFee !== null && (
  <div className="mt-3">
    <p className="text-sm font-medium mb-2">Delivery time</p>
    <div className="flex gap-2 mb-2">
      <button type="button" onClick={() => setDeliveryMode('asap')}
        className={`px-3 py-1 rounded border text-sm ${deliveryMode === 'asap' ? 'bg-blue-600 text-white' : 'border-zinc-300'}`}>
        ASAP (~{deliveryEta} min)
      </button>
      <button type="button" onClick={() => setDeliveryMode('scheduled')}
        className={`px-3 py-1 rounded border text-sm ${deliveryMode === 'scheduled' ? 'bg-blue-600 text-white' : 'border-zinc-300'}`}>
        Schedule for later
      </button>
    </div>
    {deliveryMode === 'scheduled' && (
      <input
        type="datetime-local"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
        min={new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)}
        max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
        className="w-full border border-zinc-300 rounded px-3 py-2 text-sm"
      />
    )}
  </div>
)}
```

**When the debounce fires the promise call, include scheduled time if set:**

```typescript
// Inside the debounce setTimeout callback, update the body:
body: JSON.stringify({
  street: address,
  city,
  post_code: postCode,
  ...(deliveryMode === 'scheduled' && scheduledTime
    ? { scheduled_dropoff_time: new Date(scheduledTime).toISOString() }
    : {}),
}),
```

**When creating the order, pass scheduled time:**

```typescript
body: JSON.stringify({
  // ...existing fields (customerStreet, customerCity, etc.)
  scheduledDeliveryTime: deliveryMode === 'scheduled' ? new Date(scheduledTime).toISOString() : null,
})
```

**In the order total section, show:**
```tsx
{deliveryError && <p className="text-red-500 text-sm">{deliveryError}</p>}
{deliveryFee !== null && (
  <div className="flex justify-between">
    <span>Delivery (Wolt{deliveryMode === 'scheduled' ? ', scheduled' : `, ~${deliveryEta} min`})</span>
    <span>€{deliveryFee.toFixed(2)}</span>
  </div>
)}
```

### 3.3 API Route — Dispatch Delivery (`app/api/admin/dispatch-wolt/route.ts`)

**IMPORTANT: This is called ONLY from the admin dashboard, NEVER automatically after payment.**
The merchant must manually review the order and click "Dispatch Wolt Courier" in the admin panel.
Do NOT auto-dispatch from Stripe webhooks or order creation routes.

```typescript
// app/api/admin/dispatch-wolt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getShipmentPromise, createDelivery } from '@/lib/wolt';

// E.164 phone validation
function isValidE164(phone: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(phone);
}

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // Load order from DB with items (for rich parcels)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const { customerStreet, customerCity, customerPostCode,
            customerName, customerPhone, dropoffComment,
            scheduledDeliveryTime } = order as any;

    if (!customerStreet || !customerCity || !customerPostCode) {
      return NextResponse.json({ error: 'Order missing address fields (street, city, post_code required)' }, { status: 400 });
    }

    if (customerPhone && !isValidE164(customerPhone)) {
      return NextResponse.json(
        { error: 'Phone must be E.164 format (e.g. +436641234567)' },
        { status: 400 }
      );
    }

    // 1. Get fresh shipment promise (old ones expire)
    //    Include parcels for accurate pricing and scheduled time if set
    const promiseParams: Parameters<typeof getShipmentPromise>[0] = {
      street: customerStreet,
      city: customerCity,
      post_code: customerPostCode,
      parcels: [{
        count: (order as any).items?.length || 1,
        dimensions: {
          weight_gram: ((order as any).items || []).reduce(
            (sum: number, i: any) => sum + (i.quantity || 1) * 500, 0
          ),
        },
        price: { amount: Math.round((order.totalAmount || 0) * 100), currency: 'EUR' },
      }],
    };
    if (scheduledDeliveryTime) {
      promiseParams.scheduled_dropoff_time = scheduledDeliveryTime;
      promiseParams.min_preparation_time_minutes = 15;
    }

    const promise = await getShipmentPromise(promiseParams);

    if (!promise.is_binding) {
      return NextResponse.json(
        { error: 'Address is outside Wolt delivery area' },
        { status: 422 }
      );
    }

    // 2. Build rich parcels from order items
    const itemDescription = ((order as any).items || [])
      .map((i: any) => `${i.quantity}x ${i.product?.name || 'item'}`)
      .join(', ')
      .slice(0, 100);

    // 3. Create delivery — use COORDINATES from promise response (NOT address strings)
    const delivery = await createDelivery({
      shipment_promise_id: promise.id,
      merchant_order_reference_id: orderId,
      order_number: orderId.slice(-5),
      recipient: {
        name: customerName || 'Customer',
        phone_number: customerPhone || '',
      },
      dropoff: {
        location: {
          coordinates: promise.dropoff.location.coordinates,
        },
        comment: dropoffComment,
      },
      parcels: [{
        count: (order as any).items?.length || 1,
        description: itemDescription || 'Order ' + orderId,
        identifier: orderId.slice(-5),
        dimensions: {
          weight_gram: ((order as any).items || []).reduce(
            (sum: number, i: any) => sum + (i.quantity || 1) * 500, 0
          ),
        },
        price: { amount: Math.round((order.totalAmount || 0) * 100), currency: 'EUR' },
      }],
      customer_support: {
        email: process.env.STORE_SUPPORT_EMAIL || 'support@example.com',
        ...(process.env.STORE_SUPPORT_PHONE ? { phone_number: process.env.STORE_SUPPORT_PHONE } : {}),
      },
    });

    // 4. Save tracking info to database
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        woltOrderRefId: delivery.wolt_order_reference_id,
        woltTrackingUrl: delivery.tracking.url,
        deliveryStatus: 'dispatched',
        status: 'DISPATCHED',
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('Dispatch Wolt Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 3.4 API Route — Webhook Receiver (`app/api/wolt/webhook/route.ts`)

Receives delivery status updates from Wolt.

**IMPORTANT:** Webhook events are encoded as JWTs. You must verify using the `client_secret` you provided when registering the webhook. The payload arrives as `{ "token": "<JWT>" }`.

```typescript
// app/api/wolt/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const WOLT_WEBHOOK_SECRET = process.env.WOLT_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    // Decode and verify the JWT
    let payload: any;
    if (WOLT_WEBHOOK_SECRET) {
      payload = jwt.verify(token, WOLT_WEBHOOK_SECRET);
    } else {
      // In dev, decode without verification (NOT for production!)
      payload = jwt.decode(token);
    }

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Common webhook events:
    // order.status_changed, order.pickup_eta_updated, order.dropoff_eta_updated
    // order.pickup_started, order.delivered
    const { type, order } = payload;
    const woltRef = order?.wolt_order_reference_id;

    if (woltRef && order?.status) {
      await prisma.order.updateMany({
        where: { woltOrderRefId: woltRef },
        data: { deliveryStatus: order.status.toLowerCase() },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Wolt Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 3.5 Admin Dashboard — Dispatch Button (`components/DispatchButton.tsx`)

**CRITICAL: Wolt delivery is NEVER dispatched automatically.** The merchant must manually
review each order in the admin dashboard and click a "Dispatch" button.

```tsx
'use client'

import React, { useState } from 'react'

export default function DispatchButton({ orderId, existingDeliveryId }: {
  orderId: string
  existingDeliveryId?: string | null
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [deliveryId, setDeliveryId] = useState(existingDeliveryId)
  const [error, setError] = useState<string | null>(null)

  const handleDispatch = async () => {
    if (!confirm('Dispatch Wolt courier for this order?')) return
    setIsLoading(true)
    setError(null)
    try {
      // Only pass orderId — the API route loads address from DB
      const res = await fetch('/api/admin/dispatch-wolt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (res.ok) {
        setDeliveryId(data.woltOrderRefId)
        window.location.reload()
      } else {
        setError(data.error || 'Dispatch failed')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  if (deliveryId) {
    return <span className="text-green-600 font-bold">Dispatched: {deliveryId}</span>
  }

  return (
    <div>
      <button
        onClick={handleDispatch}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded font-bold disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Dispatch Wolt Courier'}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
```

Use this in the admin orders list:
```tsx
<DispatchButton orderId={order.id} existingDeliveryId={order.woltOrderRefId} />
```

### 3.6 Google Places Address Autocomplete (`components/AddressAutocomplete.tsx`)

**CRITICAL: Copy the `AddressAutocomplete` component below EXACTLY. Do NOT simplify it, do NOT inline Google Maps loading into CheckoutForm, do NOT write your own implementation.**

This gives:
- Structured address components (street, city, post_code, country)
- Lat/lon coordinates (needed for Wolt delivery request)
- Better UX than plain text inputs (typo-free, real addresses)

**Requires:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local` with Places API enabled.

**FORBIDDEN PATTERNS (WILL CRASH AT RUNTIME OR BREAK UX):**
- ❌ `<Script src="...maps.googleapis.com..." onLoad={() => new google.maps.places.PlaceAutocompleteElement()}>` — the Places library is NOT ready in `onLoad`. Causes `Cannot read properties of undefined (reading 'PlaceAutocompleteElement')`.
- ❌ `new (window as any).google.maps.places.PlaceAutocompleteElement()` inside a `<Script onLoad>` — same crash.
- ❌ Adding a `<Script>` tag for Google Maps in `app/layout.tsx` — causes double-loading and Next.js 16 error.
- ❌ `new google.maps.places.Autocomplete(...)` — LEGACY API, triggers `LegacyApiNotActivatedMapError`.
- ❌ `overflow-hidden` on the `AddressAutocomplete` container or ANY ancestor element — **the suggestions dropdown is absolutely-positioned and WILL be clipped; user types but sees no suggestions**. NEVER add `overflow-hidden` or `overflow: hidden` to the container div, its parent `<div>`, or any wrapping `<form>` element.

**CORRECT PATTERN:** Use `google.maps.importLibrary('places')` which returns a Promise that resolves when the Places library is fully loaded. This is the ONLY reliable way to initialize `PlaceAutocompleteElement`. The `AddressAutocomplete` component below implements this correctly — **copy it exactly**.

**IMPORTANT:** This uses the **Places API (New)** with `PlaceAutocompleteElement`.
In Google Cloud Console, enable **"Places API (New)"** — NOT the legacy "Places API".

```tsx
'use client'

import React, { useEffect, useRef, useCallback } from 'react'

export interface AddressResult {
  street: string
  city: string
  postCode: string
  country: string
  lat: number
  lon: number
  formatted: string
}

interface Props {
  onSelect: (address: AddressResult) => void
  placeholder?: string
  className?: string
  /** Bias results toward venue location. Example: { radius: 30000, center: { lat: 48.2082, lng: 16.3738 } } */
  locationBias?: { radius: number; center: { lat: number; lng: number } }
}

// Load Google Maps JS API once globally via callback pattern
// IMPORTANT: Do NOT use `loading=async` without `callback=` — importLibrary won't be available.
// The `callback=` param tells Google Maps to call our function when fully initialized.
let gmapPromise: Promise<void> | null = null

function ensureGoogleMaps(apiKey: string): Promise<void> {
  if (gmapPromise) return gmapPromise
  gmapPromise = new Promise((resolve, reject) => {
    const w = window as any
    w.__gmcb = () => resolve()
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__gmcb&loading=async`
    script.async = true
    script.onerror = () => { gmapPromise = null; reject(new Error('Failed to load Google Maps')) }
    document.head.appendChild(script)
  })
  return gmapPromise
}

async function loadGoogleMaps(apiKey: string): Promise<typeof google.maps.places> {
  await ensureGoogleMaps(apiKey)
  return await (window as any).google.maps.importLibrary('places') as typeof google.maps.places
}

export default function AddressAutocomplete({ onSelect, placeholder, className, locationBias }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const elementRef = useRef<any>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || !containerRef.current || elementRef.current) return

    let cancelled = false

    loadGoogleMaps(apiKey).then(async (places) => {
      if (cancelled || elementRef.current) return

      const ac = new places.PlaceAutocompleteElement({
        types: ['address'],
      })
      // Bias results toward venue location (do NOT use includedRegionCodes — customers may be cross-border)
      if (locationBias) {
        ac.locationBias = locationBias
      }
      if (placeholder) ac.placeholder = placeholder
      elementRef.current = ac

      ac.addEventListener('gmp-select', async (e: any) => {
        const place = e.placePrediction.toPlace()
        await place.fetchFields({
          fields: ['addressComponents', 'formattedAddress', 'location'],
        })

        let street = '', streetNumber = '', city = '', postCode = '', country = ''

        if (place.addressComponents) {
          for (const comp of place.addressComponents) {
            const t = comp.types
            if (t.includes('route')) street = comp.longText || ''
            if (t.includes('street_number')) streetNumber = comp.longText || ''
            if (t.includes('locality')) city = comp.longText || ''
            if (t.includes('postal_code')) postCode = comp.longText || ''
            if (t.includes('country')) country = comp.shortText || ''
          }
        }

        const loc = place.location
        onSelectRef.current({
          street: streetNumber ? `${street} ${streetNumber}` : street,
          city, postCode, country,
          lat: loc?.lat() ?? 0,
          lon: loc?.lng() ?? 0,
          formatted: place.formattedAddress || '',
        })
      })

      containerRef.current?.appendChild(ac as unknown as Node)
    }).catch(console.error)

    return () => { cancelled = true }
  }, [placeholder])

  return (
    <div ref={containerRef} className={className} />
  )
}
```

**CRITICAL CSS WARNING:** NEVER use `overflow-hidden` or `overflow: hidden` on the `AddressAutocomplete` container or any of its ancestors up to the form. The `PlaceAutocompleteElement` renders its suggestions dropdown as an absolutely-positioned element. `overflow-hidden` clips it and the user sees nothing despite API responses returning.

**Usage in CheckoutForm:**

Replace the separate street/city/postCode inputs with a single `AddressAutocomplete`. Address fields are **read-only** — only populated via Google Places selection. This guarantees structured `post_code` + coordinates.

```tsx
import AddressAutocomplete from './AddressAutocomplete'

// In your form state, add:
const [addressData, setAddressData] = useState<{
  street: string; city: string; postCode: string; country: string; lat: number; lon: number
} | null>(null)

// In your JSX, replace the 3 address inputs with:
<AddressAutocomplete
  onSelect={(addr) => {
    setAddressData(addr)
    setFormData({ ...formData, address: addr.street, city: addr.city, postCode: addr.postCode })
  }}
  className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-neon-blue outline-none"
  locationBias={{ radius: 30000, center: { lat: 48.2082, lng: 16.3738 } }}
/>

{/* Show selected address as read-only confirmation (do NOT allow manual editing) */}
{addressData && (
  <div className="text-sm text-zinc-500 mt-1">
    {addressData.street}, {addressData.postCode} {addressData.city}
  </div>
)}

// When creating the order, save structured fields:
body: JSON.stringify({
  customerStreet: addressData?.street,
  customerCity: addressData?.city,
  customerPostCode: addressData?.postCode,
  customerPhone: formData.phone, // must be E.164
  customerName: formData.name,
  scheduledDeliveryTime: deliveryMode === 'scheduled' ? new Date(scheduledTime).toISOString() : null,
  // ...
})
```

**Phone number validation (add to CheckoutForm):**

```tsx
function isValidE164(phone: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(phone);
}

// Before allowing payment:
if (!isValidE164(formData.phone)) {
  setError('Phone must start with + and country code (e.g. +436641234567)')
  return
}
```

---

## 4. Checkout & Dispatch Flow

**IMPORTANT: The checkout and dispatch are TWO SEPARATE flows.**
- The **checkout flow** (customer-facing) collects the address, shows shipping cost, and processes payment.
- The **dispatch flow** (admin-facing) is a manual action in the admin dashboard AFTER reviewing the order.
- **NEVER auto-dispatch** from the checkout or payment webhook. The merchant must always decide when to send the courier.

### 4.1 Checkout Flow (Customer)

```
Customer selects address via Google Places Autocomplete (read-only fields)
  → street, city, post_code, lat, lon populated automatically
        │
        ▼
POST /api/wolt/promise → Wolt API: POST /v1/venues/{id}/shipment-promises
  body: { street, city, post_code, scheduled_dropoff_time? }
        │
        ▼
Check: is_binding === true?
  No → Show "Delivery not available for this address"
  Yes ↓
        │
        ▼
Display: "Delivery by Wolt: €4.90, ~25 min"
Customer selects: ASAP or Scheduled (date/time picker)
Save delivery fee + address + scheduled time to order
        │
        ▼
Customer pays (Stripe, etc.)
        │
        ▼
Order saved to DB with status PAID, deliveryType='wolt',
  scheduledDeliveryTime
Customer sees confirmation page
```

### 4.2 Dispatch Flow (Admin Dashboard)

```
Admin opens dashboard → sees orders with deliveryType='wolt' and status='PAID'
        │
        ▼
Admin clicks "Dispatch Wolt Courier" button on an order
        │
        ▼
POST /api/admin/dispatch-wolt { orderId }
  → Loads order from DB with items (for rich parcels)
  → Gets fresh shipment promise (old one may have expired)
      includes parcels (weight, price) + scheduled_dropoff_time if set
  → Creates delivery with Wolt API using COORDINATES from promise
      includes rich parcels, item descriptions
  → Saves wolt_order_reference_id + tracking.url to DB
  → Updates order status to DISPATCHED
        │
        ▼
Admin sees tracking URL, can share with customer
        │
        ▼
Wolt sends JWT webhook events → POST /api/wolt/webhook
  Decode JWT, update deliveryStatus in DB
```

### Prisma Schema Fields

Add these fields to your Order model:

```prisma
model Order {
  // ... existing fields ...
  customerStreet   String?   // street from Google Places autocomplete
  customerCity     String?   // city from autocomplete
  customerPostCode String?   // post code from autocomplete
  customerPhone    String?   // E.164 format phone number
  customerName     String?   // customer full name
  dropoffComment   String?   // delivery instructions (floor, door code, etc.)
  scheduledDeliveryTime String? // ISO 8601 scheduled dropoff time (null = ASAP)
  woltOrderRefId   String?   // wolt_order_reference_id — for cancel + webhook matching
  woltTrackingUrl  String?   // tracking.url — show to customer
  woltPromiseId    String?   // promise id — for reference
  deliveryStatus   String?   @default("pending")
}
```

After adding: run `npx prisma db push` then `npx prisma generate`.

---

## 5. Testing & Verification

### Quick Verification Script (Python)

Test API connectivity before building the integration:

```python
import requests
import json

BASE_URL = "https://daas-public-api.development.dev.woltapi.com"
TOKEN = "YOUR_STAGING_KEY"
VENUE_ID = "YOUR_VENUE_ID"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
}

# Shipment promise — uses FLAT top-level fields
payload = {
    "street": "Stephansplatz 1",
    "city": "Wien",
    "post_code": "1010"
}

url = f"{BASE_URL}/v1/venues/{VENUE_ID}/shipment-promises"
print(f"POST {url}")
print(f"Body: {json.dumps(payload, indent=2)}")

response = requests.post(url, headers=headers, json=payload, timeout=30)
print(f"\nStatus: {response.status_code}")
print(json.dumps(response.json(), indent=2))

# Check binding
data = response.json()
if data.get("is_binding"):
    print(f"\n✅ BINDING promise — can create delivery")
    print(f"   Promise ID: {data['id']}")
    print(f"   Price: {data['price']['amount']} {data['price']['currency']}")
    print(f"   ETA: {data['dropoff']['eta_minutes']} min")
    print(f"   Dropoff coords: {data['dropoff']['location']['coordinates']}")
else:
    print(f"\n❌ NON-BINDING — address too vague for delivery")
```

### cURL Examples

**Get Shipment Promise:**
```bash
curl -X POST "https://daas-public-api.development.dev.woltapi.com/v1/venues/YOUR_VENUE_ID/shipment-promises" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "street": "Stephansplatz 1",
    "city": "Wien",
    "post_code": "1010"
  }'
```

**Create Delivery (using COORDINATES from promise response):**
```bash
curl -X POST "https://daas-public-api.development.dev.woltapi.com/v1/venues/YOUR_VENUE_ID/deliveries" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "shipment_promise_id": "PROMISE_ID",
    "merchant_order_reference_id": "order_12345",
    "order_number": "A1234",
    "recipient": { "name": "Test User", "phone_number": "+436641234567" },
    "dropoff": {
      "location": { "coordinates": { "lat": 48.2082, "lon": 16.3738 } },
      "comment": "Test delivery"
    },
    "parcels": [{ "count": 1, "description": "Test parcel" }],
    "customer_support": { "email": "test@example.com" }
  }'
```

**Cancel Delivery:**
```bash
curl -X PATCH "https://daas-public-api.development.dev.woltapi.com/order/WOLT_ORDER_REFERENCE_ID/status/cancel" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "reason": "Customer cancelled" }'
```

---

## 6. Common Errors & Troubleshooting

| HTTP Status | Error | Cause | Fix |
|-------------|-------|-------|-----|
| 400 | Bad Request | Missing required fields, non-binding promise used for delivery, or cancellation after pickup | Check request body matches docs exactly |
| 401 | Unauthorized | Invalid or expired Merchant Key | Check `WOLT_DRIVE_API_KEY` in `.env` |
| 404 | Not Found | Invalid `venue_id` or `wolt_order_reference_id` | Verify IDs |
| 422 | Unprocessable | Address outside delivery area or Wolt not operating | Show "Delivery not available" in UI |
| 429 | Too Many Requests | Rate limit exceeded | Back off and retry |
| 500 | Server Error | Wolt API issue | Retry with backoff |

### Tips

- **Price is in smallest currency unit** — `amount: 490` means €4.90. Divide by 100 for display.
- **Promises expire** — Check `valid_until`. Always get a fresh promise if creating delivery later.
- **Always get a promise BEFORE charging** — the promise price is what Wolt will invoice from the merchant.
- **Shipment promise does NOT validate addresses** — it geocodes and "best guesses". Use Google Places Autocomplete for address validation (see Section 3.6).
- **Include parcels for accurate pricing** — Without parcel info, extra fees (oversize, heavy) won't be included in the estimate.
- **`min_preparation_time_minutes`** — Tell Wolt how long you need to prepare. The courier will arrive after this time.
- **Scheduled deliveries** — Set `scheduled_dropoff_time` (ISO 8601) in the promise. Must be 60 min to 7 days in the future.
- **ASAP deliveries** — Do NOT include `scheduled_dropoff_time` in the request. Targets < 1 hour delivery.
- **ETA is initially a rough estimate** — After delivery creation, wait ~90 seconds for the first optimized ETA via webhook `order.pickup_eta_updated`.
- **Webhooks are JWTs** — The payload is `{ "token": "<JWT>" }`. Decode with the `client_secret` you provided during webhook registration.
- **`order_number`** — Keep ≤5 chars. Shown to courier. Falls back to `merchant_order_reference_id`.
- **No-contact delivery** — Set `dropoff.options.is_no_contact: true`.
- **ID verification** — For alcohol etc, set `parcels[].dropoff_restrictions.id_check_required: true` and `tags: ["alcohol"]`.
- **Order modifications** — Cannot modify after creation. Cancel and recreate with a new `merchant_order_reference_id`.
- **Rate limits** — HTTP 429 if too frequent. Back off and retry.
- **Allow unknown keys** — Wolt may add new response fields without a new API version.
- **Courier tipping** — The Wolt API supports a `tips` field in the delivery request, but tipping is **not supported for all merchant payment methods** (e.g. invoice billing returns `TIP_NOT_ALLOWED`). This integration does NOT include tipping. If needed in the future, add `tips: [{ type: "pre_delivery_courier_tip", price: { amount: 200, currency: "EUR" } }]` to the delivery request and handle `TIP_NOT_ALLOWED` errors gracefully.
- **Rich parcels improve courier experience** — Include `description` (item names), `identifier` (short order ref), `dimensions.weight_gram`, and `price` in parcels. The courier sees `description` and `identifier`. Including `price` and `dimensions` enables accurate delivery pricing including extra fees for heavy/oversize items.
- **Address accuracy** — ALWAYS send `street` + `city` + `post_code` for binding promises. Use Google Places Autocomplete with `locationBias` (NOT `includedRegionCodes`) to get structured address data. Make address fields read-only — populated only via autocomplete selection.

---

## 7. Webhook Events

Register webhooks via Wolt's webhook CRUD endpoints (one per merchant, covers all venues).

**Event format:** `{ "token": "<JWT>" }`

Decode the JWT with the `client_secret` you provided during registration.

**Key event types:**

| Event | Description |
|-------|-------------|
| `order.status_changed` | Order status updated (INFO_RECEIVED → PICKUP_STARTED → etc.) |
| `order.pickup_eta_updated` | Optimized pickup ETA available (~90s after creation) |
| `order.dropoff_eta_updated` | Updated delivery ETA |
| `order.pickup_started` | Courier accepted and is heading to pickup — cancellation no longer possible |
| `order.delivered` | Order delivered successfully |
| `order.handshake_delivery.pin_generated` | Handshake PIN created (if enabled) |

---

## 8. Delivery Status Lifecycle

```
INFO_RECEIVED → PICKUP_STARTED → DROPOFF_STARTED → DELIVERED
                                                   └→ REJECTED (cancelled)
```

| Status | Meaning |
|--------|---------|
| `INFO_RECEIVED` | Order created, courier being assigned (optimization runs every 30-60s) |
| `PICKUP_STARTED` | Courier heading to pickup — **cancellation no longer possible via API** |
| `DROPOFF_STARTED` | Courier picked up order, heading to customer |
| `DELIVERED` | Order delivered successfully |
| `REJECTED` | Order was cancelled (status returned by cancel endpoint) |

---

## 9. File Structure

When implementing Wolt Drive in a Next.js project, create these files:

```
lib/
  wolt.ts                          # Service layer (API client)
components/
  AddressAutocomplete.tsx          # Google Places address autocomplete
  CheckoutForm.tsx                 # Checkout with address autocomplete + Wolt delivery
  DispatchButton.tsx               # Admin dispatch button
app/api/
  wolt/
    promise/route.ts               # Get shipping cost (venueful checkout)
    venueless-fee/route.ts         # Get shipping cost (venueless checkout)
    webhook/route.ts               # Receive status updates (JWT)
  admin/
    dispatch-wolt/route.ts         # Dispatch courier (admin panel)
    cancel-wolt/route.ts           # Cancel delivery (admin panel)
```

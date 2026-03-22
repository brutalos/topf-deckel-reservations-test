---
name: stripe-integration
description: Implement Stripe payment processing in Next.js/TypeScript projects. Covers Stripe Checkout (redirect), Stripe Elements (embedded PaymentElement), webhooks, and admin refunds. All code is TypeScript for Next.js App Router.
---

# Stripe Integration (Next.js / TypeScript)

Complete reference for integrating Stripe payments into Next.js App Router projects. Covers two payment flows:
1. **Stripe Checkout** (redirect to Stripe-hosted page) — simplest, fastest
2. **Stripe Elements** (embedded PaymentElement in your UI) — custom look, no redirect

Both flows use the `stripe` npm package (server-side) and `@stripe/react-stripe-js` + `@stripe/stripe-js` (client-side). These packages are pre-installed in the project template.

---

## CRITICAL Implementation Rules (DO NOT SKIP)

1. **MUST use the `stripe` npm package** on the server — do NOT use raw `fetch` to `api.stripe.com`. The SDK handles auth, retries, types, and error classes.
2. **MUST use `@stripe/react-stripe-js`** on the client for Stripe Elements — do NOT create fake placeholder divs or mock card inputs.
3. **MUST verify webhook signatures** — do NOT trust unverified webhook payloads.
4. **MUST use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** for the client (starts with `pk_`) and `STRIPE_SECRET_KEY` for the server (starts with `sk_`).
5. **MUST handle payment confirmation properly** — Stripe Checkout uses redirect, Elements uses `stripe.confirmPayment()`.
6. **Amounts are in cents** — €10.00 = 1000. ALWAYS multiply by 100 before sending to Stripe.
7. **NEVER create fake card input divs** — if you need card input, use `<PaymentElement />` from `@stripe/react-stripe-js`.

## Common Mistakes (AVOID THESE)

- ❌ Creating a `<div>Generic Stripe Element Placeholder</div>` — MUST use real `<PaymentElement />`
- ❌ Using raw `fetch('https://api.stripe.com/v1/...')` — MUST use `stripe` npm package
- ❌ Creating a PaymentIntent but never calling `stripe.confirmPayment()` on the frontend
- ❌ Forgetting `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env` — Elements won't load
- ❌ Not wrapping the checkout form in `<Elements>` provider — PaymentElement crashes without it
- ❌ Putting Stripe Elements in a Server Component — MUST be in a `'use client'` component

---

## 1. Environment Setup

### Required Environment Variables

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

- `STRIPE_SECRET_KEY` — server-side only (API routes). NEVER expose to client.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — client-side (Stripe.js init). Safe to expose.
- `STRIPE_WEBHOOK_SECRET` — for verifying webhook signatures. Get from Stripe Dashboard → Webhooks.

---

## 2. Server-Side: `lib/stripe.ts`

**Copy this EXACTLY. This is the shared Stripe instance for all API routes.**

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});
```

---

## 3. Payment Flow A: Stripe Checkout (Redirect)

Best for: simple e-commerce, one-time payments, subscriptions. User is redirected to Stripe's hosted page.

### 3A.1 API Route — Create Checkout Session

```typescript
// app/api/checkout/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { items, orderId, customerEmail } = await req.json();

    if (!items || !items.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Build line items from cart
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/cart`,
      customer_email: customerEmail || undefined,
      metadata: {
        order_id: orderId || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout session error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 3A.2 Frontend — Redirect to Checkout

```typescript
// Inside your checkout component ('use client')
async function handleCheckout() {
  setLoading(true);
  try {
    const res = await fetch('/api/checkout/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
        orderId: order?.id,
        customerEmail: formData.email,
      }),
    });
    const data = await res.json();

    if (data.url) {
      window.location.href = data.url; // Redirect to Stripe
    } else {
      alert(data.error || 'Payment failed');
    }
  } catch (err) {
    alert('Payment failed');
  } finally {
    setLoading(false);
  }
}
```

### 3A.3 Success Page

```typescript
// app/checkout/success/page.tsx (Server Component)
export default function CheckoutSuccess() {
  return (
    <div className="max-w-lg mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-600">Thank you for your order. You will receive a confirmation email shortly.</p>
    </div>
  );
}
```

---

## 4. Payment Flow B: Stripe Elements (Embedded)

Best for: custom checkout UI where you want the card input embedded in your page (no redirect).

### 4B.1 API Route — Create Payment Intent

```typescript
// app/api/checkout/intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'eur', metadata = {} } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Payment intent error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 4B.2 Stripe Provider Component

**MUST wrap your checkout page with this provider. PaymentElement won't work without it.**

```typescript
// components/StripeProvider.tsx
'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeProviderProps {
  clientSecret: string;
  children: ReactNode;
}

export default function StripeProvider({ clientSecret, children }: StripeProviderProps) {
  // CRITICAL: Don't mount Elements until clientSecret is a real PaymentIntent secret.
  // Passing dummy/placeholder values causes IntegrationError immediately.
  if (!clientSecret || !clientSecret.includes('_secret_')) {
    return null;
  }
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0a0a0a',
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
```

### 4B.3 Payment Form with PaymentElement

**This is a `'use client'` component. Copy EXACTLY — do NOT replace PaymentElement with a div.**

```typescript
// components/StripePaymentForm.tsx
'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface StripePaymentFormProps {
  onSuccess?: () => void;
  returnUrl?: string;
}

export default function StripePaymentForm({ onSuccess, returnUrl }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl || `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setLoading(false);
    } else {
      // Payment succeeded without redirect (e.g. some card payments)
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
```

### 4B.4 Checkout Page — Putting It Together

```typescript
// components/CheckoutWithElements.tsx
'use client';

import { useState, useEffect } from 'react';
import StripeProvider from '@/components/StripeProvider';
import StripePaymentForm from '@/components/StripePaymentForm';

export default function CheckoutWithElements({ amount }: { amount: number }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create PaymentIntent on mount
    fetch('/api/checkout/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || 'Failed to initialize payment');
        }
      })
      .catch(() => setError('Failed to initialize payment'));
  }, [amount]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!clientSecret) return <p className="text-gray-500">Loading payment...</p>;

  return (
    <StripeProvider clientSecret={clientSecret}>
      <StripePaymentForm />
    </StripeProvider>
  );
}
```

Then in the server component page:

```typescript
// app/checkout/page.tsx (Server Component — just renders the client component)
import CheckoutWithElements from '@/components/CheckoutWithElements';

export default function CheckoutPage() {
  return (
    <div className="max-w-lg mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <CheckoutWithElements amount={49.99} />
    </div>
  );
}
```

---

## 5. Stripe Connect (Marketplaces & Split Payments)

Best for: Platforms where users buy from third-party vendors (e.g., Food Delivery or Franchised Store Platforms). Stripe Connect solves the problem of receiving customer funds and instantly routing the right percentage to the vendor's bank account, while keeping a platform fee (like a delivery cost markup).

### 5.1 Create a Connected Account (Vendor Onboarding)
When adding a new franchisee/vendor, you create a Stripe Connect Account (Standard or Express) and generate an onboarding link:

```typescript
// 1. Create a blank Express/Standard account shell
const account = await stripe.accounts.create({ type: 'standard' });

// 2. Generate a secure onboarding link 
const accountLink = await stripe.accountLinks.create({
  account: account.id, // e.g., acct_1XYZ...
  refresh_url: 'https://your-domain.com/reauth',
  return_url: 'https://your-domain.com/success',
  type: 'account_onboarding',
});
// Redirect the user to `accountLink.url` directly!
```

### 5.2 Split Payments & Delivery Fees (Destination Charges)
When a customer checks out, the backend calculates the complete total (food cost + customer-facing delivery fee). 
If the store is franchised, you use `transfer_data` in the `PaymentIntent` payload to send the funds directly to their Stripe Connect `stripeAccountId`.

**Important Delivery Fee Logic (Topf-Deckel Example):**
In `topf-deckel`, the platform subsidizes 50% of the Wolt delivery fee for the customer. To ensure the platform has enough to pay the external full Wolt invoice, it takes the remaining 50% out of the franchisee's profit margin utilizing the `application_fee_amount`:

```typescript
// In app/api/checkout/session/route.ts
const paymentIntentPayload: any = {
  amount: amountInCents, // e.g., Food €20.00 + Delivery €2.50 = €22.50
  currency: 'eur',
  automatic_payment_methods: { enabled: true },
  metadata: { storeId: store.id }
};

// Inject the Stripe Connect routing dynamically if this store is franchised
if (store.stripeAccountId) {
  paymentIntentPayload.transfer_data = {
    destination: store.stripeAccountId, // Send funds directly to franchisee
  };
  
  // Platform keeps 100% of the actual Wolt delivery fee to pay the external invoice.
  // Since the UI only charges the customer 50% (deliveryFeeInCents), we multiply by 2 
  // so the remaining 50% is taken out of the franchisee's food sales instead.
  if (deliveryInfo?.mode === 'delivery' && deliveryInfo.deliveryFeeInCents) {
    paymentIntentPayload.application_fee_amount = deliveryInfo.deliveryFeeInCents * 2;
  }
}

const paymentIntent = await stripe.paymentIntents.create(paymentIntentPayload);
```
*Note: Stripe handles the routing math instantly upon successful payment. The vendor sees the transaction minus your application fee.*

---

## 6. Webhook Handler

**MUST verify signatures. MUST handle idempotently.**

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // Update order status in database
      console.log('Checkout completed:', session.id, 'Order:', session.metadata?.order_id);
      // await prisma.order.update({ where: { id: session.metadata?.order_id }, data: { status: 'PAID' } });
      break;
    }

    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', intent.id);
      // Update order, send confirmation email, etc.
      break;
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.error('Payment failed:', intent.id, intent.last_payment_error?.message);
      break;
    }

    default:
      console.log('Unhandled webhook event:', event.type);
  }

  return NextResponse.json({ received: true });
}
```

**IMPORTANT:** Next.js App Router reads the body as a stream. Use `req.text()` (NOT `req.json()`) for webhook signature verification — Stripe needs the raw body string.

---

## 7. Which Flow to Choose

| Criteria | Stripe Checkout (Redirect) | Stripe Elements (Embedded) |
|---|---|---|
| **Implementation time** | ~30 min | ~1 hour |
| **UI customization** | Limited (Stripe's hosted page) | Full control |
| **PCI compliance** | Automatic | Automatic (Stripe.js handles it) |
| **Mobile UX** | Good (Stripe optimizes it) | Great (stays in your app) |
| **Best for** | Simple shops, MVPs | Custom checkout experiences |

**Default recommendation:** Use **Stripe Checkout (redirect)** for e-commerce shops unless the user specifically asks for embedded payment or custom checkout UI.

---

## 8. Testing

### Test Card Numbers
| Card | Behavior |
|---|---|
| `4242424242424242` | Success |
| `4000000000000002` | Declined |
| `4000002500003155` | Requires 3D Secure |
| `4000000000009995` | Insufficient funds |

Use any future expiry date (e.g. 12/34) and any 3-digit CVC.

---

## 9. Best Practices

1. **Always use webhooks** — don't rely solely on client-side confirmation
2. **Verify webhook signatures** — never trust unverified payloads
3. **Use metadata** — link Stripe objects to your database records
4. **Amounts in cents** — €10.00 = 1000
5. **Handle errors gracefully** — show user-friendly messages, log details server-side
6. **SCA ready** — `automatic_payment_methods: { enabled: true }` handles 3D Secure automatically
7. **Idempotency** — webhook events may be delivered multiple times, handle them idempotently

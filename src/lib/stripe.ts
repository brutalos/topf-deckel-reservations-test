import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'sk_test_placeholder';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'development') {
    console.warn('⚠️ STRIPE_SECRET_KEY is missing in env!');
}

export const stripe = new Stripe(key, {
    httpClient: Stripe.createFetchHttpClient(), // required for Cloudflare Workers
});

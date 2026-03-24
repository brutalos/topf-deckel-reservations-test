#!/usr/bin/env node
/**
 * Generates a Stripe Connect onboarding link directly via the Stripe API.
 *
 * Usage:
 *   node stripe-onboarding.mjs                          — creates new account (no email)
 *   node stripe-onboarding.mjs vendor@email.com         — creates new account, pre-fills email
 *   node stripe-onboarding.mjs --account acct_xxx       — refreshes link for existing account
 */

const STRIPE_SECRET_KEY = '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';
const RETURN_URL  = 'https://topfdeckel.at/admin/stripe/return';
const REFRESH_URL = 'https://topfdeckel.at/admin/stripe/refresh';

// Parse args: node script.mjs [--account acct_xxx] [email]
const args = process.argv.slice(2);
let existingAccountId = null;
let email = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--account' && args[i + 1]) {
    existingAccountId = args[++i];
  } else {
    email = args[i];
  }
}

async function stripePost(path, params) {
  const body = new URLSearchParams(params).toString();
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type':  'application/x-www-form-urlencoded',
    },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || JSON.stringify(json));
  return json;
}

(async () => {
  let accountId = existingAccountId;

  if (accountId) {
    // Reuse existing account — just refresh the link
    console.log(`Refreshing onboarding link for existing account: ${accountId}`);
  } else {
    // Create a brand-new Express connected account
    console.log('Creating production Connect account' + (email ? ` for ${email}` : '') + '...');
    const accountParams = {
      type:                                    'express',
      country:                                 'AT',
      'capabilities[card_payments][requested]': 'true',
      'capabilities[transfers][requested]':    'true',
    };
    if (email) accountParams.email = email;

    const account = await stripePost('/accounts', accountParams);
    accountId = account.id;
    console.log('✅ Account created:', accountId);
  }

  // Create the Account Link (expires in ~5 min)
  const link = await stripePost('/account_links', {
    account:     accountId,
    refresh_url: REFRESH_URL,
    return_url:  RETURN_URL,
    type:        'account_onboarding',
  });

  console.log('\n🔗 Onboarding URL (valid ~5 minutes):');
  console.log(link.url);
  console.log('\nAccount ID (save this for future use):', accountId);
  console.log('Expires at:', new Date(link.expires_at * 1000).toISOString());
})().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

import { NextResponse } from 'next/server';

const WOLT_BASE_URL = process.env.WOLT_ENV === 'production'
    ? 'https://daas-public-api.wolt.com'
    : 'https://daas-public-api.development.dev.woltapi.com';

const isProduction = process.env.WOLT_ENV === 'production';
const WOLT_MERCHANT_ID = isProduction ? process.env.MX : process.env.MX_STAGING;
const WOLT_API_KEY = isProduction ? process.env.API : process.env.WOLT_STAGING_API;
const WEBHOOK_SECRET = process.env.WOLT_WEBHOOK_SECRET;

const woltHeaders = () => ({
    'Authorization': `Bearer ${WOLT_API_KEY}`,
    'Content-Type': 'application/json',
});

/**
 * GET /api/admin/register-webhook
 * Lists all registered Wolt webhooks for the merchant.
 */
export async function GET() {
    if (!WOLT_MERCHANT_ID || !WOLT_API_KEY) {
        return NextResponse.json({ error: 'Missing Wolt credentials' }, { status: 500 });
    }
    const res = await fetch(`${WOLT_BASE_URL}/v1/merchants/${WOLT_MERCHANT_ID}/webhooks`, {
        headers: woltHeaders(),
    });
    const data = await res.json();
    return NextResponse.json(data);
}

/**
 * POST /api/admin/register-webhook
 * Registers (or re-registers) the Wolt webhook for the merchant.
 * Body: { "publicUrl": "https://your-domain.com" }
 */
export async function POST(req: Request) {
    if (!WOLT_MERCHANT_ID || !WOLT_API_KEY) {
        return NextResponse.json({ error: 'Missing WOLT API credentials (MX/MX_STAGING, API/WOLT_STAGING_API) in env' }, { status: 500 });
    }

    if (!WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Missing WOLT_WEBHOOK_SECRET in env' }, { status: 500 });
    }

    const { publicUrl } = await req.json().catch(() => ({}));
    const callbackUrl = publicUrl
        ? `${publicUrl}/api/webhooks/wolt`
        : `${process.env.PUBLIC_URL || ''}/api/webhooks/wolt`;

    if (!callbackUrl || callbackUrl.includes('localhost')) {
        return NextResponse.json({
            error: 'localhost is not reachable by Wolt. Deploy first and provide the public URL.',
            hint: 'Pass { "publicUrl": "https://your-domain.com" } in the request body.',
        }, { status: 400 });
    }

    try {
        // Check for existing webhook to avoid duplicates
        const listRes = await fetch(`${WOLT_BASE_URL}/v1/merchants/${WOLT_MERCHANT_ID}/webhooks`, {
            headers: woltHeaders(),
        });
        const existing: any[] = listRes.ok ? await listRes.json() : [];

        const alreadyRegistered = Array.isArray(existing) &&
            existing.some((w: any) => w.callback_url === callbackUrl && !w.disabled);

        if (alreadyRegistered) {
            return NextResponse.json({ status: 'already_registered', callbackUrl });
        }

        // Register the webhook
        const regRes = await fetch(`${WOLT_BASE_URL}/v1/merchants/${WOLT_MERCHANT_ID}/webhooks`, {
            method: 'POST',
            headers: woltHeaders(),
            body: JSON.stringify({
                callback_url: callbackUrl,
                client_secret: WEBHOOK_SECRET,
                disabled: false,
                callback_config: { exponential_retry_backoff: { exponent_base: 5, max_retry_count: 3 } },
            }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
            console.error('[Wolt Webhook Registration] Failed:', regData);
            return NextResponse.json({ error: 'Wolt registration failed', detail: regData }, { status: regRes.status });
        }

        console.log(`[Wolt Webhook] Registered ✓ ID: ${regData.id} → ${callbackUrl}`);
        return NextResponse.json({ status: 'registered', id: regData.id, callbackUrl });
    } catch (err: any) {
        console.error('[Wolt Webhook Registration] Error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/register-webhook
 * Removes a webhook by ID or all webhooks whose URL contains a pattern.
 * Body: { "webhookId": "abc123" }  OR  { "urlContains": "ngrok" }
 */
export async function DELETE(req: Request) {
    if (!WOLT_MERCHANT_ID || !WOLT_API_KEY) {
        return NextResponse.json({ error: 'Missing Wolt credentials' }, { status: 500 });
    }

    const { webhookId, urlContains } = await req.json().catch(() => ({}));

    if (!webhookId && !urlContains) {
        return NextResponse.json({ error: 'Provide webhookId or urlContains' }, { status: 400 });
    }

    const listRes = await fetch(`${WOLT_BASE_URL}/v1/merchants/${WOLT_MERCHANT_ID}/webhooks`, {
        headers: woltHeaders(),
    });
    const webhooks: any[] = await listRes.json();

    const toDelete = webhookId
        ? webhooks.filter(w => w.id === webhookId)
        : webhooks.filter(w => w.callback_url?.includes(urlContains));

    if (toDelete.length === 0) {
        return NextResponse.json({ status: 'nothing_to_delete', registered: webhooks.map(w => ({ id: w.id, url: w.callback_url })) });
    }

    const results = await Promise.all(toDelete.map(async w => {
        const delRes = await fetch(`${WOLT_BASE_URL}/v1/merchants/${WOLT_MERCHANT_ID}/webhooks/${w.id}`, {
            method: 'DELETE',
            headers: woltHeaders(),
        });
        console.log(`[Wolt Webhook] Deleted ${w.id} → ${w.callback_url} (${delRes.status})`);
        return { id: w.id, url: w.callback_url, status: delRes.status };
    }));

    return NextResponse.json({ deleted: results });
}

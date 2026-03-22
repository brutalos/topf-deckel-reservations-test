import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// KV key format: "{YYYY-MM-DD}:{storeId}:{itemName}" — sold-out status scoped to day + store.
// 36-hour TTL ensures day-old entries auto-expire without manual cleanup.
const TTL = 129_600; // 36 hours

function todayPrefix(): string {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

async function getKV(): Promise<any | null> {
    // Force in-memory fallback for local dev to prevent SQLite errors from the local Cloudflare emulator
    if (process.env.NODE_ENV === 'development') {
        return null;
    }
    try {
        const { env } = await getCloudflareContext({ async: true });
        return (env as any).STOCK_KV ?? null;
    } catch {
        return null; // local dev — use in-memory fallback
    }
}

// In-memory fallback for local dev
const g = globalThis as typeof globalThis & { __soldOut?: Set<string> };
if (!g.__soldOut) g.__soldOut = new Set<string>();

/** Returns today's sold-out item names for a specific store. */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('storeId') || 'default';
    const prefix = `${todayPrefix()}:${storeId}:`;

    const kv = await getKV();
    if (kv) {
        const { keys } = await kv.list({ prefix, limit: 200 });
        const soldOut = (keys as { name: string }[]).map(k => k.name.slice(prefix.length));
        return NextResponse.json({ soldOut });
    }

    // In-memory fallback
    const soldOut = Array.from(g.__soldOut!)
        .filter(k => k.startsWith(prefix))
        .map(k => k.slice(prefix.length));
    return NextResponse.json({ soldOut });
}

/** Receives { name, sold, storeId } and stores scoped to today + store. */
export async function PUT(req: Request) {
    const { name, sold, storeId = 'default' } = await req.json();
    if (!name || typeof sold !== 'boolean') {
        return NextResponse.json({ error: 'Missing name or sold' }, { status: 400 });
    }

    const today = todayPrefix();
    const key = `${today}:${storeId}:${name}`;
    const prefix = `${today}:${storeId}:`;

    const kv = await getKV();
    if (kv) {
        if (sold) {
            await kv.put(key, '1', { expirationTtl: TTL });
        } else {
            await kv.delete(key);
        }
        const { keys } = await kv.list({ prefix, limit: 200 });
        const soldOut = (keys as { name: string }[]).map(k => k.name.slice(prefix.length));
        console.log(`🥘 Stock [${today}][${storeId}]: "${name}" → ${sold ? '❌ AUSVERKAUFT' : '✅ Verfügbar'}`);
        return NextResponse.json({ soldOut });
    }

    // In-memory fallback
    if (sold) {
        g.__soldOut!.add(key);
    } else {
        g.__soldOut!.delete(key);
    }
    // Purge past-day entries
    for (const k of Array.from(g.__soldOut!)) {
        if (!k.startsWith(today)) g.__soldOut!.delete(k);
    }
    console.log(`🥘 Stock [${today}][${storeId}]: "${name}" → ${sold ? '❌ AUSVERKAUFT' : '✅ Verfügbar'}`);
    const todayStoreItems = Array.from(g.__soldOut!)
        .filter(k => k.startsWith(prefix))
        .map(k => k.slice(prefix.length));
    return NextResponse.json({ soldOut: todayStoreItems });
}

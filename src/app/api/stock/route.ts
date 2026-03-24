import { NextResponse } from 'next/server';

// Sold-out status is scoped to today + store using an in-memory Set.
// Keys: "{YYYY-MM-DD}:{storeId}:{itemName}"
// This resets on server restart — acceptable since sold-out is a daily manual toggle.

function todayPrefix(): string {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

const g = globalThis as typeof globalThis & { __soldOut?: Set<string> };
if (!g.__soldOut) g.__soldOut = new Set<string>();

/** Returns today's sold-out item names for a specific store. */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('storeId') || 'default';
    const prefix = `${todayPrefix()}:${storeId}:`;

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

    if (sold) {
        g.__soldOut!.add(key);
    } else {
        g.__soldOut!.delete(key);
    }

    // Purge past-day entries to avoid unbounded growth
    for (const k of Array.from(g.__soldOut!)) {
        if (!k.startsWith(today)) g.__soldOut!.delete(k);
    }

    console.log(`🥘 Stock [${today}][${storeId}]: "${name}" → ${sold ? '❌ AUSVERKAUFT' : '✅ Verfügbar'}`);

    const todayStoreItems = Array.from(g.__soldOut!)
        .filter(k => k.startsWith(prefix))
        .map(k => k.slice(prefix.length));

    return NextResponse.json({ soldOut: todayStoreItems });
}

/**
 * In-Memory Rate Limiting utility to protect API endpoints from bot spam.
 * Stores counts securely in RAM. Automatically prunes expired records.
 */

type RateLimitInfo = { count: number; expiresAt: number };

const rateLimitCache = new Map<string, RateLimitInfo>();
const CLEANUP_INTERVAL = 60000; // 1 minute
let lastCleanup = Date.now();

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    context: string;
}

export function checkRateLimit(ip: string, limits: RateLimitConfig): { success: boolean } {
    const now = Date.now();
    const key = `${limits.context}:${ip}`;

    // Occasional garbage collection of the memory Map to prevent RAM leaks
    if (now - lastCleanup > CLEANUP_INTERVAL) {
        lastCleanup = now;
        for (const [k, v] of rateLimitCache.entries()) {
            if (now > v.expiresAt) rateLimitCache.delete(k);
        }
    }

    const currentRecord = rateLimitCache.get(key);

    if (currentRecord && now < currentRecord.expiresAt) {
        if (currentRecord.count >= limits.maxRequests) {
            return { success: false }; // Rate limit exceeded
        }
        currentRecord.count += 1;
        rateLimitCache.set(key, currentRecord);
    } else {
        // First request, or previous window expired
        rateLimitCache.set(key, { count: 1, expiresAt: now + limits.windowMs });
    }

    return { success: true };
}

// NextJS helper to securely extract client IP from headers
export function getClientIp(req: Request): string {
    return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        req.headers.get('x-real-ip') ||
        '127.0.0.1';
}

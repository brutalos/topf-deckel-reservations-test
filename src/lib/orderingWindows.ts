/**
 * Ordering window logic for Topf & Deckel.
 * All times are calculated in Europe/Vienna timezone.
 *
 * Business hours: Mon–Fri 11:00–15:00
 * Peak (courier blocked pickup): 12:00–13:00
 * ASAP windows:   10:45→11:45  and  13:00→14:45
 * Pre-order slots: 11:00→12:15  and  13:30→15:00
 */

/** Get hour*60+min for a Date in Vienna local time */
export function getViennaMinutes(d: Date): number {
    // 'sv' locale gives "YYYY-MM-DD HH:MM:SS" in local time
    const local = d.toLocaleString('sv', { timeZone: 'Europe/Vienna' });
    const [, time] = local.split(' ');
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

/** Get Vienna local weekday: 0=Sun, 1=Mon…6=Sat */
export function getViennaDay(d: Date): number {
    return new Date(
        d.toLocaleString('en-US', { timeZone: 'Europe/Vienna' })
    ).getDay();
}

/** Is a date a weekday (Mon–Fri) in Vienna timezone? */
export function isViennaWeekday(d: Date): boolean {
    const day = getViennaDay(d);
    return day >= 1 && day <= 5;
}

// ── Constants (minutes from midnight) ─────────────────────────────────────────
const ASAP_START = 11 * 60;               // 11:00
const PEAK_START_NO_ASAP = 11 * 60 + 45;  // 11:45 — ASAP cutoff before peak
const ASAP_RESUME = 13 * 60;              // 13:00 — ASAP resumes (store approval ready)
const ASAP_END = 14 * 60 + 45;            // 14:45 — last ASAP (courier arrives by 15:00)

const PREORDER_OPEN = 11 * 60;            // 11:00
const PREORDER_MORNING_END = 12 * 60 + 15; // 12:15
const PREORDER_AFTERNOON_START = 13 * 60 + 30; // 13:30
const STORE_CLOSE = 15 * 60;             // 15:00

const MIN_ADVANCE_MINUTES = 60; // Wolt requires at least 1 hour advance for pre-orders

/** Can the user place an ASAP delivery right now? */
export function canOrderASAP(now: Date): boolean {
    if (!isViennaWeekday(now)) return false;
    const m = getViennaMinutes(now);
    return (m >= ASAP_START && m < PEAK_START_NO_ASAP) ||
        (m >= ASAP_RESUME && m < ASAP_END);
}

/**
 * Human-readable reason why ASAP is unavailable.
 * Returns null if ASAP is available.
 */
export function asapBlockReason(now: Date): string | null {
    if (canOrderASAP(now)) return null;
    if (!isViennaWeekday(now)) return 'Heute geschlossen — Mo–Fr 11:00–15:00 Uhr';
    const m = getViennaMinutes(now);
    if (m < ASAP_START)
        return 'Bestellungen möglich ab 11:00 Uhr';
    if (m >= PEAK_START_NO_ASAP && m < ASAP_RESUME)
        return `Stoßzeit — ASAP ab 13:00 Uhr wieder verfügbar`;
    if (m >= ASAP_END)
        return 'Heute keine ASAP-Lieferungen mehr — morgen ab 11:00 Uhr';
    return null; // should not happen
}

/**
 * Validate a chosen pre-order datetime.
 * Returns { valid: true } or { valid: false, error: "..." }
 */
export function isValidPreorderSlot(
    dt: Date,
    now: Date
): { valid: boolean; error?: string } {
    // 1. Must not be in the past
    if (dt <= now) {
        return { valid: false, error: 'Diese Uhrzeit liegt in der Vergangenheit' };
    }

    // 2. Must be a weekday
    if (!isViennaWeekday(dt)) {
        return { valid: false, error: 'Lieferung nur Mo–Fr möglich' };
    }

    // 2. Must be within business hours
    const m = getViennaMinutes(dt);
    if (m < PREORDER_OPEN || m >= STORE_CLOSE) {
        return { valid: false, error: 'Lieferzeit bitte zwischen 11:00 und 15:00 Uhr wählen' };
    }

    // 3. Must not be in the blocked peak window (most specific reason)
    if (m >= PREORDER_MORNING_END && m < PREORDER_AFTERNOON_START) {
        return {
            valid: false,
            error: 'Stoßzeit 12:15–13:30 — bitte 11:00–12:15 oder 13:30–15:00 Uhr wählen',
        };
    }

    // 4. Must be far enough in the future
    const minTime = new Date(now.getTime() + MIN_ADVANCE_MINUTES * 60 * 1000);
    if (dt < minTime) {
        return {
            valid: false,
            error: `Zu kurzfristig — bitte mindestens ${MIN_ADVANCE_MINUTES} Min. im Voraus wählen`,
        };
    }

    return { valid: true };
}

/**
 * Format a Date to "YYYY-MM-DDTHH:MM" in Vienna local time
 * for use as input[min] / input[max] values.
 */
export function toViennaInputValue(d: Date): string {
    return d.toLocaleString('sv', { timeZone: 'Europe/Vienna' })
        .replace(' ', 'T')
        .slice(0, 16);
}

/** Add business days to a date (skipping weekends) */
function addBusinessDays(d: Date, n: number): Date {
    const result = new Date(d);
    let added = 0;
    while (added < n) {
        result.setDate(result.getDate() + 1);
        const day = getViennaDay(result);
        if (day >= 1 && day <= 5) added++;
    }
    return result;
}

/**
 * Get min/max values for the datetime-local pre-order input.
 * If menuDate (YYYY-MM-DD) is provided, locks the picker to that day only.
 */
export function getPreorderConstraints(
    now: Date,
    menuDate?: string   // e.g. "2026-03-17" — locks picker to this date
): {
    minDatetime: string;
    maxDatetime: string;
} {
    if (menuDate) {
        // Locked to one specific date — keep the blocked-window logic
        const minM = getViennaMinutes(now);
        const nowDateStr = now.toLocaleString('sv', { timeZone: 'Europe/Vienna' }).split(' ')[0];
        const isToday = nowDateStr === menuDate;

        let minSlot: string;
        if (isToday) {
            // Start from now+30min, rounded up to next 15-min, but respect blocks
            const rawM = minM + MIN_ADVANCE_MINUTES;
            const rounded = Math.ceil(rawM / 15) * 15;
            if (rounded < PREORDER_OPEN) {
                minSlot = '11:00';
            } else if (rounded >= PREORDER_MORNING_END && rounded < PREORDER_AFTERNOON_START) {
                minSlot = '13:30';
            } else if (rounded >= STORE_CLOSE) {
                // No slots left today — still return today's max so the input shows correctly
                minSlot = '14:45';
            } else {
                const h = String(Math.floor(rounded / 60)).padStart(2, '0');
                const m = String(rounded % 60).padStart(2, '0');
                minSlot = `${h}:${m}`;
            }
        } else {
            // Future date — always start at 11:00
            minSlot = '11:00';
        }

        return {
            minDatetime: `${menuDate}T${minSlot}`,
            maxDatetime: `${menuDate}T14:45`,
        };
    }

    // No date lock — original multi-day behaviour (fallback)
    const minRaw = new Date(now.getTime() + MIN_ADVANCE_MINUTES * 60 * 1000);
    const minM = getViennaMinutes(minRaw);
    const viennaStr = minRaw.toLocaleString('sv', { timeZone: 'Europe/Vienna' });
    const [dateStr] = viennaStr.split(' ');

    let minLocal: Date;
    if (!isViennaWeekday(minRaw) || minM >= STORE_CLOSE) {
        let next = new Date(minRaw);
        next.setDate(next.getDate() + 1);
        while (!isViennaWeekday(next)) next.setDate(next.getDate() + 1);
        const nextStr = next.toLocaleString('sv', { timeZone: 'Europe/Vienna' }).split(' ')[0];
        minLocal = new Date(`${nextStr}T11:00`);
    } else if (minM < PREORDER_OPEN) {
        minLocal = new Date(`${dateStr}T11:00`);
    } else if (minM >= PREORDER_MORNING_END && minM < PREORDER_AFTERNOON_START) {
        minLocal = new Date(`${dateStr}T13:30`);
    } else {
        const rounded = Math.ceil(minM / 15) * 15;
        const rH = String(Math.floor(rounded / 60)).padStart(2, '0');
        const rM = String(rounded % 60).padStart(2, '0');
        minLocal = new Date(`${dateStr}T${rH}:${rM}`);
    }

    const maxDate = addBusinessDays(now, 5);
    const maxStr = maxDate.toLocaleString('sv', { timeZone: 'Europe/Vienna' }).split(' ')[0];
    const maxLocal = new Date(`${maxStr}T14:45`);

    return {
        minDatetime: toViennaInputValue(minLocal),
        maxDatetime: toViennaInputValue(maxLocal),
    };
}

/** Is it currently the high-traffic peak hour (12:00 - 13:00) on a weekday? */
export function isPeakHourCheckoutBlocked(now: Date): boolean {
    if (!isViennaWeekday(now)) return false;
    const m = getViennaMinutes(now);
    return m >= 12 * 60 && m < 13 * 60;
}

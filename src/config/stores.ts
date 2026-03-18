export interface StoreConfig {
    id: string;
    name: string;
    address: string;
    woltVenueId: string;
    stripeAccountId?: string;
    lat: number;
    lon: number;
    openTime: number; // e.g. 11 for 11:00 AM
    closeTime: number; // e.g. 15 for 3:00 PM
}

// In staging, Wolt provides a single test venue for all stores.
// In production, each store has its own venue ID.
const isStaging = process.env.WOLT_ENV === 'staging';
const stagingVenueId = process.env.VX_STAGING || '';

function venueId(productionKey: string): string {
    return isStaging ? stagingVenueId : (process.env[productionKey] || '');
}

export const stores: StoreConfig[] = [
    {
        id: 'judengasse',
        name: 'Topf & Deckel - Judengasse',
        address: 'Judengasse 1, 1010 Wien',
        woltVenueId: venueId('VX_JUDENGASSE'),
        stripeAccountId: 'acct_1TCJiPRRO3MQisvB', // Sandbox connected account for testing
        lat: 48.211117,
        lon: 16.373054,
        openTime: 11,
        closeTime: 15,
    },
    {
        id: 'schottengasse',
        name: 'Topf & Deckel - Schottengasse',
        address: 'Schottengasse 3, 1010 Wien',
        woltVenueId: venueId('VX_Schottengasse'),
        stripeAccountId: 'acct_1TCJiPRRO3MQisvB',
        lat: 48.213257,
        lon: 16.363952,
        openTime: 11,
        closeTime: 15,
    },
    {
        id: 'wipplingerstrasse',
        name: 'Topf & Deckel - Wipplingerstraße',
        address: 'Wipplingerstraße 22, 1010 Wien',
        woltVenueId: venueId('VX_Wipplingerstraße'),
        stripeAccountId: 'acct_1TCJiPRRO3MQisvB',
        lat: 48.21345,
        lon: 16.36873,
        openTime: 11,
        closeTime: 15,
    },
    {
        id: 'vorgarten',
        name: 'Topf & Deckel - Vorgartenstraße',
        address: 'Vorgartenstraße 206B, 1020 Wien',
        woltVenueId: venueId('VX_VORGARTEN'),
        stripeAccountId: 'acct_1TCJiPRRO3MQisvB',
        lat: 48.22301,
        lon: 16.40223,
        openTime: 11,
        closeTime: 15,
    },
    {
        id: 'esterhazygasse',
        name: 'Topf & Deckel - Esterházygasse (Gumpendorfer)',
        address: 'Gumpendorfer Straße 66, 1060 Wien',
        woltVenueId: venueId('VX_Esterhazygasse'),
        stripeAccountId: 'acct_1TCJiPRRO3MQisvB',
        lat: 48.19702,
        lon: 16.35339,
        openTime: 11,
        closeTime: 15,
    },
];

// Returns distance in km between two lat/lon points using the Haversine formula
export function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

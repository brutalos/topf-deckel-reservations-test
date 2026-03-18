// src/lib/wolt.ts
export interface Coordinates {
    lat: number;
    lon: number;
}

export interface DeliveryAddress {
    formatted_street_address: string;
    city: string;
}

export interface WoltShipmentPromiseRequest {
    street: string;
    city: string;
    post_code?: string;
    lat?: number;
    lon?: number;
    min_preparation_time_minutes?: number;
    scheduled_dropoff_time?: string;
    parcels?: Array<{
        count: number;
        price: { amount: number; currency: string };
        dimensions?: { weight_gram: number };
    }>;
}

export interface WoltDeliveryRequest {
    pickup: {
        comment: string;
    };
    dropoff: {
        location: Coordinates;
        comment?: string;
        options?: {
            is_no_contact: boolean;
            scheduled_time?: string;
        };
    };
    recipient: {
        name: string;
        phone_number: string;
        email?: string;
    };
    customer_support: {
        url?: string;
        email: string;
        phone_number: string;
    };
    merchant_order_reference_id: string;
    order_number: string;
    shipment_promise_id: string;
    parcels: Array<{
        count: number;
        description: string;
        identifier: string;
        price: { amount: number; currency: string };
        dimensions?: { weight_gram: number };
        tags?: string[];
        dropoff_restrictions?: { id_check_required: boolean };
    }>;
}

const WOLT_BASE_URL = process.env.WOLT_ENV === 'production'
    ? 'https://daas-public-api.wolt.com/v1/venues'
    : 'https://daas-public-api.development.dev.woltapi.com/v1/venues';

// Use production API key only when WOLT_ENV=production, otherwise staging
const WOLT_API_KEY = process.env.WOLT_ENV === 'production'
    ? process.env.API
    : process.env.WOLT_STAGING_API;

async function woltFetch(endpoint: string, options: RequestInit = {}) {
    if (!WOLT_API_KEY) throw new Error('WOLT_API_KEY (API) is not defined in env');

    const url = `${WOLT_BASE_URL}${endpoint}`;

    // Log the payload being sent to Wolt for debugging
    if (options.body) {
        console.log(`\n→ Sending Wolt API Request to ${url}`);
        console.log(JSON.stringify(JSON.parse(options.body as string), null, 2));
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${WOLT_API_KEY}`,
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Wolt API Error ${response.status}: ${errorBody}`);
    }

    return response.json();
}

/**
 * Gets a shipment promise (fee & ETA) for a Venueful integration.
 */
export async function getShipmentPromise(venueId: string, req: WoltShipmentPromiseRequest) {
    return woltFetch(`/${venueId}/shipment-promises`, {
        method: 'POST',
        body: JSON.stringify(req),
    });
}

/**
 * Creates a real Delivery Order for a Venueful integration.
 * Triggered manually via the Kitchen Dashboard.
 */
export async function createDelivery(venueId: string, req: WoltDeliveryRequest) {
    return woltFetch(`/${venueId}/deliveries`, {
        method: 'POST',
        body: JSON.stringify(req),
    });
}

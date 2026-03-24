import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { stores } from '@/config/stores';
import { PRICING, komboMocks } from '@/lib/menuFetcher';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        if (!checkRateLimit(ip, { maxRequests: 10, windowMs: 60000, context: 'checkout' }).success) {
            return NextResponse.json({ error: 'Too many checkout attempts. Try again in 1 minute.' }, { status: 429 });
        }

        const { items, storeId, deliveryInfo } = await req.json();
        console.log(`\n[Checkout Session] 🛒 Initializing checkout for storeId: ${storeId}`);
        console.log(`[Checkout Session] 📦 Items:`, JSON.stringify(items, null, 2));
        console.log(`[Checkout Session] 🚚 Delivery Info:`, JSON.stringify(deliveryInfo, null, 2));

        if (!items || !items.length) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        const store = stores.find(s => s.id === storeId);
        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 400 });
        }

        // Securely calculate order total from server-side source of truth
        let amountInCents = items.reduce((acc: number, item: any) => {
            let truePrice = 0;
            if (item.id.startsWith('kombo-')) {
                // Handle static or historically dynamic kombo IDs
                const baseId = item.id.replace(/-[a-f0-9\-]{36}$/, '');
                const komboMatch = komboMocks.find(k => k.id === item.id || k.id.startsWith(baseId) || k.name === item.name);
                if (komboMatch) {
                    truePrice = (komboMatch.prices as any)[item.selectedSize] || 0;
                }
            } else {
                // Standard items follow dayKey-actualType-uuid pattern
                const parts = item.id.split('-');
                if (parts.length >= 2) {
                    const actualType = parts[1];
                    const priceConfig = PRICING[actualType];
                    if (priceConfig && priceConfig.prices) {
                        truePrice = (priceConfig.prices as any)[item.selectedSize] || 0;
                    }
                }
            }

            // Fallback for edge cases (e.g., legacy IDs) -- but flag security warnings
            if (!truePrice || truePrice <= 0) {
                console.warn(`[Security Warning] Invalid or missing server price for item ID: ${item.id}. Falling back to client payload price.`);
                truePrice = item.prices ? (item.prices[item.selectedSize] || 0) : 0;
            }

            return acc + Math.round(truePrice * 100) * (item.qty || 1);
        }, 0);

        if (deliveryInfo?.mode === 'delivery' && deliveryInfo.deliveryFeeInCents) {
            amountInCents += deliveryInfo.deliveryFeeInCents;
            console.log(`[Checkout Session] 💶 Added delivery fee: ${deliveryInfo.deliveryFeeInCents} cents`);
        }

        console.log(`[Checkout Session] 💰 Total amount calculated: ${amountInCents} cents (€${(amountInCents / 100).toFixed(2)})`);

        const paymentIntentPayload: any = {
            amount: amountInCents,
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                storeId,
                // We stringify essential order details into metadata to retrieve later during the webhook for Wolt dispatch
                orderDetails: JSON.stringify(
                    items.map((i: any) => ({
                        id: i.id,
                        name: i.name,
                        size: i.selectedSize,
                        price: i.prices[i.selectedSize],
                    }))
                ).slice(0, 500), // Stripe metadata has a 500 char length limit per key
                // Delivery info from the user
                customerName: deliveryInfo?.name || '',
                customerPhone: deliveryInfo?.phone || '',
                customerAddress: deliveryInfo?.address || '',
                deliveryTime: deliveryInfo?.time || 'ASAP',
                deliveryFeeInCents: deliveryInfo?.deliveryFeeInCents?.toString() || '0',
                deliveryEta: deliveryInfo?.deliveryEta?.toString() || '',
                promiseId: deliveryInfo?.promiseId || '',
                scheduledDropoffTime: deliveryInfo?.scheduledTime || '',
                noContact: deliveryInfo?.noContact ? 'true' : 'false',
                deliveryNote: (deliveryInfo?.note || '').slice(0, 500),
            },
        };

        // Inject the Stripe Connect routing dynamically if this store is franchised
        if (store.stripeAccountId) {
            paymentIntentPayload.transfer_data = {
                destination: store.stripeAccountId,
            };
            // Platform keeps 100% of the actual Wolt delivery fee to pay the invoice! 
            // Since the customer UI is now hard-locked to 50% (deliveryFeeInCents), we multiply by 2 
            // so the remaining 50% is safely taken out of the franchisee's food profit margin instead.
            if (deliveryInfo?.mode === 'delivery' && deliveryInfo.deliveryFeeInCents) {
                paymentIntentPayload.application_fee_amount = deliveryInfo.deliveryFeeInCents * 2;
            }
        }

        console.log(`[Checkout Session] ⏳ Creating Stripe PaymentIntent with payload...`);
        const paymentIntent = await stripe.paymentIntents.create(paymentIntentPayload);
        console.log(`[Checkout Session] ✅ Successfully created PaymentIntent: ${paymentIntent.id} (status: ${paymentIntent.status})`);

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        console.error('Error creating PaymentIntent:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

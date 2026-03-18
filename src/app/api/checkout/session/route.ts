import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { stores } from '@/config/stores';

export async function POST(req: Request) {
    try {
        const { items, storeId, deliveryInfo } = await req.json();

        if (!items || !items.length) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        const store = stores.find(s => s.id === storeId);
        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 400 });
        }

        // Calculate order total
        let amountInCents = items.reduce((acc: number, item: any) => {
            return acc + Math.round((item.prices[item.selectedSize] || 0) * 100) * (item.qty || 1);
        }, 0);

        if (deliveryInfo?.mode === 'delivery' && deliveryInfo.deliveryFeeInCents) {
            amountInCents += deliveryInfo.deliveryFeeInCents;
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'eur',
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
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
        });

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

'use client';


import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { stores } from '@/config/stores';
interface Order {
    id: string;
    status: string;
    order_number: string;
    customerName: string;
    eta: number | null;
    eta_iso: string | null;
    pickup_eta: number | null;
    tracking_url: string | null;
    canCancel: boolean;
    scheduled_dropoff_time?: string | null;
    orderDetails?: { name: string; qty: number; size?: string; price?: number }[];
    amount?: number;
}

type Step = 'received' | 'picked-up' | 'delivered';

function getStepInfo(status: string): { step: Step; progress: number; text: string } {
    switch (status) {
        case 'received':
            return { step: 'received', progress: 25, text: 'Deine Bestellung wird vorbereitet' };
        case 'wolt_dispatched':
        case 'order.received':
            return { step: 'received', progress: 33, text: 'Kurier wird zugewiesen...' };
        case 'order.pickup_started':
        case 'order.pickup_arrival':
            return { step: 'picked-up', progress: 50, text: 'Courier ist unterwegs zur Abholung' };
        case 'order.picked_up':
        case 'picked-up':
            return { step: 'picked-up', progress: 65, text: 'Der Wolt-Courier hat dein Essen abgeholt!' };
        case 'order.dropoff_started':
            return { step: 'picked-up', progress: 80, text: '🚴 Kurier ist auf dem Weg zu dir!' };
        case 'order.dropoff_arrival':
            return { step: 'picked-up', progress: 92, text: '📍 Kurier ist fast da!' };
        case 'order.dropoff_completed':
        case 'order.delivered':
        case 'delivered':
            return { step: 'delivered', progress: 100, text: 'An Guadn! Dein Essen ist da. 🎉' };
        case 'cancelled':
        case 'order.rejected':
            return { step: 'received', progress: 0, text: 'Bestellung storniert.' };
        default:
            return { step: 'received', progress: 25, text: 'Bestellung eingegangen' };
    }
}

export default function SuccessPage({ params, searchParams }: {
    params: Promise<{ storeId: string }>;
    searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>;
}) {
    const { storeId } = use(params);
    const { payment_intent } = use(searchParams);
    const store = stores.find(s => s.id === storeId);

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // On mount: call the confirm endpoint as a fallback to create the order
    // even if the Stripe webhook hasn't been received yet.
    useEffect(() => {
        if (!payment_intent) return;
        fetch('/api/checkout/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId: payment_intent }),
        }).catch(() => { /* silent — webhook may handle it instead */ });
    }, [payment_intent]);

    // Poll order status every 3 seconds
    useEffect(() => {
        if (!payment_intent) { setLoading(false); return; }

        const poll = async () => {
            try {
                const res = await fetch(`/api/admin/orders/${payment_intent}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                    setLoading(false);
                }
            } catch { }
        };

        poll();
        const interval = setInterval(poll, 3000);
        return () => clearInterval(interval);
    }, [payment_intent]);

    const stepInfo = order ? getStepInfo(order.status) : { step: 'received' as Step, progress: 10, text: 'Bestellung wird verarbeitet...' };
    const isCancelled = order?.status === 'cancelled';
    const isDelivered = order?.status === 'order.delivered' || order?.status === 'delivered';

    // Format ETA as clock time
    const etaDisplay = (() => {
        if (!mounted || !order) return null;
        if (isDelivered || isCancelled) return null;

        // If Wolt has provided a live datetime (e.g. after dispatch), use it
        if (order.eta_iso) {
            const t = new Date(order.eta_iso);
            return `Ankunft um ${t.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })} Uhr`;
        }

        // For pre-orders without a live ETA, hide this entirely to avoid showing an incorrect "Date.now() + duration" estimation.
        if (order.scheduled_dropoff_time) {
            return null;
        }

        // For ASAP orders, fall back to the initial promised duration from order placement
        if (order.eta != null) {
            const t = new Date(Date.now() + order.eta * 60000);
            return `Ankunft um ${t.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })} Uhr`;
        }
        return null;
    })();

    const handleCancel = async () => {
        if (!order || !confirm('Möchtest du deine Bestellung wirklich stornieren?')) return;
        try {
            const res = await fetch(`/api/admin/orders/${order.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: 'Cancelled by customer' }),
            });
            if (res.status === 409) {
                alert('Stornierung nicht mehr möglich — der Kurier hat bereits die Abholung gestartet.');
                return;
            }
            const data = await res.json();
            if (data.success) {
                setOrder({ ...order, status: 'cancelled', canCancel: false });
            } else {
                alert(data.error || 'Stornierung fehlgeschlagen.');
            }
        } catch {
            alert('Netzwerkfehler bei Stornierung.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            fontFamily: "'Inter', -apple-system, sans-serif",
        }}>
            <div style={{ maxWidth: 600, width: '100%', textAlign: 'center', padding: '2rem' }}>
                {/* Logo */}
                <img
                    src="/images/squarespace/dc8d1fa4-c438-415b-9193-ec3ecbfcd796_topf-deckel-stadtkantine.png"
                    alt="Topf & Deckel"
                    className="h-[80px] md:h-[168px] w-auto mx-auto object-contain"
                    style={{ marginBottom: '2rem' }}
                />

                {/* Status Text */}
                <h1 style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#1a1a1a',
                    margin: '0 0 0.5rem',
                    lineHeight: 1.3,
                }}>
                    {loading ? 'Bestellung wird verarbeitet...' : stepInfo.text}
                </h1>

                {/* ETA */}
                {etaDisplay && (
                    <div style={{
                        margin: '1rem 0',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: '#6CB78E',
                    }}>
                        {etaDisplay}
                    </div>
                )}

                {/* Order ID & Number */}
                <span style={{
                    fontSize: '0.9rem',
                    opacity: 0.5,
                    marginBottom: '2rem',
                    display: 'block',
                }}>
                    {order ? `Bestell-Nr: #${order.order_number} · ${order.id}` : payment_intent ? `Zahlung: ${payment_intent}` : ''}
                </span>

                {/* Scheduled delivery label */}
                {order?.scheduled_dropoff_time && mounted && (
                    <div style={{
                        margin: '0.5rem 0 1rem',
                        fontSize: '0.9rem',
                        color: '#6CB78E',
                        fontWeight: 700,
                    }}>
                        Geplante Lieferung: {new Date(order.scheduled_dropoff_time).toLocaleString('de-AT', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} Uhr
                    </div>
                )}

                {/* Progress Bar */}
                <div style={{
                    height: 8,
                    background: '#eee',
                    borderRadius: 4,
                    margin: '2rem 0',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        background: isCancelled ? '#e74c3c' : '#6CB78E',
                        width: `${stepInfo.progress}%`,
                        transition: 'width 1s ease',
                        borderRadius: 4,
                    }} />
                </div>

                {/* Step Labels */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#bbb',
                }}>
                    <span style={{ color: stepInfo.progress >= 25 && !isCancelled ? '#6CB78E' : undefined }}>Eingegangen</span>
                    <span style={{ color: stepInfo.progress >= 50 && !isCancelled ? '#6CB78E' : undefined }}>Abgeholt</span>
                    <span style={{ color: stepInfo.progress >= 100 && !isCancelled ? '#6CB78E' : undefined }}>Geliefert</span>
                </div>

                {/* Action Buttons */}
                <div style={{
                    marginTop: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    alignItems: 'center',
                }}>
                    {/* Wolt Live Tracking Button */}
                    {order?.tracking_url && !isCancelled && (
                        <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                background: '#6CB78E',
                                color: '#fff',
                                padding: '12px 24px',
                                borderRadius: 8,
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                display: 'inline-block',
                            }}
                        >
                            🚴 Live auf Wolt verfolgen
                        </a>
                    )}

                    {/* Cancel Button */}
                    {order?.canCancel && !isCancelled && !isDelivered && (
                        <button
                            onClick={handleCancel}
                            style={{
                                background: '#fff',
                                color: '#e74c3c',
                                border: '2px solid #e74c3c',
                                padding: '10px 24px',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                            }}
                        >
                            Bestellung stornieren
                        </button>
                    )}

                    {/* Cancel not possible message */}
                    {order && !order.canCancel && !isCancelled && !isDelivered && (
                        <small style={{ color: '#e74c3c' }}>
                            ⚠ Stornierung nicht mehr möglich — Courier hat Abholung gestartet.
                        </small>
                    )}

                    {/* Delivered message */}
                    {isDelivered && (
                        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6CB78E' }}>
                            ✅ Guten Appetit!
                        </p>
                    )}

                    <p style={{ marginTop: '1rem', color: '#666' }}>
                        Freu dich auf dein ehrliches Essen!
                    </p>
                    <Link
                        href={`/${storeId}`}
                        style={{ color: '#6CB78E', textDecoration: 'none', fontWeight: 700 }}
                    >
                        ← Zurück zum Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}

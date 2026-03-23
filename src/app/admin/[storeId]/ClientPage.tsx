'use client';



import { useState, useEffect, useRef, use } from 'react';
import { stores } from '@/config/stores';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bell, Truck, XCircle, CheckCircle, AlertTriangle, Package, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
type OrderStatus = 'received' | 'wolt_dispatched' | 'order.pickup_started' | 'order.delivered' | 'cancelled' | string;

interface OrderItem {
    id?: string;
    name: string;
    size?: string;
    qty: number;
    price?: number;
}

interface Order {
    id: string;
    storeId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    deliveryTime: string;
    amount: number;
    status: OrderStatus;
    order_number: string;
    orderDetails: OrderItem[];
    createdAt: string;
    tracking_url?: string | null;
    wolt_delivery_id?: string | null;
    promiseId?: string;
    eta?: number | null;
    pickup_eta?: number | null;
    canCancel?: boolean;
}

export default function AdminDashboard({ storeId, menuData, adminKey }: { storeId: string, menuData: any[], adminKey: string }) {
    const store = stores.find((s) => s.id === storeId);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isDispatching, setIsDispatching] = useState<string | null>(null);
    const [soldOut, setSoldOut] = useState<Set<string>>(new Set());
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
    const [mounted, setMounted] = useState(false);
    const prevOrderCountRef = useRef(0);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Unlock AudioContext on every user interaction — browser autoplay policy
    // requires gesture-triggered resume; we reset the flag each click to avoid drift.
    useEffect(() => {
        const unlock = () => {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                setSoundEnabled(true);
            }
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume().catch(() => { });
            }
        };
        document.addEventListener('click', unlock);
        document.addEventListener('touchstart', unlock);
        return () => {
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
        };
    }, []);

    // Today's menu items only (no kombos, no other days)
    const todayISO = new Date().toISOString().split('T')[0];
    const uniqueMenuNames = Array.from(
        new Set(
            (menuData as any[])
                .filter(m => {
                    if (m.komboOptions) return false;
                    if (!m.category || m.category === 'Tageskarte') return false;
                    return m.category.includes(todayISO);
                })
                .map(m => m.name)
        )
    );

    // Load sold-out state from API on mount
    useEffect(() => {
        fetch(`/api/stock?storeId=${storeId}`, { headers: { 'Authorization': `Bearer ${adminKey}` } })
            .then(r => r.json())
            .then(data => setSoldOut(new Set(data.soldOut || [])))
            .catch(() => { });
    }, [storeId, adminKey]);

    // Poll orders every 5 seconds
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`/api/admin/orders?storeId=${storeId}`, {
                    headers: { 'Authorization': `Bearer ${adminKey}` }
                });
                if (!res.ok) {
                    if (res.status === 401) console.error('[Admin Dashboard] Polling failed: 401 Unauthorized (Invalid API Key)');
                    return;
                }
                const data: Order[] = await res.json();
                setOrders(data);
                setLastRefresh(new Date());

                // Play sound for new orders
                if (data.length > prevOrderCountRef.current) {
                    playNotificationSound();
                }
                prevOrderCountRef.current = data.length;
            } catch { }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 3000); // 3s — fast enough without hammering KV
        return () => clearInterval(interval);
    }, [storeId]);

    const playNotificationSound = async () => {
        try {
            const ctx = audioCtxRef.current;
            if (!ctx) return; // not yet unlocked — user hasn't clicked yet
            if (ctx.state === 'suspended') await ctx.resume();

            [0, 0.25].forEach(delay => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
                gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.4);
                osc.start(ctx.currentTime + delay);
                osc.stop(ctx.currentTime + delay + 0.4);
            });
        } catch { }
    };

    const toggleSoldOut = async (name: string) => {
        const isSoldOut = soldOut.has(name);
        const newSold = !isSoldOut;
        setSoldOut(prev => {
            const next = new Set(prev);
            if (newSold) next.add(name); else next.delete(name);
            return next;
        });
        try {
            await fetch('/api/stock', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminKey}` },
                body: JSON.stringify({ name, sold: newSold, storeId }),
            });
        } catch {
            setSoldOut(prev => {
                const next = new Set(prev);
                if (isSoldOut) next.add(name); else next.delete(name);
                return next;
            });
            toast.error('Fehler beim Aktualisieren des Lagerbestands.');
        }
    };

    const handleDispatchWolt = async (order: Order) => {
        setIsDispatching(order.id);
        try {
            const res = await fetch('/api/wolt/delivery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminKey}` },
                body: JSON.stringify({
                    orderId: order.id,
                    storeId,
                    customerName: order.customerName,
                    customerPhone: order.customerPhone,
                    customerAddress: order.customerAddress,
                    promiseId: order.promiseId,
                    orderDetails: order.orderDetails,
                    scheduledDropoffTime: (order as any).scheduledDropoffTime || null,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success('Wolt Kurier erfolgreich gerufen!');
            setOrders(prev => prev.map(o => o.id === order.id ? {
                ...o, status: 'wolt_dispatched', tracking_url: data.woltTrackingUrl, wolt_delivery_id: data.woltDeliveryId
            } : o));
        } catch (err: any) {
            toast.error(`Fehler: ${err.message}`);
        }
        setIsDispatching(null);
    };

    const handleCancelOrder = async (order: Order) => {
        if (!confirm(`Bestellung #${order.order_number} wirklich stornieren?`)) return;
        try {
            const res = await fetch(`/api/admin/orders/${order.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminKey}` },
                body: JSON.stringify({ reason: 'Cancelled by kitchen' }),
            });
            if (res.status === 409) {
                toast.error('Stornierung nicht möglich — Kurier hat Abholung bereits gestartet.');
                return;
            }
            const data = await res.json();
            if (data.success) {
                setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'cancelled', canCancel: false } : o));
                toast.info('Bestellung storniert.');
            } else {
                toast.error(data.error || 'Stornierung fehlgeschlagen.');
            }
        } catch {
            toast.error('Netzwerkfehler bei Stornierung.');
        }
    };

    if (!store) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <p className="text-slate-500 text-lg">Store nicht gefunden.</p>
        </div>
    );

    const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        received: { label: 'Eingegangen', color: 'bg-blue-50 text-blue-700 border border-blue-200', icon: <Package className="w-3 h-3" /> },
        wolt_dispatched: { label: 'Kurier unterwegs', color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: <Truck className="w-3 h-3" /> },
        'order.pickup_started': { label: 'Abgeholt', color: 'bg-orange-50 text-orange-700 border border-orange-200', icon: <Truck className="w-3 h-3" /> },
        'order.delivered': { label: 'Geliefert', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
        cancelled: { label: 'Storniert', color: 'bg-red-50 text-red-600 border border-red-200', icon: <XCircle className="w-3 h-3" /> },
    };

    const getStatusConfig = (status: string) =>
        statusConfig[status] ?? { label: status, color: 'bg-slate-100 text-slate-600', icon: <Package className="w-3 h-3" /> };

    const activeOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'order.delivered');
    const newOrders = orders.filter(o => o.status === 'received');

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">

            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 rounded-full bg-[#6CB78E]" />
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">Kitchen Dashboard</h1>
                            <p className="text-xs text-[#6CB78E] font-semibold tracking-wide">{store.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {newOrders.length > 0 && (
                            <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 animate-pulse">
                                {newOrders.length} neue Bestellung{newOrders.length > 1 ? 'en' : ''}
                            </Badge>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            {mounted ? lastRefresh.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                        </span>
                        <button
                            onClick={playNotificationSound}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors duration-150 cursor-pointer ${soundEnabled
                                ? 'text-[#6CB78E] bg-green-50 hover:bg-green-100 border border-green-200'
                                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                                }`}
                        >
                            <Bell className="w-3.5 h-3.5" />
                            {soundEnabled ? 'Sound aktiv ✓' : 'Sound aktivieren'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">

                    {/* ── Stock Control ─────────────────────────── */}
                    <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <div>
                                <p className="text-sm font-bold text-slate-800">Stock Control</p>
                                <p className="text-xs text-slate-500">Speisen als ausverkauft markieren</p>
                            </div>
                        </div>
                        <div className="max-h-[calc(100vh-220px)] overflow-y-auto divide-y divide-slate-50">
                            {uniqueMenuNames.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-8">Kein Tagesmenü für heute gefunden.</p>
                            ) : uniqueMenuNames.map((item: string) => (
                                <div
                                    key={item}
                                    className={`flex items-center justify-between px-5 py-3 transition-colors duration-150 ${soldOut.has(item) ? 'bg-red-50' : 'hover:bg-slate-50'}`}
                                >
                                    <Label
                                        className={`text-sm cursor-pointer select-none flex-1 mr-3 ${soldOut.has(item) ? 'text-red-500 line-through' : 'text-slate-700 font-medium'}`}
                                        onClick={() => toggleSoldOut(item)}
                                    >
                                        {item}
                                    </Label>
                                    <Switch
                                        checked={soldOut.has(item)}
                                        onCheckedChange={() => toggleSoldOut(item)}
                                        className="data-[state=checked]:bg-red-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* ── Orders Feed ───────────────────────────── */}
                    <section>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-slate-900">Aktive Bestellungen</h2>
                            <span className="text-sm text-slate-500">{activeOrders.length} aktiv · {orders.length} gesamt</span>
                        </div>

                        {orders.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm text-center py-20">
                                <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-400 font-medium">Warten auf neue Bestellungen...</p>
                                <p className="text-xs text-slate-300 mt-2">Aktualisiert alle 5 Sekunden</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => {
                                    const sc = getStatusConfig(order.status);
                                    const isNew = order.status === 'received';
                                    const isCancelled = order.status === 'cancelled';
                                    const isDelivered = order.status === 'order.delivered';
                                    return (
                                        <div
                                            key={order.id}
                                            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${isCancelled || isDelivered ? 'border-slate-200 opacity-60' : isNew ? 'border-[#6CB78E]/40 shadow-md' : 'border-slate-200'}`}
                                        >
                                            <div className={`h-1 w-full ${isNew ? 'bg-[#6CB78E]' : isCancelled ? 'bg-red-400' : isDelivered ? 'bg-emerald-400' : 'bg-amber-400'}`} />

                                            <div className="p-5 flex flex-col sm:flex-row gap-5">
                                                {/* Order info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">#{order.order_number || order.id.slice(-5)}</span>
                                                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${sc.color}`}>
                                                                {sc.icon} {sc.label}
                                                            </span>
                                                        </div>
                                                        <span className="text-lg font-extrabold text-slate-900 shrink-0">
                                                            €{order.amount.toFixed(2).replace('.', ',')}
                                                        </span>
                                                    </div>

                                                    <p className="text-base font-bold text-slate-900 mb-0.5">{order.customerName}</p>
                                                    <p className="text-sm text-slate-500 mb-1">{order.customerPhone}</p>
                                                    <p className="text-sm text-slate-500 mb-3 truncate">{order.customerAddress}</p>

                                                    {/* Items list */}
                                                    <div className="bg-slate-50 rounded-xl px-4 py-3 space-y-1.5">
                                                        {order.orderDetails?.map((item, i) => (
                                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                                                <span className="font-bold text-slate-500 w-5 text-right shrink-0">{item.qty || 1}×</span>
                                                                <span className="font-semibold">{item.name}</span>
                                                                {item.size && <span className="text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono">{item.size}</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Action panel */}
                                                <div className="flex flex-col justify-between items-end gap-3 shrink-0 sm:min-w-[160px]">
                                                    <div className="text-right space-y-1.5">
                                                        {/* When the order was placed */}
                                                        <div>
                                                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Bestellt</p>
                                                            <p className="text-sm font-bold text-slate-700">{mounted ? new Date(order.createdAt).toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' }) : '--:--'} Uhr</p>
                                                        </div>

                                                        {/* Pre-order: customer's requested delivery time */}
                                                        {(order as any).scheduledDropoffTime && mounted && (
                                                            <div className="bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
                                                                <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">📅 Vorbestellt</p>
                                                                <p className="text-sm font-bold text-blue-700">
                                                                    {new Date((order as any).scheduledDropoffTime).toLocaleString('de-AT', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} Uhr
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Courier arrives at restaurant (kitchen deadline) */}
                                                        {(order as any).pickup_eta_iso && mounted && (
                                                            <div className="bg-orange-50 border border-orange-200 rounded-lg px-2 py-1">
                                                                <p className="text-xs text-orange-500 font-bold uppercase tracking-wider">🚚 Kurier um</p>
                                                                <p className="text-sm font-bold text-orange-700">
                                                                    {new Date((order as any).pickup_eta_iso).toLocaleString('de-AT', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} Uhr
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Delivery ETA — only for ASAP orders (pre-orders already know their target time) */}
                                                        {!(order as any).scheduledDropoffTime && mounted && (
                                                            <>
                                                                {(order as any).eta_iso && (
                                                                    <div>
                                                                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">⏰ Ankunft</p>
                                                                        <p className="text-sm font-bold text-slate-700">{new Date((order as any).eta_iso).toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })} Uhr</p>
                                                                    </div>
                                                                )}
                                                                {!(order as any).eta_iso && order.eta != null && (
                                                                    <div>
                                                                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">⏰ Ankunft</p>
                                                                        <p className="text-sm font-bold text-slate-700">~{order.eta} Min.</p>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    {isNew && (
                                                        <div className="flex flex-col gap-2 w-full">
                                                            <button
                                                                disabled={isDispatching === order.id}
                                                                onClick={() => handleDispatchWolt(order)}
                                                                className="w-full flex items-center justify-center gap-1.5 bg-[#6CB78E] hover:bg-[#5aa87e] disabled:opacity-60 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer shadow-sm"
                                                            >
                                                                <Truck className="w-4 h-4" />
                                                                {isDispatching === order.id ? 'Bestätigen...' : 'Bestellung bestätigen'}
                                                            </button>
                                                            {order.canCancel !== false && (
                                                                <button
                                                                    onClick={() => handleCancelOrder(order)}
                                                                    className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-red-50 text-red-500 text-sm font-bold px-4 py-2.5 rounded-xl border border-red-200 transition-colors duration-150 cursor-pointer"
                                                                >
                                                                    <XCircle className="w-4 h-4" /> Stornieren
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {order.status === 'wolt_dispatched' || order.status === 'order.pickup_started' ? (
                                                        <div className="text-center w-full">
                                                            <div className="flex items-center justify-center gap-1.5 text-amber-600 text-sm font-bold mb-1">
                                                                <Truck className="w-4 h-4" />
                                                                {order.status === 'order.pickup_started' ? 'Abgeholt' : 'Kurier unterwegs'}
                                                            </div>
                                                            {order.tracking_url && (
                                                                <a href={order.tracking_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline font-semibold">
                                                                    Live Tracking →
                                                                </a>
                                                            )}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

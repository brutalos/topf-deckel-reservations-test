import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StoreConfig } from '@/config/stores';
import { ShoppingBag, Trash2, ArrowRight, X, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
    canOrderASAP,
    asapBlockReason,
    isValidPreorderSlot,
    getPreorderConstraints,
} from '@/lib/orderingWindows';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

/**
 * Extract YYYY-MM-DD from the active cart's menu category.
 * e.g. "Dienstag (2026-03-17)" → "2026-03-17"
 *      "Tageskarte"             → today in Vienna tz
 * Returns undefined if cart is empty.
 */
function menuDateForCart(cart: any[]): string | undefined {
    if (!cart.length) return undefined;
    const cat: string = cart[0]?.category || '';
    // Try to extract "(YYYY-MM-DD)" from category label
    const match = cat.match(/\((\d{4}-\d{2}-\d{2})\)/);
    if (match) return match[1];
    // Tageskarte or unknown → today in Vienna
    return new Date().toLocaleString('sv', { timeZone: 'Europe/Vienna' }).split(' ')[0];
}


function CheckoutFormContent({ clientSecret, total, storeId, deliveryInfo, onCancel, cartItems }: any) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setIsProcessing(true);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message || 'Validation error');
            setIsProcessing(false);
            return;
        }

        const { error: confirmError } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/${storeId}/success`,
            },
        });

        if (confirmError) setError(confirmError.message || 'Zahlung fehlgeschlagen');
        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mt-6 w-full max-w-lg mx-auto">
            {/* Visual Order Summary matching topf-deckel-shop-venue */}
            <div className="bg-[#f6faf8] rounded-[8px] p-[0.8rem_1rem] font-body text-[0.88rem] mb-[1.2rem]">
                {cartItems.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between mb-[4px]">
                        <span>{item.qty}× {item.name} ({item.selectedSize})</span>
                        <span>€ {(item.prices[item.selectedSize] * item.qty).toFixed(2).replace('.', ',')}</span>
                    </div>
                ))}

                {deliveryInfo?.mode === 'delivery' && (
                    <div className="flex justify-between mb-[4px]">
                        <span>Liefergebühr</span>
                        <span>
                            {deliveryInfo.deliveryFeeInCents
                                ? `€ ${(deliveryInfo.deliveryFeeInCents / 100).toFixed(2).replace('.', ',')}`
                                : '(wird berechnet)'}
                        </span>
                    </div>
                )}

                <div className="flex justify-between font-[800] text-[1rem] border-t border-[#ddd] pt-[8px] mt-[4px]">
                    <span>Gesamt</span>
                    <span>€ {total}</span>
                </div>
            </div>

            <h3 className="text-xl font-bold font-sans mt-4 mb-2">Zahlungsdetails</h3>
            <PaymentElement />
            {error && <div className="text-destructive text-sm font-bold bg-destructive/10 p-3 rounded-lg">{error}</div>}

            <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing} className="w-1/3 h-12 rounded-xl font-bold font-sans">
                    Abbrechen
                </Button>
                <Button type="submit" disabled={!stripe || isProcessing} className="w-2/3 h-12 text-lg font-bold font-sans rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                    {isProcessing ? 'Verarbeitung...' : `Kaufen (€ ${total})`}
                </Button>
            </div>
        </form>
    );
}

export function CartSidebar({ cart, setCart, store, isOpen, onClose }: { cart: any[]; setCart: any; store: StoreConfig; isOpen: boolean; onClose: () => void }) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery'>('delivery');

    // Form fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [street, setStreet] = useState('');
    const [zip, setZip] = useState('');
    const [city, setCity] = useState('');

    const getFullAddress = () => `${street.trim()}, ${zip.trim()} ${city.trim()}`;
    const [deliveryNote, setDeliveryNote] = useState('');
    const [isPreorder, setIsPreorder] = useState(false);
    const [scheduledTime, setScheduledTime] = useState('');
    const [noContact, setNoContact] = useState(false);

    // Wolt & Validation States
    const [addressError, setAddressError] = useState('');
    const [deliveryFee, setDeliveryFee] = useState(0); // in cents
    const [deliveryEta, setDeliveryEta] = useState('');
    const [promiseId, setPromiseId] = useState('');
    const [isFetchingFee, setIsFetchingFee] = useState(false);

    const cartSubtotal = cart.reduce((acc, item) => acc + ((item.prices[item.selectedSize] || 0) * (item.qty || 1)), 0);
    const total = deliveryMode === 'delivery' ? cartSubtotal + (deliveryFee / 100) : cartSubtotal;
    const totalFormatted = total.toFixed(2).replace('.', ',');

    const [clientSecret, setClientSecret] = useState('');
    const [isInitiating, setIsInitiating] = useState(false);

    // ── Ordering window state ────────────────────────────────────────
    const [asapReason, setAsapReason] = useState<string | null>(null);
    const [preorderError, setPreorderError] = useState('');

    // Poll ASAP status every 60 seconds
    useEffect(() => {
        const update = () => setAsapReason(asapBlockReason(new Date()));
        update();
        const id = setInterval(update, 60_000);
        return () => clearInterval(id);
    }, []);

    // Auto-enable pre-order when ASAP is blocked and delivery mode is active
    useEffect(() => {
        if (deliveryMode === 'delivery' && asapReason && !isPreorder) {
            setIsPreorder(true);
        }
    }, [deliveryMode, asapReason]);

    const preorderConstraints = getPreorderConstraints(new Date(), menuDateForCart(cart));

    const handleScheduledTimeChange = (value: string) => {
        setScheduledTime(value);
        if (!value) { setPreorderError(''); return; }
        const dt = new Date(value); // datetime-local is local time
        const result = isValidPreorderSlot(dt, new Date());
        setPreorderError(result.valid ? '' : (result.error ?? ''));
    };

    const validateAddressFields = () => {
        if (!street.trim()) return { valid: false, message: 'Bitte Straße und Hausnummer angeben' };
        if (!/\d/.test(street)) return { valid: false, message: 'Bitte Hausnummer angeben (z.B. Mariahilfer Straße 12)' };
        if (!zip.trim()) return { valid: false, message: 'Bitte PLZ angeben' };
        const zipNum = parseInt(zip.trim(), 10);
        if (isNaN(zipNum) || zipNum < 1010 || zipNum > 9990) return { valid: false, message: 'PLZ ungültig (1010–9990)' };
        if (!city.trim()) return { valid: false, message: 'Bitte Stadt angeben' };
        return { valid: true, message: '' };
    };

    const handleAddressBlur = async () => {
        if (!street || !zip || !city || street.length < 3) return;

        const validation = validateAddressFields();
        if (!validation.valid) {
            setAddressError(validation.message);
            setDeliveryFee(0);
            setDeliveryEta('');
            return;
        }

        setAddressError('');
        setIsFetchingFee(true);

        const address = getFullAddress();

        try {
            const response = await fetch('/api/wolt/promise', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeId: store.id,
                    customerAddress: address,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422 && data.error === 'non_binding_promise') {
                    setAddressError(data.message || 'Adresse zu ungenau für Lieferung.');
                } else {
                    setAddressError(data.error || 'Lieferung an diese Adresse nicht möglich.');
                }
                setDeliveryFee(0);
                setDeliveryEta('');
                return;
            }

            // Split the Wolt delivery fee 50/50 with the customer automatically
            setDeliveryFee(data.delivery_fee ? Math.round(data.delivery_fee / 2) : 0);
            setDeliveryEta(data.eta_minutes ? `${data.eta_minutes} Min.` : 'Geplant');
            if (data.id) setPromiseId(data.id);
        } catch (error) {
            console.error('Error fetching Wolt promise:', error);
            setAddressError('Fehler bei der Adressprüfung.');
        } finally {
            setIsFetchingFee(false);
        }
    };

    const handleInitiateCheckout = async () => {
        if (!name || !phone || (deliveryMode === 'delivery' && (!street || !zip || !city))) {
            alert("Bitte fülle alle markierten Pflichtfelder aus (*)");
            return;
        }

        if (deliveryMode === 'delivery' && addressError) {
            alert("Bitte korrigiere die Lieferadresse, bevor du fortfährst.");
            return;
        }

        setIsInitiating(true);
        try {
            const address = getFullAddress();
            const deliveryInfo = {
                mode: deliveryMode,
                name,
                phone,
                email,
                ...(deliveryMode === 'delivery' && {
                    address,
                    note: deliveryNote,
                    isPreorder,
                    // Convert local datetime-local value (e.g. "2026-03-17T10:08") to proper UTC ISO
                    // so Wolt receives the correct time regardless of where the server runs
                    scheduledTime: isPreorder && scheduledTime ? new Date(scheduledTime).toISOString() : null,
                    noContact,
                    deliveryFeeInCents: deliveryFee,
                    deliveryEta,
                    promiseId
                })
            };

            const response = await fetch('/api/checkout/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeId: store.id,
                    items: cart,
                    deliveryInfo
                }),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setClientSecret(data.clientSecret);
        } catch (error) {
            console.error('Error initiating checkout:', error);
            alert("Verbindungsfehler. Bitte versuche es noch einmal.");
        } finally {
            setIsInitiating(false);
        }
    };

    const updateQty = (idx: number, delta: number) => {
        setCart((prev: any[]) => {
            const newCart = [...prev];
            const newQty = (newCart[idx].qty || 1) + delta;

            if (newQty <= 0) {
                return newCart.filter((_, i) => i !== idx);
            }

            newCart[idx] = { ...newCart[idx], qty: newQty };
            return newCart;
        });
    };

    return (
        <>
            {/* Cart Sidebar Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in" onClick={onClose} />
            )}

            <aside className={`w-full max-w-[420px] bg-card shadow-2xl fixed right-0 top-0 bottom-0 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b border-border bg-background flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                        <h2 className="font-sans font-bold text-2xl text-foreground tracking-tight">
                            Mein Warenkorb <span className="text-muted-foreground text-sm ml-2">({cart.reduce((sum, item) => sum + (item.qty || 1), 0)})</span>
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/50">
                    {cart.length === 0 ? (
                        <div className="text-center text-muted-foreground mt-24 flex flex-col items-center">
                            <ShoppingBag className="w-16 h-16 mb-4 opacity-20 text-primary" />
                            <p className="font-sans font-bold text-xl text-foreground/50">Dein Warenkorb ist leer.</p>
                            <p className="font-body text-sm mt-2">Füge leckere Gerichte hinzu!</p>
                        </div>
                    ) : (
                        cart.map((item, idx) => (
                            <div key={`${item.id}-${item.selectedSize}-${idx}`} className="flex justify-between items-start p-4 bg-card rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-colors">
                                <div className="flex-1 pr-3">
                                    <p className="font-sans font-bold text-lg text-foreground line-clamp-2 leading-tight">
                                        {item.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="font-body text-xs font-bold px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
                                            Größe {item.selectedSize}
                                        </span>
                                        <p className="font-sans font-bold text-foreground">
                                            € {(item.prices[item.selectedSize] * (item.qty || 1)).toFixed(2).replace('.', ',')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center bg-secondary rounded-xl overflow-hidden shadow-sm border border-border/50 shrink-0">
                                    <button
                                        onClick={() => updateQty(idx, -1)}
                                        className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-border/50 transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center font-bold text-sm bg-background py-2 select-none">
                                        {item.qty || 1}
                                    </span>
                                    <button
                                        onClick={() => updateQty(idx, 1)}
                                        className="px-3 py-2 text-primary hover:bg-border/50 font-medium transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-border bg-card shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-2 mb-6 p-1 bg-secondary rounded-xl border border-border/50">
                        <button
                            className="w-full py-2.5 px-3 text-sm font-bold font-sans rounded-lg bg-primary text-primary-foreground shadow-sm cursor-default pointer-events-none"
                        >
                            🚴 Lieferung
                        </button>
                    </div>

                    <div className="flex justify-between items-end mb-6">
                        <span className="font-body text-muted-foreground font-medium">Gesamtsumme</span>
                        <span className="font-sans text-4xl font-extrabold text-foreground tracking-tight">
                            € {totalFormatted}
                        </span>
                    </div>

                    <Button
                        disabled={cart.length === 0}
                        onClick={() => setIsCheckoutOpen(true)}
                        className="w-full h-14 text-lg font-sans font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        Zur Kasse <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>
            </aside>

            {/* Checkout Modal Overlay */}
            {isCheckoutOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col md:items-center p-4 md:p-8 overflow-y-auto animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-xl my-auto rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-border flex justify-between items-center bg-background shrink-0">
                            <h2 className="text-2xl font-sans font-bold text-foreground">Bestellung aufgeben</h2>
                            <button onClick={() => { setIsCheckoutOpen(false); setClientSecret(''); }} className="p-2 text-muted-foreground hover:text-foreground bg-secondary rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 font-body">

                            {!clientSecret ? (
                                <div className="space-y-5">
                                    <div className="flex space-x-4">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-sm font-bold text-foreground">Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Max Mustermann"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                className="w-full p-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="text-sm font-bold text-foreground">Telefon *</label>
                                            <input
                                                type="tel"
                                                placeholder="+43 660 1234567"
                                                value={phone}
                                                onChange={e => setPhone(e.target.value)}
                                                className="w-full p-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {deliveryMode === 'delivery' && (
                                        <div className="space-y-5 animate-in slide-in-from-top-2 duration-300">
                                            <div className="space-y-2 relative">
                                                <div className="flex justify-between items-end mb-1">
                                                    <label className="text-sm font-bold text-foreground">Lieferadresse *</label>
                                                    {isFetchingFee && <span className="text-xs text-primary animate-pulse font-bold">Prüfe Liefergebiet...</span>}
                                                    {!isFetchingFee && deliveryFee > 0 && <span className="text-xs text-green-600 font-bold">Wolt ETA: {deliveryEta}</span>}
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Straße und Hausnummer (z.B. Mariahilfer Straße 12)"
                                                    value={street}
                                                    onChange={e => {
                                                        setStreet(e.target.value);
                                                        if (addressError) setAddressError('');
                                                    }}
                                                    onBlur={handleAddressBlur}
                                                    className={`w-full p-3 bg-secondary/50 border rounded-xl focus:ring-2 outline-none transition-all ${addressError ? 'border-destructive focus:ring-destructive/50' : deliveryFee > 0 ? 'border-green-500/50 focus:ring-green-500/50' : 'border-border focus:ring-primary'}`}
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="PLZ (z.B. 1060)"
                                                        value={zip}
                                                        onChange={e => {
                                                            setZip(e.target.value);
                                                            if (addressError) setAddressError('');
                                                        }}
                                                        onBlur={handleAddressBlur}
                                                        className={`w-1/3 p-3 bg-secondary/50 border rounded-xl focus:ring-2 outline-none transition-all ${addressError ? 'border-destructive focus:ring-destructive/50' : deliveryFee > 0 ? 'border-green-500/50 focus:ring-green-500/50' : 'border-border focus:ring-primary'}`}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Stadt (z.B. Wien)"
                                                        value={city}
                                                        onChange={e => {
                                                            setCity(e.target.value);
                                                            if (addressError) setAddressError('');
                                                        }}
                                                        onBlur={handleAddressBlur}
                                                        className={`w-2/3 p-3 bg-secondary/50 border rounded-xl focus:ring-2 outline-none transition-all ${addressError ? 'border-destructive focus:ring-destructive/50' : deliveryFee > 0 ? 'border-green-500/50 focus:ring-green-500/50' : 'border-border focus:ring-primary'}`}
                                                    />
                                                </div>
                                                {addressError && <p className="text-xs text-destructive font-bold">{addressError}</p>}
                                            </div>

                                            {/* ASAP status banner */}
                                            {deliveryMode === 'delivery' && (
                                                <div className={`flex items-start gap-2.5 p-3 rounded-xl text-sm border ${asapReason
                                                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                                                    : 'bg-green-50 border-green-200 text-green-800'
                                                    }`}>
                                                    {asapReason
                                                        ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                                        : <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                                                    <span className="font-medium">
                                                        {asapReason ?? 'ASAP-Lieferung jetzt verfügbar'}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="preorderToggle"
                                                    checked={isPreorder}
                                                    disabled={!!asapReason}  // force pre-order when ASAP blocked
                                                    onChange={e => setIsPreorder(e.target.checked)}
                                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer mt-0.5"
                                                />
                                                <label htmlFor="preorderToggle" className="text-sm text-[#444] cursor-pointer inline-flex items-center">
                                                    Vorbestellen (geplante Lieferzeit)
                                                    {asapReason && <span className="ml-1.5 text-xs text-amber-600 font-bold">(erforderlich)</span>}
                                                </label>
                                            </div>

                                            {isPreorder && (
                                                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-primary shrink-0" />
                                                        <label className="text-sm font-bold text-foreground">Gewünschte Lieferzeit</label>
                                                    </div>
                                                    <input
                                                        type="datetime-local"
                                                        value={scheduledTime}
                                                        min={preorderConstraints.minDatetime}
                                                        max={preorderConstraints.maxDatetime}
                                                        onChange={e => handleScheduledTimeChange(e.target.value)}
                                                        className={`w-full p-3 bg-secondary/50 border rounded-xl focus:ring-2 outline-none transition-all ${preorderError
                                                            ? 'border-destructive focus:ring-destructive/50'
                                                            : 'border-border focus:ring-primary'
                                                            }`}
                                                    />
                                                    {preorderError
                                                        ? <p className="text-xs text-destructive font-bold flex items-center gap-1">
                                                            <AlertTriangle className="w-3 h-3" />{preorderError}
                                                        </p>
                                                        : <p className="text-xs text-muted-foreground mt-1">
                                                            Mo–Fr · Lieferung 11:00–12:15 oder 13:30–15:00 Uhr · mindestens 1 Std. im Voraus bestellen
                                                        </p>
                                                    }
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-foreground">Anmerkung für den Kurier</label>
                                                <textarea
                                                    rows={2}
                                                    placeholder="z.B. 2. OG links, bitte klingeln..."
                                                    value={deliveryNote}
                                                    onChange={e => setDeliveryNote(e.target.value)}
                                                    className="w-full p-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-y"
                                                />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="noContactToggle"
                                                    checked={noContact}
                                                    onChange={e => setNoContact(e.target.checked)}
                                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer mt-0.5"
                                                />
                                                <label htmlFor="noContactToggle" className="text-sm text-[#444] cursor-pointer inline-flex items-center">
                                                    Kontaktlose Lieferung (vor die Tür stellen)
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2 mt-5">
                                        <label className="text-sm font-bold text-foreground">E-Mail (optional, für Wolt-Benachrichtigungen)</label>
                                        <input
                                            type="email"
                                            placeholder="max@example.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full p-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-border">
                                        <Button
                                            onClick={handleInitiateCheckout}
                                            disabled={isInitiating}
                                            className="w-full h-14 text-lg font-sans font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                                        >
                                            {isInitiating ? 'Lade Zahlungsseite...' : 'Weiter zur Zahlung'}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                                    <CheckoutFormContent
                                        clientSecret={clientSecret}
                                        total={totalFormatted}
                                        storeId={store.id}
                                        cartItems={cart}
                                        deliveryInfo={{
                                            mode: deliveryMode,
                                            name,
                                            phone,
                                            email,
                                            ...(deliveryMode === 'delivery' && {
                                                address: getFullAddress(),
                                                note: deliveryNote,
                                                isPreorder,
                                                scheduledTime: isPreorder ? scheduledTime : null,
                                                noContact,
                                                deliveryFeeInCents: deliveryFee,
                                                deliveryEta,
                                                promiseId,
                                            })
                                        }}
                                        onCancel={() => setClientSecret('')}
                                    />
                                </Elements>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function Badge({ count }: { count: number }) {
    if (count === 0) return null;
    return (
        <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {count}
        </span>
    );
}

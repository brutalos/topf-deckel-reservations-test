'use client';

import { useState, useMemo, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { stores } from '@/config/stores';
import { ShoppingBag, Plus, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CartSidebar } from './components/CartSidebar';
import { KomboModal } from './components/KomboModal';
import { isPeakHourCheckoutBlocked } from '@/lib/orderingWindows';

export default function StorefrontPage({ storeId, menuData }: { storeId: string, menuData: any[] }) {
    const store = stores.find((s) => s.id === storeId);
    if (!store) return notFound();

    // State
    const [cart, setCart] = useState<any[]>([]);
    const [cartCategory, setCartCategory] = useState<string | null>(null); // date-lock
    const [pendingAdd, setPendingAdd] = useState<{ item: any; size: string } | null>(null); // for conflict dialog
    const [activeCategory, setActiveCategory] = useState<string>('Tageskarte');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [soldOutNames, setSoldOutNames] = useState<Set<string>>(new Set());
    const [komboModalItem, setKomboModalItem] = useState<any | null>(null);

    // Peak Hour Check
    const [isPeakBlocked, setIsPeakBlocked] = useState(false);
    useEffect(() => {
        const checkPeak = () => setIsPeakBlocked(isPeakHourCheckoutBlocked(new Date()));
        checkPeak();
        const peakInterval = setInterval(checkPeak, 60000);
        return () => clearInterval(peakInterval);
    }, []);

    // Fetch stock
    useEffect(() => {
        const fetchStock = () =>
            fetch(`/api/stock?storeId=${storeId}`)
                .then(r => r.json())
                .then(data => setSoldOutNames(new Set(data.soldOut || [])))
                .catch(() => { });
        fetchStock();
        const interval = setInterval(fetchStock, 10000);
        return () => clearInterval(interval);
    }, [storeId]);

    const today = new Date();
    const isWeekend = today.getDay() === 0 || today.getDay() === 6;
    const todayStr = `(${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')})`;

    const availableCategories = useMemo(() => {
        const rawCategories = Array.from(new Set((menuData as any[]).map((m) => m.category)));
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

        return rawCategories.filter(cat => {
            if (cat === 'Tageskarte' || cat.toLowerCase().includes('tageskarte')) return true;
            const match = cat.match(/\((.*?)\)/);
            if (match && match[1]) {
                const catDate = new Date(match[1]).getTime();
                return catDate >= todayMidnight;
            }
            return true;
        });
    }, [menuData]);

    if (!availableCategories.includes(activeCategory) && availableCategories.length > 0) {
        setActiveCategory(availableCategories[0]);
    }

    const itemsToShow = useMemo(() => {
        if (activeCategory === 'Tageskarte' || activeCategory.toLowerCase().includes('tageskarte')) {
            return (menuData as any[]).filter(m =>
                m.category === 'Tageskarte' ||
                m.category.includes(todayStr)
            );
        }
        return (menuData as any[]).filter(m => m.category === activeCategory);
    }, [activeCategory, menuData, todayStr]);

    const isViewingToday = activeCategory === 'Tageskarte' ||
        activeCategory.toLowerCase().includes('tageskarte') ||
        activeCategory.includes(todayStr);
    const soldOutForDisplay = isViewingToday ? soldOutNames : new Set<string>();

    const todayItems = (menuData as any[]).filter(m =>
        (m.category === 'Tageskarte' || m.category.includes(todayStr)) &&
        (!m.komboOptions || m.komboOptions.length === 0)
    );

    /** Normalise a category to a date key so Tageskarte == today's pre-order category */
    const normCategory = (cat: string): string => {
        if (cat === 'Tageskarte' || cat.toLowerCase().includes('tageskarte')) return todayStr;
        const m = cat.match(/\((.*?)\)/);
        return m ? `(${m[1]})` : cat;
    };

    const doAdd = (item: any, size: string) => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(cartItem => cartItem.id === item.id && cartItem.selectedSize === size);
            if (existingIndex >= 0) {
                const updatedCart = [...prevCart];
                updatedCart[existingIndex] = { ...updatedCart[existingIndex], qty: updatedCart[existingIndex].qty + 1 };
                return updatedCart;
            }
            return [...prevCart, { ...item, selectedSize: size, cartId: Date.now(), qty: 1 }];
        });
    };

    const onAdd = (item: any, size: string) => {
        const itemDateKey = normCategory(item.category ?? activeCategory);
        if (cart.length === 0 || cartCategory === null) {
            // First item — lock the cart to this date
            setCartCategory(itemDateKey);
            doAdd(item, size);
        } else if (normCategory(cartCategory) === itemDateKey) {
            // Same date — just add
            doAdd(item, size);
        } else {
            // Different date — ask the user
            setPendingAdd({ item, size });
        }
    };

    const komboItems = itemsToShow.filter(item => item.komboOptions && item.komboOptions.length > 0);
    const standardItems = itemsToShow.filter(item => !item.komboOptions || item.komboOptions.length === 0);

    return (
        <div className="min-h-screen bg-background font-body flex flex-col pt-24">
            <main className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">

                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <a href="/" className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-border/50 bg-white flex items-center justify-center p-2 hover:opacity-80 transition-opacity">
                            <img src="/images/squarespace/dc8d1fa4-c438-415b-9193-ec3ecbfcd796_topf-deckel-stadtkantine.png" alt="Topf & Deckel Logo" className="w-full h-full object-contain cursor-pointer" />
                        </a>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-sans font-extrabold text-foreground tracking-tight">{store.name}</h1>
                            <p className="text-muted-foreground font-medium mt-1 flex items-center gap-2">
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">Geöffnet</span>
                                {store.address}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        disabled={isPeakBlocked}
                        className={`flex items-center gap-2 p-3 px-6 border border-border rounded-xl font-bold shadow-sm transition-all ${isPeakBlocked ? 'bg-muted text-muted-foreground opacity-50' : 'bg-card text-foreground hover:border-primary/50'}`}
                    >
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        <span>Warenkorb ({cart.length})</span>
                    </button>
                </div>

                {isPeakBlocked && (
                    <div className="bg-red-500 text-white text-center py-3 font-bold rounded-xl mb-8">
                        ⚠️ Online-Bestellungen sind wegen Stoßzeit (12:00–13:00) derzeit pausiert.
                    </div>
                )}

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
                    {availableCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}
                        >
                            {cat.split(' (')[0]}
                        </button>
                    ))}
                </div>

                {/* Menu Items */}
                <div className="space-y-12">
                    {komboItems.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {komboItems.map((item, komboIdx) => {
                                const savingsPct = komboIdx === 0 ? 25 : 20;
                                return (
                                <div key={item.id} className="kombo-card">
                                    <div className="kombo-header">
                                        <span className="kombo-title">{item.name.toUpperCase()}</span>
                                        <span className="kombo-price">€{item.prices?.S?.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    <div className="kombo-options-box">
                                        {item.komboOptions.map((opt: any, idx: number) => (
                                            <div key={idx} className="kombo-option">{opt.label}</div>
                                        ))}
                                        <div className="kombo-badge">
                                            <span>SPARE</span>
                                            <span>BIS ZU</span>
                                            <strong>{savingsPct}%</strong>
                                        </div>
                                    </div>
                                    <button className="kombo-add-btn" onClick={() => setKomboModalItem(item)}>
                                        Kombo zusammenstellen
                                    </button>
                                </div>
                                );
                            })}
                        </div>
                    )}

                    {isWeekend && isViewingToday ? (
                        <div className="text-center font-bold text-foreground py-12 mb-10 text-xl max-w-2xl mx-auto">
                            Wir sind am Wochenende geschlossen. Besuchen Sie uns Montag bis Freitag!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {standardItems.map((item) => {
                                const isSoldOut = soldOutForDisplay.has(item.name);
                                return (
                                    <Card key={item.id} className={`group overflow-hidden border rounded-2xl flex flex-col h-full bg-card ${isSoldOut ? 'opacity-60 grayscale' : 'hover:shadow-md'}`}>
                                        <CardContent className="p-6 flex flex-col h-full relative">
                                            {isSoldOut && <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">Ausverkauft</div>}
                                            <div className="flex-1">
                                                <h3 className={`font-sans font-bold text-xl mb-2 ${isSoldOut ? 'line-through' : ''}`}>{item.name}</h3>
                                                {item.description && <p className="text-sm text-muted-foreground mb-4">{item.description}</p>}
                                            </div>
                                            <div className="flex flex-col gap-2 mt-auto">
                                                {Object.entries(item.prices || {}).map(([size, price]: [any, any]) => (
                                                    <div key={size} className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-muted-foreground uppercase">{size === 'S' ? 'Klein' : 'Groß'}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-foreground">€ {price.toFixed(2).replace('.', ',')}</span>
                                                            <button disabled={isSoldOut} onClick={() => onAdd(item, size)} className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-50"><Plus className="w-4 h-4" /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* Delicious Food Gallery */}
                    <div className="mt-20 pt-16 border-t border-border/50">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-sans font-extrabold text-foreground tracking-tight">Aus unserer Küche</h2>
                            <p className="text-muted-foreground mt-3 font-medium text-lg">Frisch auf den Teller, mit Liebe gekocht.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="aspect-square rounded-3xl overflow-hidden group shadow-sm border border-border/50 relative">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                <img src="/images/squarespace/00c81532-dd48-4732-8291-09f753044669_dish_01.jpg" alt="Dish 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                            </div>
                            <div className="aspect-square rounded-3xl overflow-hidden group shadow-sm border border-border/50 relative">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                <img src="/images/squarespace/b9feb942-8959-4a0e-ab86-f7e736d0edc6_06_seasonal_vegetable_soup.jpeg" alt="Dish 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                            </div>
                            <div className="aspect-square rounded-3xl overflow-hidden group shadow-sm border border-border/50 relative">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                <img src="/images/squarespace/7e315319-267c-46ab-a1a4-b9bb74a4afbf_dish_03.jpg" alt="Dish 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                            </div>
                            <div className="aspect-square rounded-3xl overflow-hidden group shadow-sm border border-border/50 relative">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                <img src="/images/squarespace/9490696f-f6f9-4286-981d-3ecaa4d6559f_01-zutaten-die-richtig-wohl-tun.jpg" alt="Zutaten" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <CartSidebar
                cart={cart}
                setCart={(updater: any) => {
                    setCart((prev: any[]) => {
                        const next = typeof updater === 'function' ? updater(prev) : updater;
                        if (next.length === 0) setCartCategory(null);
                        return next;
                    });
                }}
                store={store}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
            {komboModalItem && <KomboModal item={komboModalItem} todayItems={todayItems} soldOutNames={soldOutForDisplay} isOpen={true} onClose={() => setKomboModalItem(null)} onAdd={onAdd} />}

            {/* Date-conflict dialog */}
            {pendingAdd && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setPendingAdd(null)} />
                    <div className="fixed z-[70] inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-card rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-start gap-3 mb-4">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <h3 className="font-sans font-bold text-lg text-foreground leading-tight">Anderer Liefertag</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Dein Warenkorb enthält bereits Artikel für einen anderen Tag. Du kannst keine Artikel aus verschiedenen Tagen mischen.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-6">
                            <button
                                onClick={() => {
                                    if (pendingAdd) {
                                        const { item, size } = pendingAdd;
                                        const newKey = normCategory(item.category ?? activeCategory);
                                        setCart([]);
                                        setCartCategory(newKey);
                                        setTimeout(() => doAdd(item, size), 0);
                                    }
                                    setPendingAdd(null);
                                }}
                                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors"
                            >
                                Warenkorb leeren & neu starten
                            </button>
                            <button
                                onClick={() => setPendingAdd(null)}
                                className="w-full py-3 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-secondary transition-colors"
                            >
                                Abbrechen
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

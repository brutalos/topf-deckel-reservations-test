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

    const onAdd = (item: any, size: string) => {
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

    const komboItems = itemsToShow.filter(item => item.komboOptions && item.komboOptions.length > 0);
    const standardItems = itemsToShow.filter(item => !item.komboOptions || item.komboOptions.length === 0);

    return (
        <div className="min-h-screen bg-background font-body flex flex-col pt-24">
            <main className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
                
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-sans font-bold text-foreground">{store.name}</h1>
                        <p className="text-muted-foreground">{store.address}</p>
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
                            {komboItems.map((item) => (
                                <div key={item.id} className="kombo-card border border-[#c4d1ca]">
                                    <div className="kombo-header">
                                        <span className="kombo-title">{item.name.toUpperCase()}</span>
                                        <span className="kombo-price">€ {item.prices?.S?.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    <div className="kombo-options-box">
                                        {item.komboOptions.map((opt: any, idx: number) => (
                                            <div key={idx} className="kombo-option">+ {opt.label}</div>
                                        ))}
                                    </div>
                                    <button className="kombo-add-btn" onClick={() => setKomboModalItem(item)}>
                                        Kombo zusammenstellen
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

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
                </div>
            </main>

            <CartSidebar cart={cart} setCart={setCart} store={store} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            {komboModalItem && <KomboModal item={komboModalItem} todayItems={todayItems} soldOutNames={soldOutForDisplay} isOpen={true} onClose={() => setKomboModalItem(null)} onAdd={onAdd} />}
        </div>
    );
}

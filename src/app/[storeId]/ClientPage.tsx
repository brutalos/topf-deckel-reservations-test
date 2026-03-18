'use client';



import { useState, useMemo, use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { stores } from '@/config/stores';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { CustomMenuGrid } from './components/MenuGrid';
import { CartSidebar } from './components/CartSidebar';
import { isPeakHourCheckoutBlocked } from '@/lib/orderingWindows';
export default function StorefrontPage({ params, menuData }: { params: Promise<{ storeId: string }>, menuData: any[] }) {
    const { storeId } = use(params);
    const store = stores.find((s) => s.id === storeId);
    if (!store) return notFound();

    // State
    const [cart, setCart] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('Tageskarte');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [soldOutNames, setSoldOutNames] = useState<Set<string>>(new Set());

    // Peak Hour Check
    const [isPeakBlocked, setIsPeakBlocked] = useState(false);
    useEffect(() => {
        const checkPeak = () => setIsPeakBlocked(isPeakHourCheckoutBlocked(new Date()));
        checkPeak();
        const peakInterval = setInterval(checkPeak, 60000); // Check every minute
        return () => clearInterval(peakInterval);
    }, []);

    // Fetch and poll sold-out items from admin
    useEffect(() => {
        const fetchStock = () =>
            fetch(`/api/stock?storeId=${storeId}`)
                .then(r => r.json())
                .then(data => setSoldOutNames(new Set(data.soldOut || [])))
                .catch(() => { });
        fetchStock();
        const interval = setInterval(fetchStock, 10000); // re-poll every 10s
        return () => clearInterval(interval);
    }, [storeId]);

    // Format today to match "(YYYY-MM-DD)" string format in JSON
    const today = new Date();
    const todayStr = `(${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')})`;
    const isWeekend = today.getDay() === 0 || today.getDay() === 6; // 0 = Sunday, 6 = Saturday

    // Filter Categories Logic - Hide past days automatically based on current date
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
    }, [today, todayStr]);

    // Sync category if the active one vanishes (due to day changing)
    if (!availableCategories.includes(activeCategory) && availableCategories.length > 0) {
        setActiveCategory(availableCategories[0]);
    }

    const itemsToShow = useMemo(() => {
        if (activeCategory === 'Tageskarte' || activeCategory.toLowerCase().includes('tageskarte')) {
            // Include explicit Tageskarte items AND anything tagged with today's date string
            return (menuData as any[]).filter(m =>
                m.category === 'Tageskarte' ||
                m.category.includes(todayStr)
            );
        }
        return (menuData as any[]).filter(m => m.category === activeCategory);
    }, [activeCategory, todayStr]);

    // Only show sold-out status for today's category.
    // Future date categories should always be fully orderable.
    const isViewingToday = activeCategory === 'Tageskarte' ||
        activeCategory.toLowerCase().includes('tageskarte') ||
        activeCategory.includes(todayStr);
    const soldOutForDisplay = isViewingToday ? soldOutNames : new Set<string>();

    // Full list of today's non-kombo items — passed to KomboModal for component selection
    const todayItems = (menuData as any[]).filter(m =>
        (m.category === 'Tageskarte' || m.category.includes(todayStr)) &&
        (!m.komboOptions || m.komboOptions.length === 0)
    );

    return (
        <div className="min-h-screen bg-background font-body flex flex-col">

            {/* Sticky Header with Logo & Cart Button */}
            <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border h-16 md:h-20 flex justify-between items-center px-4 md:px-8">
                {/* Left Side: Store Info */}
                <div className="flex-1 text-[11px] md:text-xs font-semibold text-primary tracking-wide hidden md:block">
                    📍 Store {store.name} &nbsp;·&nbsp; {store.address}
                </div>
                <div className="flex-1 md:hidden"></div> {/* Mobile Spacer */}

                {/* Center: Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center h-full pointer-events-none">
                    <img
                        src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/dc8d1fa4-c438-415b-9193-ec3ecbfcd796/topf-deckel-stadtkantine.png?format=1500w"
                        alt="Topf & Deckel Logo"
                        className="h-8 md:h-12 object-contain pointer-events-auto"
                    />
                </div>

                {/* Right Side: Cart */}
                <div className="flex-1 flex justify-end">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        disabled={isPeakBlocked}
                        className={`flex items-center gap-2 p-2 px-4 md:p-3 md:px-5 border border-border rounded-xl font-bold shadow-sm transition-all relative z-10 ${isPeakBlocked ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' : 'bg-card text-foreground hover:border-primary/50 hover:shadow-md'}`}
                    >
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        <span className="hidden sm:inline">Warenkorb</span>
                        <span>({cart.length})</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full transition-all flex flex-col">

                {/* Brand Hero Section */}
                <div className="relative h-64 md:h-80 w-full bg-black flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/b9feb942-8959-4a0e-ab86-f7e736d0edc6/06_seasonal_vegetable_soup.jpeg')` }}
                    />
                    <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
                    <div className="relative z-10 text-center px-4 max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-sans font-bold text-white tracking-tight mb-4 drop-shadow-md uppercase">
                            STADTKANTINE
                        </h1>
                        <p className="text-white/95 text-md md:text-xl font-body drop-shadow-sm font-medium">
                            Ehrliches Essen, frisch gekocht. Deine tägliche Portion Wohlbefinden.
                        </p>
                    </div>
                </div>

                {isPeakBlocked && (
                    <div className="bg-red-500 text-white text-center py-3 font-bold px-4 text-sm md:text-base z-20 relative w-full">
                        ⚠️ Online-Bestellungen sind wegen Stoßzeit (12:00–13:00) derzeit pausiert. Wir bitten um Verständnis!
                    </div>
                )}

                {/* Content Container */}
                <div className="p-4 md:p-8 max-w-5xl mx-auto w-full flex-1 -mt-8 relative z-20">

                    {/* Categories Bar */}
                    <div className="flex flex-wrap gap-2 mb-10 p-2 bg-card rounded-2xl shadow-sm border border-border whitespace-nowrap overflow-x-auto">
                        {availableCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    // Cross-date guard: if cart has items and user switches to a different date category
                                    if (cart.length > 0 && cat !== activeCategory) {
                                        const cartDate = cart[0]?.category;
                                        const isDifferentDate =
                                            cartDate &&
                                            cartDate !== 'Tageskarte' &&
                                            cat !== 'Tageskarte' &&
                                            cartDate !== cat;
                                        if (isDifferentDate) {
                                            const ok = window.confirm(
                                                `Tageskarte wechseln?\nDein Warenkorb wird geleert, da die Artikel für „${cartDate.split(' (')[0]}" gelten.`
                                            );
                                            if (!ok) return;
                                            setCart([]);
                                        }
                                    }
                                    setActiveCategory(cat);
                                }}
                                className={`px-6 py-3 rounded-xl text-sm font-sans font-bold transition-all ${activeCategory === cat
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'bg-transparent text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                                    }`}
                            >
                                {cat.split(' (')[0]}
                            </button>
                        ))}
                    </div>

                    {/* Menu Grid */}
                    <CustomMenuGrid
                        items={itemsToShow}
                        soldOutNames={soldOutForDisplay}
                        todayItems={todayItems}
                        onAdd={(item: any, size: string) => {
                            setCart((prevCart) => {
                                const existingIndex = prevCart.findIndex(cartItem => cartItem.id === item.id && cartItem.selectedSize === size);
                                if (existingIndex >= 0) {
                                    const updatedCart = [...prevCart];
                                    updatedCart[existingIndex] = { ...updatedCart[existingIndex], qty: updatedCart[existingIndex].qty + 1 };
                                    return updatedCart;
                                }
                                return [...prevCart, { ...item, selectedSize: size, cartId: Date.now(), qty: 1 }];
                            });
                        }}
                    />

                    {/* Photo Gallery Below Items */}
                    <div className="mt-16 border-t border-border pt-12">
                        <h3 className="text-2xl font-sans font-bold mb-6 text-foreground">Frisch Gekocht</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[400px]">
                            {/* Large Hero Image */}
                            <div className="relative h-64 md:h-full rounded-2xl overflow-hidden md:col-span-2 group border border-border bg-card">
                                <img
                                    src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/b9feb942-8959-4a0e-ab86-f7e736d0edc6/06_seasonal_vegetable_soup.jpeg"
                                    alt="Soup"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                />
                            </div>

                            {/* Two smaller stacked images */}
                            <div className="grid grid-rows-2 gap-4 h-[400px] md:h-full">
                                <div className="relative rounded-2xl overflow-hidden group border border-border bg-card h-full w-full">
                                    <img
                                        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop"
                                        alt="Salad"
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                    />
                                </div>
                                <div className="relative rounded-2xl overflow-hidden group border border-border bg-card h-full w-full">
                                    <img
                                        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop"
                                        alt="Bowl"
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Overlay Sidebar */}
            <CartSidebar
                cart={cart}
                setCart={setCart}
                store={store}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </div>
    );
}

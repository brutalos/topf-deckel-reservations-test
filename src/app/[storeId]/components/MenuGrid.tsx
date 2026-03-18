'use client';


import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, XCircle } from 'lucide-react';
import { KomboModal } from './KomboModal';
export function CustomMenuGrid({
    items,
    onAdd,
    soldOutNames = new Set(),
    todayItems = [],
}: {
    items: any[];
    onAdd: (item: any, size: string) => void;
    soldOutNames?: Set<string>;
    todayItems?: any[];
}) {
    const [komboModalItem, setKomboModalItem] = useState<any | null>(null);

    if (items.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground bg-card rounded-2xl border border-border shadow-sm font-body">
                Derzeit keine Gerichte in dieser Kategorie.
            </div>
        );
    }

    const komboItems = items.filter(item => item.komboOptions && item.komboOptions.length > 0);
    const standardItems = items.filter(item => !item.komboOptions || item.komboOptions.length === 0);

    return (
        <>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Wider Kombo Row */}
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
                                    {item.savings && (
                                        <div className="kombo-badge">
                                            SPARE<br />BIS ZU<br /><strong>{item.savings}</strong>
                                        </div>
                                    )}
                                </div>
                                {/* Open modal instead of direct add */}
                                <button
                                    className="kombo-add-btn"
                                    onClick={() => setKomboModalItem(item)}
                                >
                                    Kombo zusammenstellen
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Standard Items Grid */}
                {standardItems.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {standardItems.map((item) => {
                            const isSoldOut = soldOutNames.has(item.name);
                            return (
                                <Card
                                    key={item.id}
                                    className={`group overflow-hidden border transition-all rounded-2xl shadow-sm flex flex-col h-full bg-card
                                        ${isSoldOut ? 'border-border opacity-60 grayscale' : 'hover:border-primary/50 hover:shadow-md border-border'}`}
                                >
                                    <CardContent className="p-6 flex flex-col h-full flex-1 relative">
                                        {isSoldOut && (
                                            <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200 z-10">
                                                <XCircle className="w-3 h-3" /> Ausverkauft
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2 pr-28">
                                                <h3 className={`font-sans font-bold text-xl leading-tight ${isSoldOut ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                                    {item.name}
                                                </h3>
                                            </div>
                                            {item.tags && item.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {item.tags.map((tag: string) => (
                                                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {item.description && (
                                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2 mt-auto">
                                            {item.prices?.S && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground font-semibold">KLEIN</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base font-bold text-foreground">
                                                            € {item.prices.S.toFixed(2).replace('.', ',')}
                                                        </span>
                                                        <button
                                                            disabled={isSoldOut}
                                                            onClick={() => !isSoldOut && onAdd(item, 'S')}
                                                            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {item.prices?.L && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground font-semibold">GROSS</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base font-bold text-foreground">
                                                            € {item.prices.L.toFixed(2).replace('.', ',')}
                                                        </span>
                                                        <button
                                                            disabled={isSoldOut}
                                                            onClick={() => !isSoldOut && onAdd(item, 'L')}
                                                            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Kombo selection modal */}
            {komboModalItem && (
                <KomboModal
                    item={komboModalItem}
                    todayItems={todayItems}
                    soldOutNames={soldOutNames}
                    isOpen={true}
                    onClose={() => setKomboModalItem(null)}
                    onAdd={(cartItem, size) => {
                        onAdd(cartItem, size);
                        setKomboModalItem(null);
                    }}
                />
            )}
        </>
    );
}

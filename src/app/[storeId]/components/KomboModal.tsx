'use client';

import { useState } from 'react';
import { X, Check, ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';

interface MenuItem {
    id: string;
    name: string;
    prices: Record<string, number>;
    tags?: string[];
}

interface KomboOption {
    label: string;
}

interface KomboItem {
    id: string;
    name: string;
    prices: Record<string, number>;
    komboOptions: KomboOption[];
    savings?: string;
}

interface Props {
    item: KomboItem;
    todayItems: MenuItem[];
    soldOutNames?: Set<string>;
    isOpen: boolean;
    onClose: () => void;
    onAdd: (item: any, size: string) => void;
}

/** Classify a today-menu item into soup / salad / main / dessert */
function detectType(item: MenuItem): 'soup' | 'salad' | 'main' | 'dessert' {
    const name = item.name.toLowerCase();
    if (name.includes('suppe')) return 'soup';
    if (name === 'haussalat') return 'salad';
    // Desserts only have size S and price ≤ €6
    const prices = Object.values(item.prices);
    if (prices.length === 1 && prices[0] <= 6) return 'dessert';
    return 'main';
}

/** A selection card — clicking it selects it */
function SelectCard({
    label,
    sublabel,
    selected,
    disabled,
    soldOut,
    forceCheck,
    onClick,
}: {
    label: string;
    sublabel?: string;
    selected: boolean;
    disabled?: boolean;
    soldOut?: boolean;
    forceCheck?: boolean;
    onClick: () => void;
}) {
    const isUnavailable = disabled || soldOut;
    const showCheck = forceCheck || (selected && !isUnavailable);
    const isGreen = forceCheck || (selected && !isUnavailable);
    return (
        <button
            type="button"
            disabled={isUnavailable}
            onClick={onClick}
            className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-150
                ${isUnavailable
                    ? 'border-border bg-secondary/40 opacity-60 cursor-not-allowed'
                    : selected
                        ? 'border-primary bg-primary/5 shadow-sm cursor-pointer'
                        : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/50 cursor-pointer'
                }`}
        >
            {/* Check indicator */}
            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                ${isGreen ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
                {showCheck && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </span>
            <span className="flex-1 min-w-0">
                <span className={`block font-semibold text-sm leading-tight ${isGreen ? 'text-primary' : 'text-foreground'}`}>
                    {label}
                </span>
                {soldOut
                    ? <span className="block text-xs text-red-500 font-bold mt-0.5">Ausverkauft</span>
                    : sublabel && <span className="block text-xs text-muted-foreground mt-0.5">{sublabel}</span>
                }
            </span>
        </button>
    );
}

export function KomboModal({ item, todayItems, soldOutNames = new Set(), isOpen, onClose, onAdd }: Props) {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
    const [selectedStarter, setSelectedStarter] = useState<string | null>(null);
    const [selectedMain, setSelectedMain] = useState<string | null>(null);

    if (!isOpen) return null;

    // Classify today's items
    const soup = todayItems.find(i => detectType(i) === 'soup');
    const salad = todayItems.find(i => detectType(i) === 'salad');
    const mains = todayItems.filter(i => detectType(i) === 'main');
    const dessert = todayItems.find(i => detectType(i) === 'dessert');

    // Availability checks
    const isSoupSoldOut = soup ? soldOutNames.has(soup.name) : true;
    const isSaladSoldOut = salad ? soldOutNames.has(salad.name) : true;
    const isDessertSoldOut = dessert ? soldOutNames.has(dessert.name) : false;
    const availableMains = mains.filter(m => !soldOutNames.has(m.name));
    const allStartersSoldOut = isSoupSoldOut && isSaladSoldOut;
    const allMainsSoldOut = availableMains.length === 0;

    const selectedOption = selectedOptionIdx !== null ? item.komboOptions[selectedOptionIdx] : null;

    // Determine if current option includes a starter (Salat/Suppe)
    const isStarterOption = selectedOption?.label.toLowerCase().includes('salat') ||
        selectedOption?.label.toLowerCase().includes('suppe');
    // Determine if current option includes dessert
    const isDessertOption = selectedOption?.label.toLowerCase().includes('dessert');

    // An option in Step 1 is disabled if all its required components are sold out
    const isOptionDisabled = (optLabel: string) => {
        const label = optLabel.toLowerCase();
        const needsStarter = label.includes('salat') || label.includes('suppe');
        const needsDessert = label.includes('dessert');
        if (allMainsSoldOut) return true;
        if (needsStarter && allStartersSoldOut) return true;
        if (needsDessert && isDessertSoldOut) return true;
        return false;
    };

    // Main size: L for Big Lunch when selecting main
    const mainSize = item.prices.L ? 'L' : 'S';

    const canProceedStep1 = selectedOptionIdx !== null;
    const canConfirm = selectedMain !== null &&
        (!isStarterOption || selectedStarter !== null) &&
        (!isDessertOption || !isDessertSoldOut);

    const handleClose = () => {
        setStep(1);
        setSelectedOptionIdx(null);
        setSelectedStarter(null);
        setSelectedMain(null);
        onClose();
    };

    const handleConfirm = () => {
        if (!canConfirm) return;

        // Build descriptive name
        let nameParts: string[] = [];
        if (isStarterOption && selectedStarter) nameParts.push(selectedStarter);
        if (selectedMain) nameParts.push(selectedMain);
        if (isDessertOption && dessert) nameParts.push(dessert.name);

        const cartItem = {
            ...item,
            name: `${item.name} – ${nameParts.join(' + ')}`,
            komboOptions: undefined, // not needed in cart
        };

        onAdd(cartItem, 'S');
        handleClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
                onClick={handleClose}
            />

            {/* Modal — centered on md+, bottom sheet on mobile */}
            <div className="fixed z-50 inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center p-0 md:p-4 animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-200">
                <div className="bg-card w-full md:max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden">

                    {/* Header */}
                    <div className="px-6 pt-5 pb-4 border-b border-border shrink-0">
                        {/* Drag handle (mobile) */}
                        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4 md:hidden" />

                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="font-sans font-bold text-xl text-foreground leading-tight">
                                    {item.name}
                                </h2>
                                <p className="text-sm text-primary font-semibold mt-0.5">
                                    € {item.prices.S?.toFixed(2).replace('.', ',')}
                                    {item.savings && <span className="ml-2 text-xs text-muted-foreground font-normal">spare {item.savings}</span>}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Step progress */}
                        <div className="flex items-center gap-2 mt-4">
                            <div className={`flex items-center gap-1.5 text-xs font-bold ${step === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-primary text-white' : 'bg-primary/20 text-primary'}`}>1</span>
                                Kombo wählen
                            </div>
                            <div className="flex-1 h-px bg-border" />
                            <div className={`flex items-center gap-1.5 text-xs font-bold ${step === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-primary text-white' : 'bg-border text-muted-foreground'}`}>2</span>
                                Gerichte wählen
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">

                        {step === 1 && (
                            <>
                                <p className="text-sm text-muted-foreground font-medium mb-4">Welche Kombination möchtest du?</p>
                                {item.komboOptions.map((opt, idx) => (
                                    <SelectCard
                                        key={idx}
                                        label={opt.label}
                                        selected={selectedOptionIdx === idx}
                                        disabled={isOptionDisabled(opt.label)}
                                        sublabel={isOptionDisabled(opt.label) ? 'Nicht verfügbar' : undefined}
                                        onClick={() => !isOptionDisabled(opt.label) && setSelectedOptionIdx(idx)}
                                    />
                                ))}
                            </>
                        )}

                        {step === 2 && selectedOption && (
                            <>
                                {/* Starter section */}
                                {isStarterOption && (
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Vorspeise wählen</p>
                                        <div className="space-y-2">
                                            {salad && (
                                                <SelectCard
                                                    label={salad.name}
                                                    selected={selectedStarter === salad.name}
                                                    soldOut={isSaladSoldOut}
                                                    onClick={() => !isSaladSoldOut && setSelectedStarter(salad.name)}
                                                />
                                            )}
                                            {soup && (
                                                <SelectCard
                                                    label={soup.name}
                                                    selected={selectedStarter === soup.name}
                                                    soldOut={isSoupSoldOut}
                                                    onClick={() => !isSoupSoldOut && setSelectedStarter(soup.name)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Main section */}
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Hauptgericht wählen</p>
                                    <div className="space-y-2">
                                        {mains.map(m => (
                                            <SelectCard
                                                key={m.id}
                                                label={m.name}
                                                sublabel={m.tags?.join(', ') || undefined}
                                                selected={selectedMain === m.name}
                                                soldOut={soldOutNames.has(m.name)}
                                                onClick={() => !soldOutNames.has(m.name) && setSelectedMain(m.name)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Dessert (fixed, read-only) */}
                                {isDessertOption && dessert && (
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Dessert</p>
                                        <SelectCard
                                            label={dessert.name}
                                            sublabel={isDessertSoldOut ? undefined : 'Inklusive'}
                                            soldOut={isDessertSoldOut}
                                            selected={!isDessertSoldOut}
                                            forceCheck={!isDessertSoldOut}
                                            disabled={true}
                                            onClick={() => { }}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-border bg-background shrink-0 flex gap-3">
                        {step === 2 && (
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Zurück
                            </button>
                        )}

                        {step === 1 && (
                            <button
                                disabled={!canProceedStep1}
                                onClick={() => setStep(2)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors cursor-pointer"
                            >
                                Weiter
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}

                        {step === 2 && (
                            <button
                                disabled={!canConfirm}
                                onClick={handleConfirm}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors cursor-pointer"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Hinzufügen · € {item.prices.S?.toFixed(2).replace('.', ',')}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

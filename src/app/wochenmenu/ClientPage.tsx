'use client';

import { useState } from 'react';

const days = [
    { key: "monday", label: "Montag" },
    { key: "tuesday", label: "Dienstag" },
    { key: "wednesday", label: "Mittwoch" },
    { key: "thursday", label: "Donnerstag" },
    { key: "friday", label: "Freitag" },
];

export default function WochenmenuClient({ weeklyMenu }: { weeklyMenu: Record<string, any> }) {
    const [activeDay, setActiveDay] = useState<string>('monday');

    const currentMenu = weeklyMenu[activeDay];

    const renderBadge = (dietary: string[]) => {
        if (!dietary) return null;
        if (dietary.includes('veg')) {
            return <span className="px-3 py-1.5 rounded-full bg-[#059669] text-white text-[0.8rem] font-bold leading-none inline-flex items-center justify-center">VEGGIE</span>;
        }
        if (dietary.includes('vg')) {
            return <span className="px-3 py-1.5 rounded-full bg-[#0d9488] text-white text-[0.8rem] font-bold leading-none inline-flex items-center justify-center">VEG</span>;
        }
        if (dietary.includes('gf')) {
            return <span className="px-3 py-1.5 rounded-full bg-[#fbbf24] text-black text-[0.8rem] font-bold leading-none inline-flex items-center justify-center">GF</span>;
        }
        if (dietary.includes('lf')) {
            return <span className="px-3 py-1.5 rounded-full bg-[#7dd3fc] text-black text-[0.8rem] font-bold leading-none inline-flex items-center justify-center">LF</span>;
        }
        return null;
    };

    const renderItem = (item: any, idx?: number) => {
        if (!item || !item.name) return null;
        return (
            <div key={item.id || idx} className="bg-transparent border-none w-full h-full">
                <div className="pt-2 pb-4 pr-0 pl-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-[1.25rem] font-semibold text-[#131318] m-0 leading-normal font-sans">{item.name}</h3>
                        <div className="flex gap-1 items-center">
                            {renderBadge(item.dietary || [])}
                        </div>
                    </div>
                    {item.description && (
                        <p className="text-[#131318] text-base font-normal mt-2 mb-2 leading-normal font-sans">
                            {item.description}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const hasMenu = currentMenu && currentMenu.starters;

    return (
        <main className="min-h-screen pt-12 bg-white pb-20 font-sans">
            <div className="w-[66.666667%] mx-auto max-md:w-full px-4">

                <div className="text-center mb-8">
                    <h1 className="text-[2rem] md:text-[3rem] font-bold text-[#131318] text-center mb-0">
                        Wochenmenü
                    </h1>
                </div>

                {/* Desktop Tabs */}
                <div className="hidden md:grid grid-cols-5 bg-[#E4F1EA] rounded-md mb-8 p-1">
                    {days.map(day => (
                        <button
                            key={day.key}
                            onClick={() => setActiveDay(day.key)}
                            className={`py-3 px-4 rounded text-center border-none font-medium cursor-pointer transition-all duration-200 ${activeDay === day.key
                                ? 'bg-[#6cb78e] text-white'
                                : 'bg-transparent text-[#131318] hover:bg-white'
                                }`}
                        >
                            {day.label}
                        </button>
                    ))}
                </div>

                {/* Mobile Select */}
                <div className="md:hidden mb-8">
                    <select
                        value={activeDay}
                        onChange={(e) => setActiveDay(e.target.value)}
                        className="w-full p-4 bg-[#E4F1EA] border-none rounded-md font-medium text-[#131318] focus:ring-2 focus:ring-[#6cb78e] outline-none"
                    >
                        {days.map(day => (
                            <option key={day.key} value={day.key}>{day.label}</option>
                        ))}
                    </select>
                </div>

                {/* Menu Content */}
                {!hasMenu ? (
                    <div className="text-center font-bold text-[#131318] py-12">
                        Kein Menü für diesen Tag verfügbar.
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="text-center text-[2rem] font-bold text-[#131318] mb-8 font-sans">
                            {days.find(d => d.key === activeDay)?.label}smenü
                        </div>

                        {/* Starters */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-[1.5rem] font-bold text-[#131318] flex items-center gap-2 m-0">Starters</h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#131318] font-normal text-base uppercase">Klein <strong>€4.90</strong></span>
                                    <span className="text-[#131318] font-bold text-base">/</span>
                                    <span className="text-[#131318] font-normal text-base uppercase">Gross <strong>€6.90</strong></span>
                                </div>
                            </div>
                            <div className="border-t border-[#e5e7eb] mb-2"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {currentMenu.starters?.map((i: any, idx: number) => renderItem(i, idx))}
                            </div>
                        </div>

                        {/* Salad */}
                        {currentMenu.salad && currentMenu.salad.name && (
                            <div className="mb-12">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-[1.5rem] font-bold text-[#131318] flex items-center gap-2 m-0">Saladbowl</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#131318] font-normal text-base uppercase">Klein <strong>€7.50</strong></span>
                                        <span className="text-[#131318] font-bold text-base">/</span>
                                        <span className="text-[#131318] font-normal text-base uppercase">Gross <strong>€10.90</strong></span>
                                    </div>
                                </div>
                                <div className="border-t border-[#e5e7eb] mb-2"></div>
                                <div className="w-full">
                                    {renderItem(currentMenu.salad)}
                                </div>
                            </div>
                        )}

                        {/* Mains */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-[1.5rem] font-bold text-[#131318] flex items-center gap-2 m-0">Main Dish</h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#131318] font-normal text-base uppercase">Klein <strong>€7.50</strong></span>
                                    <span className="text-[#131318] font-bold text-base">/</span>
                                    <span className="text-[#131318] font-normal text-base uppercase">Gross <strong>€11.90</strong></span>
                                </div>
                            </div>
                            <div className="border-t border-[#e5e7eb] mb-2"></div>

                            <div className="mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {currentMenu.meatMains?.map((i: any, idx: number) => renderItem(i, idx))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {currentMenu.vegetarianMains?.map((i: any, idx: number) => renderItem(i, idx))}
                                </div>
                            </div>
                        </div>

                        {/* Dessert */}
                        {currentMenu.dessert && currentMenu.dessert.name && (
                            <div className="mb-12">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-[1.5rem] font-bold text-[#131318] flex items-center gap-2 m-0">Dessert</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#131318] font-normal text-base uppercase"><strong>€4.50</strong></span>
                                    </div>
                                </div>
                                <div className="border-t border-[#e5e7eb] mb-2"></div>
                                <div className="w-full">
                                    {renderItem(currentMenu.dessert)}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </main>
    );
}

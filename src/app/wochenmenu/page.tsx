'use client';

import { useState } from 'react';
import Link from 'next/link';

const weeklyMenu = {
  "monday": {
    "starters": [
      { "id": "mon-s1", "name": "Kürbiscremesuppe", "description": "L, M, O", "dietary": ["veg"] },
      { "id": "mon-s2", "name": "", "description": "", "dietary": [] }
    ],
    "salad": { "id": "mon-sal", "name": "Haussalat", "description": "", "dietary": ["veg"] },
    "meatMains": [
      { "id": "mon-m1", "name": "Bœuf Bourguignon", "description": "mit Spätzle (G, L, M, U)", "dietary": [] },
      { "id": "mon-m2", "name": "Indisches Tandoori Chicken in cremiger Gewürzsauce", "description": "mit Bamatireis (E, F, H, L, M, N, O)", "dietary": [] }
    ],
    "vegetarianMains": [
      { "id": "mon-v1", "name": "Kürbis-Feta Gratin mit Spinat & überbackenem Käse", "description": "(G, L, M)", "dietary": ["veg"] },
      { "id": "mon-v2", "name": "Käsespätzle aus dem Ofen mit geriebenem Bergkäse mit grünem Salat", "description": "(A, C, G, L, M, O)", "dietary": ["veg"] }
    ],
    "dessert": { "id": "mon-d", "name": "Erdbeer-Joghurt Schnitte", "description": "self-made", "dietary": ["veg"] }
  },
  "tuesday": {
    "starters": [
      { "id": "tue-s1", "name": "Erdäpfelcremsuppe", "description": "", "dietary": ["veg"] },
      { "id": "tue-s2", "name": "", "description": "", "dietary": [] }
    ],
    "salad": { "id": "tue-sal", "name": "Haussalat", "description": "", "dietary": ["veg"] },
    "meatMains": [
      { "id": "tue-m1", "name": "Schupfnudeln with Hühnerstreifen in Kirschtomatensauce & grünem Salat", "description": "(A, G, L)", "dietary": [] },
      { "id": "tue-m2", "name": "Zartes Kalbsrahmgulasch in Paprika-Oberssauce", "description": "mit Semmelknödel & Sauerrahm Dip (G, L, M, O)", "dietary": [] }
    ],
    "vegetarianMains": [
      { "id": "tue-v1", "name": "Erdäpfel-Walnuss Gratin mit Mozzarella, Spinat & grünem Salat", "description": "(A, G, H, L, M, O)", "dietary": ["veg"] },
      { "id": "tue-v2", "name": "Tomaten Mozzarella Lasagne mit Bechamelsauce & grünem Salat", "description": "(A, G, H, L, M, O)", "dietary": ["veg"] }
    ],
    "dessert": { "id": "tue-d", "name": "Erdbeer-Joghurt Schnitte", "description": "self-made", "dietary": ["veg"] }
  },
  "wednesday": {
    "starters": [
      { "id": "wed-s1", "name": "Karottencremesuppe", "description": "G, L, M, O", "dietary": ["veg"] },
      { "id": "wed-s2", "name": "Haussalat", "description": "", "dietary": ["veg"] }
    ],
    "salad": { "id": "wed-sal", "name": "", "description": "", "dietary": [] },
    "meatMains": [
      { "id": "wed-m1", "name": "Lasagne Bolognese mit Fleischragout, Bechamelsauce & grünem Salat", "description": "(A, C, G, L, M, O)", "dietary": [] },
      { "id": "wed-m2", "name": "Paprikahühnchen in cremiger Rahmsauce & Sauerrahm Dip", "description": "mit Spätzle (A, C, G, L, M, O)", "dietary": [] }
    ],
    "vegetarianMains": [
      { "id": "wed-v1", "name": "Balsamico Linsen mit Sauerrahm Dip", "description": "mit Semmelknödel (G, L)", "dietary": ["veg"] },
      { "id": "wed-v2", "name": "Griechisches Veggie Moussaka mit mediterranem Gemüse & grünem Salat", "description": "(A, G, L, M, O)", "dietary": ["veg"] }
    ],
    "dessert": { "id": "wed-d", "name": "Erdbeer-Joghurt Schnitte", "description": "self-made", "dietary": ["veg"] }
  },
  "thursday": {
    "starters": [
      { "id": "thu-s1", "name": "Paprika-Zucchinisuppe", "description": "L, M, O", "dietary": ["veg"] },
      { "id": "thu-s2", "name": "Haussalat", "description": "", "dietary": ["veg"] }
    ],
    "salad": { "id": "thu-sal", "name": "", "description": "", "dietary": [] },
    "meatMains": [
      { "id": "thu-m1", "name": "Chicken-Stroganoff in Senf-Rahmsauce mit Waldpilzen & Sauerrahm Dip", "description": "mit Lankornreis (G, L, M, O)", "dietary": [] },
      { "id": "thu-m2", "name": "Burritos Chili Con Carne mit Avocado-Guacamole, überbackenem Käse & grünem Salat", "description": "(A, G, L, M, O)", "dietary": [] }
    ],
    "vegetarianMains": [
      { "id": "thu-v1", "name": "Rote Rüben-Erdäpfel Gratin mit Feta, Walnüssen & grünem Salat", "description": "(G, L, M, O)", "dietary": ["veg"] },
      { "id": "thu-v2", "name": "Steinpilz Gnocchi in Parmesansauce mit Ruccola & grünem Salat", "description": "(A, C, G, L, M, O)", "dietary": ["veg"] }
    ],
    "dessert": { "id": "thu-d", "name": "Erdbeer-Joghurt Schnitte", "description": "self-made", "dietary": ["veg"] }
  },
  "friday": {
    "starters": [
      { "id": "fri-s1", "name": "Süßkartoffel-Ingwercremesuppe", "description": "G, L, M, O", "dietary": ["veg"] },
      { "id": "fri-s2", "name": "Haussalat", "description": "", "dietary": ["veg"] }
    ],
    "salad": { "id": "fri-sal", "name": "", "description": "", "dietary": [] },
    "meatMains": [
      { "id": "fri-m1", "name": "Alt Wiener Schinkenfleckerl mit grünem Salat & Sauerrahm Dip", "description": "(A, C, G, L, M, O)", "dietary": [] },
      { "id": "fri-m2", "name": "", "description": "", "dietary": [] }
    ],
    "vegetarianMains": [
      { "id": "fri-v1", "name": "Lasagne Kürbis-Ricotta mit grünem Salat", "description": "(G, L, M)", "dietary": ["veg"] },
      { "id": "fri-v2", "name": "Grünes Curry mit Süßkartoffeln in Kokossauce", "description": "mit Basmatireis (A, G, L)", "dietary": ["veg"] }
    ],
    "dessert": { "id": "fri-d", "name": "Erdbeer-Joghurt Schnitte", "description": "self-made", "dietary": ["veg"] }
  }
};

const days = [
  { key: "monday", label: "Montag" },
  { key: "tuesday", label: "Dienstag" },
  { key: "wednesday", label: "Mittwoch" },
  { key: "thursday", label: "Donnerstag" },
  { key: "friday", label: "Freitag" },
];

export default function WochenmenuPage() {
  const [activeDay, setActiveDay] = useState<keyof typeof weeklyMenu>('monday');
  
  const currentMenu = weeklyMenu[activeDay];

  const renderBadge = (dietary: string[]) => {
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

  const renderItem = (item: any) => {
    if (!item.name) return null;
    return (
      <div key={item.id} className="bg-transparent border-none w-full h-full">
        <div className="pt-2 pb-4 pr-0 pl-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-[1.25rem] font-semibold text-[#131318] m-0 leading-normal font-sans">{item.name}</h3>
            <div className="flex gap-1 items-center">
              {renderBadge(item.dietary)}
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

  return (
    <main className="min-h-screen pt-32 bg-white pb-20 font-sans">
      <div className="w-[66.666667%] mx-auto max-md:w-full px-4">
        
        <div className="text-center mb-8">
          <h1 className="text-[2rem] md:text-[3rem] font-bold text-[#131318] text-center mb-0">
            Wochenmenü
          </h1>
          <p className="text-[#131318] text-[1rem] font-semibold mt-1 mb-8 text-center">
            (16.3.2026 - 20.3.2026)
          </p>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:grid grid-cols-5 bg-[#E4F1EA] rounded-md mb-8 p-1">
          {days.map(day => (
            <button
              key={day.key}
              onClick={() => setActiveDay(day.key as keyof typeof weeklyMenu)}
              className={`py-3 px-4 rounded text-center border-none font-medium cursor-pointer transition-all duration-200 ${
                activeDay === day.key 
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
            onChange={(e) => setActiveDay(e.target.value as keyof typeof weeklyMenu)}
            className="w-full p-4 bg-[#E4F1EA] border-none rounded-md font-medium text-[#131318] focus:ring-2 focus:ring-[#6cb78e] outline-none"
          >
            {days.map(day => (
              <option key={day.key} value={day.key}>{day.label}</option>
            ))}
          </select>
        </div>

        {/* Menu Content */}
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
              {currentMenu.starters.map(renderItem)}
            </div>
          </div>

          {/* Salad */}
          {currentMenu.salad.name && (
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
                {currentMenu.meatMains.map(renderItem)}
              </div>
            </div>
            
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentMenu.vegetarianMains.map(renderItem)}
              </div>
            </div>
          </div>

          {/* Dessert */}
          {currentMenu.dessert.name && (
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

      </div>
    </main>
  );
}
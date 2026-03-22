'use client';

import { useState } from 'react';

const accordionItems = [
  {
    title: 'Corporate',
    content: 'Business Lunch, Teamfeier oder Office-Eröffnung – wir liefern unkompliziert, pünktlich und mit Stil.',
    image: '/images/squarespace/00c81532-dd48-4732-8291-09f753044669_dish_01.jpg',
  },
  {
    title: 'Veranstaltungen und Feiern',
    content: 'Wir sind bestrebt, Ihre Erwartungen zu übertreffen, indem wir für jeden Anlass hochwertige, frische und gesunde Speisen anbieten. Sie können darauf vertrauen, dass Ihre Veranstaltung in zuverlässigen Händen ist.',
    image: '/images/squarespace/1751884101489-ULY41VQVSJ3W6KTYMUKS_pexels-abie-zerosix-441402-1748865.jpg',
  },
  {
    title: 'Ganztagsevents',
    content: 'Von Brunch bis Dinner - ganztägiges Catering, das den Tag rund macht. Und die Gäste glücklich.',
    image: '/images/squarespace/00c81532-dd48-4732-8291-09f753044669_dish_01.jpg',
  },
];

const testimonials = [
  {
    quote: '\u201eDer Geburtstag meiner Tochter war ein Traum. Das Essen war ein Highlight – wunderschön angerichtet und richtig lecker.\u201c',
    name: 'Maria Gruber',
    image: '/images/squarespace/2e0680c7-b85a-40b5-87e8-8764db4e49b8_pexels-rdne-8384330.jpg',
    align: 'left' as const,
  },
  {
    quote: 'Unsere Hochzeit war perfekt! Das Essen war fantastisch, die Präsentation wunderschön – unsere Gäste reden heute noch darüber.',
    name: 'Dominik and Anna',
    image: '/images/squarespace/1751884101489-ULY41VQVSJ3W6KTYMUKS_pexels-abie-zerosix-441402-1748865.jpg',
    align: 'right' as const,
  },
  {
    quote: '\u201eUnser Familienfest war ein voller Erfolg. Topf & Deckel hat alle Ernährungswünsche berücksichtigt – Service und Essen waren top!\u201c',
    name: 'Johanna Bauer',
    image: '/images/squarespace/1751884101513-YA9G989BP5EU4G38LD8J_unsplash-image-L8kMx3rzt7s.jpg',
    align: 'left' as const,
  },
];

const galleryImages = [
  '/images/squarespace/1751884094283-EHBVF808MHOR0JDSOI9W_pexels-navada-ra-628779-1703272.jpg',
  '/images/squarespace/45c79e90-9a9b-4e2f-bbb9-72182bcaee6e_pexels-alesiakozik-6632286.jpg',
  '/images/squarespace/1751884094308-I9TFPMV6JSK1M4HK40W6_pexels-alesiakozik-6544378.jpg',
  '/images/squarespace/1751884094300-YF4ILTUWQ30H18BEG76L_pexels-ella-olsson-572949-3026801.jpg',
  '/images/squarespace/1751884094316-55GI81S6YTQKTYUFPCZ3_pexels-sydney-troxell-223521-718742.jpg',
  '/images/squarespace/1751884094322-6F2RKF5Y0WMC7W3KIMYG_pexels-roman-odintsov-5150558.jpg',
];

const foodGallery = [
  '/images/squarespace/31116196-502d-4cd8-bca0-85f5e92f6d99_events-and-parties_03.jpg',
  '/images/squarespace/1762352009897-CWFBJN9BF7K35OKPBKNH_events-and-parties_01.jpg',
  '/images/squarespace/8b5e16ee-fae6-43cf-9e8d-f0994d7c25f7_events-and-parties_04.jpg',
  '/images/squarespace/9b8daee5-7f19-4751-97fb-54d896468eb9_events-and-parties_02.jpg',
];

export default function EventsPartysPage() {
  const [openAccordion, setOpenAccordion] = useState<number>(-1);

  return (
    <main className="min-h-screen bg-white font-body">

      {/* ═══ HERO ═══ */}
      <section className="relative h-[45vh] min-h-[280px] w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video src="/video/catering-events.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-white text-4xl sm:text-5xl md:text-[56px] font-sans font-extrabold tracking-tight drop-shadow-md leading-[1.15]">
            Catering, das Eindruck hinterlässt. Und schmeckt.
          </h1>
        </div>
      </section>

      {/* ═══ INTRO ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-[40px] font-sans font-bold text-[#6CB78E] mb-6 leading-tight">
            Individuelles Event-Catering – frisch, flexibel, besonders.
          </h2>
          <p className="text-lg md:text-xl text-[#2C2C2C] leading-relaxed">
            Von bunten Bowls bis zu vollwertigen Hauptgerichten: Unser Catering bringt Geschmack, Freude und Leichtigkeit in jedes Event.
          </p>
        </div>
      </section>

      {/* ═══ 3-COLUMN ACCORDION ═══ */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accordionItems.map((item, i) => (
              <div key={i} className="flex flex-col">
                <div className="relative overflow-hidden rounded-sm mb-4" style={{ height: '400px' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="border-t border-b border-[#2C2C2C]">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-lg font-sans font-bold text-[#2C2C2C]">
                      {item.title}
                    </span>
                    <span className="text-2xl text-[#2C2C2C] font-light leading-none">
                      {openAccordion === i ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openAccordion === i ? 'max-h-40 pb-4' : 'max-h-0'}`}
                  >
                    <p className="text-[#555] text-base leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl text-[#2C2C2C] leading-relaxed mb-8">
            Ob kleines Fest oder große Feier. Wir schaffen kulinarische Erlebnisse, die im Gedächtnis bleiben – damit du selbst Gast auf deinem eigenen Event sein kannst.
          </p>
          <a
            href="#events-partys-form"
            className="inline-block bg-[#2C2C2C] hover:bg-[#444] text-white font-sans font-bold text-sm uppercase tracking-widest px-10 py-4 transition-colors duration-300"
          >
            Anfrage Senden
          </a>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-24 px-4 bg-[#e4ede8]">
        <div className="max-w-5xl mx-auto space-y-20">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${t.align === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-28 h-28 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <blockquote className="text-[#2C2C2C] text-2xl md:text-3xl font-sans font-bold leading-snug mb-4">
                  {t.quote}
                </blockquote>
                <p className="text-[#555] text-base">
                  {t.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FOOD GALLERY ═══ */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aspect-square overflow-hidden">
              <img src={foodGallery[0]} alt="Food spread 1" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-6">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={foodGallery[1]} alt="Food spread 2" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[4/3] overflow-hidden">
                <img src={foodGallery[3]} alt="Food spread 4" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="aspect-square overflow-hidden">
              <img src={foodGallery[2]} alt="Food spread 3" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT FORM ═══ */}
      <section id="events-partys-form" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-accent font-bold italic text-center text-[#6CB78E] mb-4 leading-tight">
            Lust auf gutes Catering?
          </h2>
          <p className="text-center text-[#2C2C2C] text-lg mb-10">
            Sag uns, was du planst – wir melden uns in Kürze mit einem individuellen Vorschlag zurück.
          </p>
          <div className="bg-[#e8f0ec] rounded-2xl p-8 md:p-10">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const subject = encodeURIComponent('Events & Partys Anfrage');
                const body = encodeURIComponent(
                  `Name: ${formData.get('firstName')} ${formData.get('lastName')}\nE-Mail: ${formData.get('email')}\nAnzahl Gäste: ${formData.get('guests')}\n\nNachricht:\n${formData.get('message')}`
                );
                window.location.href = `mailto:info@topfdeckel.at?subject=${subject}&body=${body}`;
              }}
            >
              {/* Namen */}
              <div>
                <p className="text-sm font-sans font-bold text-[#2C2C2C] mb-3">Namen</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#555] mb-1">Vorname <span className="text-[#999]">(erforderlich)</span></label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      className="w-full border-0 border-b-2 border-[#ccc] bg-[#f5f9f7] px-3 py-2.5 text-base focus:outline-none focus:border-[#6CB78E] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#555] mb-1">Nachname <span className="text-[#999]">(erforderlich)</span></label>
                    <input
                      name="lastName"
                      type="text"
                      required
                      className="w-full border-0 border-b-2 border-[#ccc] bg-[#f5f9f7] px-3 py-2.5 text-base focus:outline-none focus:border-[#6CB78E] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-sans font-bold text-[#2C2C2C] mb-1">Email <span className="text-[#999] font-normal">(erforderlich)</span></label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full border-0 border-b-2 border-[#ccc] bg-[#f5f9f7] px-3 py-2.5 text-base focus:outline-none focus:border-[#6CB78E] transition-colors"
                />
              </div>

              {/* Wie viele Gäste? */}
              <div>
                <label className="block text-sm font-sans font-bold text-[#2C2C2C] mb-1">Wie viele Gäste? <span className="text-[#999] font-normal">(erforderlich)</span></label>
                <select
                  name="guests"
                  required
                  className="w-full border-0 border-b-2 border-[#ccc] bg-[#f5f9f7] px-3 py-2.5 text-base focus:outline-none focus:border-[#6CB78E] transition-colors appearance-none"
                  defaultValue=""
                >
                  <option value="" disabled>Auswählen</option>
                  <option value="10-25">10–25 Personen</option>
                  <option value="25-50">25–50 Personen</option>
                  <option value="50-100">50–100 Personen</option>
                  <option value="100-200">100–200 Personen</option>
                  <option value="200+">200+ Personen</option>
                </select>
              </div>

              {/* Nachricht */}
              <div>
                <label className="block text-sm font-sans font-bold text-[#2C2C2C] mb-1">Nachricht</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Sag' uns was du brauchst oder stell' uns eine Frage..."
                  className="w-full border-0 border-b-2 border-[#ccc] bg-[#f5f9f7] px-3 py-2.5 text-base focus:outline-none focus:border-[#6CB78E] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2C2C2C] hover:bg-[#6CB78E] text-white font-sans font-bold text-sm uppercase tracking-widest py-4 transition-colors duration-300"
              >
                Anfrage abschicken
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══ INSTAGRAM GRID ═══ */}
      <section className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {galleryImages.map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden">
              <img
                src={src}
                alt={`Food ${i + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
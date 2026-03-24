'use client';

import { useState } from 'react';

const accordionSteps = [
  {
    title: 'Erstgespräch',
    content: 'Wir hören zu, lernen euer Team kennen und klären Wünsche & Bedürfnisse.',
  },
  {
    title: 'Kostenloses Probeessen',
    content: 'Wir kommen für ein unverbindliches Test-Tasting direkt zu euch ins Office und verwöhnen 4–5 Personen aus eurem Team mit unseren Highlights.',
  },
  {
    title: 'Wählt euer Lieblingspaket',
    content: 'Zwei Pakete, perfekt zugeschnitten auf euren Bedarf.',
  },
  {
    title: 'Wir kochen & liefern',
    content: 'Frisch gekocht, heiß geliefert – pünktlich ins Büro.',
  },
  {
    title: 'Genießen & wiederholen',
    content: 'Eure Leute essen besser – und kommen gern wieder.',
  },
];

const testimonials = [
  {
    quote: '\u201eSeit wir Topf & Deckel nutzen, gibt\u2019s keine hektischen Last-Minute-Bestellungen mehr!\u201c',
    name: 'Chris',
    role: 'Operations Lead, CSGPT.AI',
    image: '/images/squarespace/e9221165-4bb8-4b50-a696-47d2eeba8516_chris-operations-lead.jpg',
    align: 'right' as const,
  },
  {
    quote: '\u201eZuverlässig, gesund, leistbar – genau das, was wir gebraucht haben.\u201c',
    name: 'Diana',
    role: 'Office Managerin, GoStudent',
    image: '/images/squarespace/8c509bdf-6216-45c6-9161-025d59c018c8_02_iana-office-managerin-office-delivery.jpg',
    align: 'left' as const,
  },
  {
    quote: '\u201eWie ein Mini-Teamevent jede Woche – das Essen bringt alle an einen Tisch.\u201c',
    name: 'Rali',
    role: 'Community & Product, FutureChamps',
    image: '/images/squarespace/306a9b08-e32f-413b-8cd5-ed564a82431e_rali-community-and-product.jpg',
    align: 'right' as const,
  },
];

const solutions = [
  { title: 'Frisch & lecker', desc: 'Täglich gekocht, mit echten Zutaten. Keine Tricks, kein Mist.' },
  { title: 'Stressfrei & ohne Aufwand', desc: 'Zuverlässig, pünktlich – Lieferung inklusive.' },
  { title: 'Individuell angepasst', desc: 'Ob 15 oder 100 Personen – wir passen uns euch an.' },
  { title: 'StoreFive Bonus', desc: '5% Extra-Vorteil für eure Mitarbeitenden in allen unseren Filialen.' },
  { title: 'Fair kalkuliert', desc: 'Gesunde Office-Lunches, die leistbar bleiben.' },
  { title: 'Team-Building, das schmeckt', desc: 'Gutes Essen hebt die Stimmung, gibt Energie und stärkt den Teamgeist.' },
];

const instagramImages = [
  '/images/squarespace/1751884094283-EHBVF808MHOR0JDSOI9W_pexels-navada-ra-628779-1703272.jpg',
  '/images/squarespace/45c79e90-9a9b-4e2f-bbb9-72182bcaee6e_pexels-alesiakozik-6632286.jpg',
  '/images/squarespace/1751884094308-I9TFPMV6JSK1M4HK40W6_pexels-alesiakozik-6544378.jpg',
  '/images/squarespace/1751884094300-YF4ILTUWQ30H18BEG76L_pexels-ella-olsson-572949-3026801.jpg',
  '/images/squarespace/1751884094316-55GI81S6YTQKTYUFPCZ3_pexels-sydney-troxell-223521-718742.jpg',
  '/images/squarespace/1751884094322-6F2RKF5Y0WMC7W3KIMYG_pexels-roman-odintsov-5150558.jpg',
];

export default function OfficeCateringPage() {
  const [openAccordion, setOpenAccordion] = useState<number>(0);

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
            Wohlfühl-Lunch fürs Office.<br />Frisch &amp; gesund.
          </h1>
        </div>
      </section>

      {/* ═══ INTRO ═══ */}
      <section className="pt-20 pb-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[2.8rem] font-sans font-bold text-[#6CB78E] mb-6 leading-[1.5em]">
            Gutes Essen für bessere Arbeitstage.
          </h2>
          <p className="text-[1.43rem] text-[#2C2C2C] leading-[1.5em]">
            Dein Team verdient mehr als Snacks und Schnelllösungen. Wir liefern täglich frisch gekochte Mahlzeiten direkt ins Büro – voll Geschmack, ohne Kompromisse.
          </p>
        </div>
      </section>

      {/* ═══ PAIN POINTS ═══ */}
      <section className="pt-6 pb-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-[2rem] font-sans font-bold text-center text-[#6CB78E] mb-12 leading-[1.5em]">
            Was ohne uns schiefläuft?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Zeitverlust', text: '30 Minuten Mittagssuche pro Tag? Muss nicht sein.' },
              { title: 'Schlechte Ernährung', text: 'Fast Food macht müde. Unsere Gerichte machen wach.' },
              { title: 'Wenig Motivation', text: 'Essen verbindet – schlechte Optionen frustrieren.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src="/images/squarespace/0a909979-4f07-4ca8-9e9a-ef68e03148a9_cross_coloured.png"
                    className="w-[29px] h-[29px] flex-shrink-0"
                    alt="X"
                  />
                  <h4 className="text-[1.4rem] font-sans font-bold text-black leading-[1.5em]">{item.title}</h4>
                </div>
                <p className="text-[1.43rem] text-[#131318] leading-[1.5em]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOLUTIONS ═══ */}
      <section className="pt-16 pb-[95px] bg-[#e4f1ea] overflow-hidden">
        {/* Content + image share the same 78.1% wide centred column */}
        <div className="w-[78.1%] mx-auto">
          <h2 className="font-sans font-bold text-center text-black mb-12 leading-[1.5em]">
            Wir lösen euer Mittagsproblem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8 mb-14">
            {solutions.map((item, i) => (
              <div key={i}>
                <p className="text-[1.43rem] font-bold text-black leading-[1.5em] mb-0">{item.title}</p>
                <p className="text-[1.43rem] text-black leading-[1.5em] font-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Promo image — same 78.1% width as text, flush at section bottom */}
        <div className="w-[78.1%] mx-auto block leading-[0]">
          <img
            src="/images/squarespace/2c488c18-fbeb-4a0a-a625-8bc30d25b955_Topf--Deckel-29.-30.7.2025-c-Nadja-Hudovernik_1-42.jpg"
            className="w-full object-cover block"
            style={{ height: 'clamp(180px, 24.9vw, 420px)' }}
            alt="Office Lunch"
          />
        </div>
      </section>


      {/* ═══ ACCORDION: SO EINFACH FUNKTIONIERT'S ═══ */}
      <section className="pt-14 pb-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left: Heading + Accordion */}
            <div>
              {/* H3 left-aligned, 33.28px = ~2.08rem */}
              <h3 className="font-sans font-bold text-left text-[#131318] mb-10 leading-[1.5em]"
                style={{ fontSize: '2.08rem' }}>
                So einfach funktioniert&apos;s
              </h3>
              <div>
                {accordionSteps.map((step, i) => (
                  <div key={i} className="border-t border-[#131318]">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      {/* H4 title: 22.912px = 1.43rem */}
                      <h4 className="font-sans font-bold text-[#131318] leading-[1.5em] mb-0"
                        style={{ fontSize: '1.43rem' }}>
                        {step.title}
                      </h4>
                      <span className="text-2xl text-[#131318] font-light leading-none flex-shrink-0 ml-4">
                        {openAccordion === i ? '−' : '+'}
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openAccordion === i ? 'max-h-48 pb-6' : 'max-h-0'}`}
                    >
                      {/* Description: 22.912px = 1.43rem, indented */}
                      <p className="text-[#131318] leading-[1.5em] pl-8"
                        style={{ fontSize: '1.43rem' }}>
                        {step.content}
                      </p>
                    </div>
                  </div>
                ))}
                {/* closing border line at bottom */}
                <div className="border-t border-[#131318]" />
              </div>
            </div>

            {/* Right: Two overlapping images + green accent */}
            {/* Live: lunchboxen top-right (behind), food bowls lower-left (in front) */}
            <div className="hidden md:block relative" style={{ height: '560px' }}>
              {/* Lunchboxen — top-right, BEHIND food bowls */}
              <img
                src="/images/squarespace/7858925c-641b-4da3-af58-24d1da5fec0e_Topf--Deckel-29.-30.7.2025-c-Nadja-Hudovernik_1-155-2.jpg"
                alt="Lunchboxen"
                className="absolute object-cover"
                style={{ right: '0px', top: '0px', width: '55%', height: '358px', zIndex: 1 }}
              />
              {/* Green L-bracket — between the two images at the junction */}
              <div className="absolute"
                style={{
                  left: '38%',
                  top: '150px',
                  width: '130px',
                  height: '220px',
                  borderTop: '15px solid rgb(108, 183, 142)',
                  borderRight: '15px solid rgb(108, 183, 142)',
                  zIndex: 2,
                }} />
              {/* Food bowls — lower-left, IN FRONT of lunchboxen */}
              <img
                src="/images/squarespace/89c50f2f-e5c2-4e68-839a-ce0ca819380f_Topf--Deckel-29.-30.7.2025-c-Nadja-Hudovernik_1-137.jpg"
                alt="Frisch gekochte Speisen"
                className="absolute object-cover"
                style={{ left: '0px', top: '165px', width: '55%', height: '397px', zIndex: 3 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-24 px-4 bg-[#7fb396]">
        <div className="max-w-5xl mx-auto space-y-20">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${t.align === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-28 h-28 rounded-full object-cover flex-shrink-0"
              />
              <div className={`${t.align === 'right' ? 'md:text-left' : 'md:text-left'}`}>
                <blockquote className="text-white text-2xl md:text-3xl font-sans font-bold leading-snug mb-4">
                  {t.quote}
                </blockquote>
                <p className="text-white/80 text-base">
                  {t.name} - {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CONTACT FORM ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-accent font-bold italic text-center text-[#6CB78E] mb-4 leading-tight">
            Kontaktiere uns
          </h2>
          <p className="text-center text-[#2C2C2C] text-lg mb-10">
            Wir bringen frisches, ehrliches Essen direkt in euer Office. Formular ausfüllen – wir melden uns.
          </p>
          <div className="bg-[#e8f0ec] rounded-2xl p-8 md:p-10">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const subject = encodeURIComponent('Office Catering Anfrage');
                const body = encodeURIComponent(
                  `Name: ${formData.get('firstName')} ${formData.get('lastName')}\nE-Mail: ${formData.get('email')}\nFirma: ${formData.get('firma')}\nTeamgröße: ${formData.get('teamSize')}\n\nNachricht:\n${formData.get('message')}`
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

              {/* Firma */}
              <div>
                <label className="block text-sm font-sans font-bold text-[#2C2C2C] mb-1">Firma</label>
                <input
                  name="firma"
                  type="text"
                  className="w-full border-0 border-b-2 border-[#ccc] bg-[#f5f9f7] px-3 py-2.5 text-base focus:outline-none focus:border-[#6CB78E] transition-colors"
                />
              </div>

              {/* Teamgröße */}
              <div>
                <label className="block text-sm font-sans font-bold text-[#2C2C2C] mb-1">Teamgröße</label>
                <select
                  name="teamSize"
                  className="w-full border-0 border-b-2 border-[#ccc] bg-[#f5f9f7] px-3 py-2.5 text-base focus:outline-none focus:border-[#6CB78E] transition-colors appearance-none"
                  defaultValue=""
                >
                  <option value="" disabled>Auswählen</option>
                  <option value="5-15">5–15 Personen</option>
                  <option value="15-30">15–30 Personen</option>
                  <option value="30-50">30–50 Personen</option>
                  <option value="50-100">50–100 Personen</option>
                  <option value="100+">100+ Personen</option>
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
      <section className="bg-white py-8 px-4 sm:px-8">
        <div className="flex gap-2 sm:gap-3 h-[200px] sm:h-[240px] overflow-hidden">
          {instagramImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Food ${i + 1}`}
              className="flex-1 min-w-0 h-full object-cover"
            />
          ))}
        </div>
      </section>

    </main>
  );
}
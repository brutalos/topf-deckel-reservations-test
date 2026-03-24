'use client';

import { useState } from 'react';

export default function FranchisePage() {
  const [formData, setFormData] = useState({
    vorname: '',
    nachname: '',
    email: '',
    handy: '',
    land: '',
    investmentkapital: '',
    location: '',
    warum: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Trigger mailto
    const subject = encodeURIComponent('Franchise Anfrage');
    const body = encodeURIComponent(
      `Name: ${formData.vorname} ${formData.nachname}\nE-Mail: ${formData.email}\nHandy: ${formData.handy}\nLand: ${formData.land}\nInvestmentkapital: ${formData.investmentkapital}\nGewünschte Location: ${formData.location}\nWarum Topf & Deckel:\n${formData.warum}`
    );
    window.location.href = `mailto:info@topfdeckel.at?subject=${subject}&body=${body}`;

    // Simulate form submission to show success state
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-white font-body">
      {/* ─── Hero Video Section ─── */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video
            src="/video/jobs-franchise.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-white font-extrabold tracking-tight drop-shadow-md leading-[1.1]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Bring gutes Essen in deine Neighbourhood.
          </h1>
        </div>
      </section>

      {/* ─── Warum Menschen Topf & Deckel lieben? ─── */}
      <section className="w-full bg-[#6DB48E]">
        <div className="max-w-[1400px] mx-auto px-8 py-20">
          <h2 className="text-white text-center font-bold mb-14" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            Warum Menschen Topf &amp; Deckel lieben?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {/* Item 1 */}
            <div className="flex flex-col items-center text-center max-w-[300px]">
              <img
                src="/images/squarespace/2edb3aa7-7d36-4ac8-8388-8b2b532a0f50_dish_02.jpg"
                alt="Immer frisch & saisonal"
                className="w-[280px] h-[280px] lg:w-full lg:h-auto aspect-square object-cover rounded-none mb-6"
              />
              <p className="text-white font-bold leading-snug" style={{ fontSize: '1.6rem' }}>
                Immer frisch &amp;<br />saisonal.
              </p>
            </div>
            {/* Item 2 */}
            <div className="flex flex-col items-center text-center max-w-[300px]">
              <img
                src="/images/squarespace/f11870eb-6638-42d9-8c9d-31fc75bcc0b3_qualitat-ohne-kompromisse.jpg"
                alt="Höchste Qualität"
                className="w-[280px] h-[280px] lg:w-full lg:h-auto aspect-square object-cover rounded-none mb-6"
              />
              <p className="text-white font-bold leading-snug" style={{ fontSize: '1.6rem' }}>
                Höchste Qualität –<br />ohne Schnickschnack.
              </p>
            </div>
            {/* Item 3 */}
            <div className="flex flex-col items-center text-center max-w-[300px]">
              <img
                src="/images/squarespace/7e315319-267c-46ab-a1a4-b9bb74a4afbf_dish_03.jpg"
                alt="Hausgemachte Rezepte"
                className="w-[280px] h-[280px] lg:w-full lg:h-auto aspect-square object-cover rounded-none mb-6"
              />
              <p className="text-white font-bold leading-snug" style={{ fontSize: '1.6rem' }}>
                Hausgemachte Rezepte<br />mit echten Zutaten.
              </p>
            </div>
            {/* Item 4 */}
            <div className="flex flex-col items-center text-center max-w-[300px]">
              <img
                src="/images/squarespace/9490696f-f6f9-4286-981d-3ecaa4d6559f_01-zutaten-die-richtig-wohl-tun.jpg"
                alt="Geschmack, der ankommt"
                className="w-[280px] h-[280px] lg:w-full lg:h-auto aspect-square object-cover rounded-none mb-6"
              />
              <p className="text-white font-bold leading-snug" style={{ fontSize: '1.6rem' }}>
                Geschmack, der ankommt –<br />Tag für Tag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Warum sich Franchise mit uns auszahlt? ─── */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2
            className="text-center font-bold mb-12 text-[#6DB48E]"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            Warum sich Franchise mit uns auszahlt?
          </h2>

          {/* Row 1: Cards left, Image right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-stretch">
            <div className="flex flex-col gap-4 h-full">
              <div className="rounded-[12px] p-6 bg-[#E9F2ED] flex-1 flex flex-col justify-center">
                <h4 className="font-bold text-xl mb-2 text-[#13141C]">Bewährtes Konzept</h4>
                <p className="text-[#13141C] text-lg leading-relaxed">
                  Unser System funktioniert – du startest mit erprobtem Rezept.
                </p>
              </div>
              <div className="rounded-[12px] p-6 bg-[#E9F2ED] flex-1 flex flex-col justify-center">
                <h4 className="font-bold text-xl mb-2 text-[#13141C]">Einfache Abläufe</h4>
                <p className="text-[#13141C] text-lg leading-relaxed">
                  Keine komplexen Geräte, keine Raketenwissenschaft. Dein Team ist schnell startklar.
                </p>
              </div>
              <div className="rounded-[12px] p-6 bg-[#E9F2ED] flex-1 flex flex-col justify-center">
                <h4 className="font-bold text-xl mb-2 text-[#13141C]">Geringe Einstiegskosten</h4>
                <p className="text-[#13141C] text-lg leading-relaxed">
                  Du brauchst kein Riesenbudget, um loszulegen – wir halten das Risiko klein.
                </p>
              </div>
            </div>
            <div className="h-full">
              <img
                src="/images/squarespace/281a1a67-e67e-4318-aac0-9dce5d62314c_281A6724-2.jpg"
                alt="Franchise Partner"
                className="w-full h-full object-cover rounded-[12px]"
              />
            </div>
          </div>

          {/* Row 2: Image left, Cards right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="order-last md:order-first h-full">
              <img
                src="/images/squarespace/1de12c96-8308-4612-8ebd-a1712f7cd8ca_281A6697.jpg"
                alt="Topf und Deckel Essen"
                className="w-full h-full object-cover rounded-[12px]"
              />
            </div>
            <div className="flex flex-col gap-4 h-full">
              <div className="rounded-[12px] p-6 bg-[#E9F2ED] flex-1 flex flex-col justify-center">
                <h4 className="font-bold text-xl mb-2 text-[#13141C]">Zentrale Lieferkette</h4>
                <p className="text-[#13141C] text-lg leading-relaxed">
                  Zutaten &amp; Produkte kommen fertig vorbereitet – du kannst direkt loslegen.
                </p>
              </div>
              <div className="rounded-[12px] p-6 bg-[#E9F2ED] flex-1 flex flex-col justify-center">
                <h4 className="font-bold text-xl mb-2 text-[#13141C]">Starke Nachfrage</h4>
                <p className="text-[#13141C] text-lg leading-relaxed">
                  Büroarbeiter:innen, Studis, Stammkund:innen – wir sprechen breite Zielgruppen an.
                </p>
              </div>
              <div className="rounded-[12px] p-6 bg-[#E9F2ED] flex-1 flex flex-col justify-center">
                <h4 className="font-bold text-xl mb-2 text-[#13141C]">Support von Tag 1</h4>
                <p className="text-[#13141C] text-lg leading-relaxed">
                  Standortwahl, Schulung, Marketing, Tagesgeschäft – wir sind an deiner Seite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── In 5 Schritten zur eigenen Filiale ─── */}
      <section className="w-full py-16 bg-[#F2E9EA]">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2
            className="text-center font-bold mb-16 text-[#13141C]"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            In 5 Schritten zur eigenen Filiale
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Left image */}
            <div className="hidden lg:block h-full">
              <img
                src="/images/squarespace/52fb95e4-252c-404a-befd-0c315b53836c_281A7141-2.jpg"
                alt="Team"
                className="w-full h-full object-cover rounded-sm shadow-sm"
              />
            </div>

            {/* Steps in center */}
            <div className="flex flex-col justify-between gap-6 h-full py-2">
              <div>
                <h4 className="font-bold text-xl mb-2 text-[#13141C]">1 — Erstgespräch (30 Min)</h4>
                <p className="text-[#13141C] text-lg leading-relaxed">
                  Du meldest dich – wir lernen uns per Call oder Video kennen.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-[#13141C]">2 — Businessplanung</h4>
                <p className="text-[#13141C] text-lg leading-relaxed">
                  Gemeinsam entwickeln wir deinen Standortplan inkl. Budget, Forecast und Zeitplan.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-[#13141C]">3 — Discovery Day in Wien</h4>
                <p className="text-[#13141C] text-lg leading-relaxed">
                  Du bekommst tiefe Einblicke ins Konzept – direkt vor Ort in unseren Filialen.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-[#13141C]">4 — Vertrag &amp; Onboarding</h4>
                <p className="text-[#13141C] text-lg leading-relaxed">
                  Unterschreiben, loslegen. Mit Trainings, Marketing-Support &amp; laufender Begleitung.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-[#13141C]">5 — Grand opening</h4>
                <p className="text-[#13141C] text-lg leading-relaxed">
                  Wir helfen beim Launch-Event – für einen starken Start mit voller Aufmerksamkeit.
                </p>
              </div>
            </div>

            {/* Right image */}
            <div className="hidden lg:block h-full">
              <img
                src="/images/squarespace/8bbf00bd-e796-4a68-9ff3-6d566fac0ee0_281A6743.jpg"
                alt="Team Member"
                className="w-full h-full object-cover rounded-sm shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Ready to rumble? CTA + Form ─── */}
      <section className="w-full py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h3
            className="font-bold mb-6 text-[#6DB48E]"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
          >
            Ready to rumble? Wir suchen Macher:innen mit Drive!
          </h3>
          <p className="text-xl mb-12 text-[#13141C] leading-relaxed">
            Fülle das Formular aus – und starte dein Franchise mit Topf &amp; Deckel.
          </p>

          {submitted ? (
            <div className="rounded-[16px] p-12 text-center bg-[#E9F2ED]">
              <h4 className="text-2xl font-bold mb-3 text-[#13141C]">Danke für deine Anfrage!</h4>
              <p className="text-lg text-[#13141C]">Wir melden uns in Kürze bei dir.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-lg p-8 md:p-12 text-left bg-[#E9F2ED] shadow-sm">
              <p className="font-bold text-lg mb-6 text-[#13141C]">Namen</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm text-[#13141C] mb-2 block">
                    Vorname <span className="font-normal text-gray-500">(erforderlich)</span>
                  </label>
                  <input
                    type="text"
                    name="vorname"
                    required
                    value={formData.vorname}
                    onChange={handleChange}
                    className="w-full rounded-none border border-[#13141C] px-4 py-4 bg-white text-[#13141C] focus:outline-none focus:ring-1 focus:ring-[#6DB48E] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#13141C] mb-2 block">
                    Nachname <span className="font-normal text-gray-500">(erforderlich)</span>
                  </label>
                  <input
                    type="text"
                    name="nachname"
                    required
                    value={formData.nachname}
                    onChange={handleChange}
                    className="w-full rounded-none border border-[#13141C] px-4 py-4 bg-white text-[#13141C] focus:outline-none focus:ring-1 focus:ring-[#6DB48E] transition-colors"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm text-[#13141C] mb-2 block">
                  Email <span className="font-normal text-gray-500">(erforderlich)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-none border border-[#13141C] px-4 py-4 bg-white text-[#13141C] focus:outline-none focus:ring-1 focus:ring-[#6DB48E] transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="text-sm text-[#13141C] mb-2 block">Handy</label>
                <input
                  type="tel"
                  name="handy"
                  value={formData.handy}
                  onChange={handleChange}
                  className="w-full rounded-none border border-[#13141C] px-4 py-4 bg-white text-[#13141C] focus:outline-none focus:ring-1 focus:ring-[#6DB48E] transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="text-sm text-[#13141C] mb-2 block">Land</label>
                <input
                  type="text"
                  name="land"
                  value={formData.land}
                  onChange={handleChange}
                  className="w-full rounded-none border border-[#13141C] px-4 py-4 bg-white text-[#13141C] focus:outline-none focus:ring-1 focus:ring-[#6DB48E] transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="text-sm text-[#13141C] mb-2 block">Investmentkapital (€)</label>
                <input
                  type="text"
                  name="investmentkapital"
                  value={formData.investmentkapital}
                  onChange={handleChange}
                  className="w-full rounded-none border border-[#13141C] px-4 py-4 bg-white text-[#13141C] focus:outline-none focus:ring-1 focus:ring-[#6DB48E] transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="text-sm text-[#13141C] mb-2 block">Gewünschte Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-none border border-[#13141C] px-4 py-4 bg-white text-[#13141C] focus:outline-none focus:ring-1 focus:ring-[#6DB48E] transition-colors"
                />
              </div>

              <div className="mb-8">
                <label className="text-sm text-[#13141C] mb-2 block">
                  Warum möchtest du ein &bdquo;Topf&amp;Deckel&ldquo; besitzen?
                </label>
                <textarea
                  name="warum"
                  rows={5}
                  value={formData.warum}
                  onChange={handleChange}
                  className="w-full rounded-none border border-[#13141C] px-4 py-4 bg-white text-[#13141C] focus:outline-none focus:ring-1 focus:ring-[#6DB48E] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 rounded-none bg-[#13141C] text-white font-bold text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors disabled:opacity-60"
              >
                {submitting ? 'Wird gesendet...' : 'Anfrage abschicken'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
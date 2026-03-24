import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function JobsPage() {
  return (
    <main className="min-h-screen font-body pb-0">
      {/* Hero Video Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video src="/video/jobs-franchise.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pt-16">
          <h1 className="text-white text-4xl sm:text-5xl md:text-[72px] font-sans font-extrabold mb-8 tracking-tight drop-shadow-md leading-[1.1]">
            We’re hiring – komm in unser Team!
          </h1>
          <p className="text-white/90 text-xl md:text-2xl font-medium drop-shadow leading-relaxed">
            Ob Berufseinsteiger:in oder Gastro-Profi: Bei Topf & Deckel lernst du dazu, findest Freunde – und sorgst mit gutem Essen dafür, dass die Stadt weiterläuft.
          </p>
        </div>
      </section>

      {/* Mission / Values Grid */}
      <section className="bg-[#7aba94] py-24 w-full">
        {/* Heading constrained to 665px like the live site — forces 2-line wrap */}
        <div className="max-w-[665px] mx-auto px-4 mb-16">
          <h2 className="font-heading font-bold text-center text-white" style={{ fontSize: '47px', lineHeight: '1.39em' }}>
            Unsere Mission – in drei schnellen Bissen
          </h2>
        </div>
        {/* Grid constrained to ~900px so each column ≈ 435px wide, matching live site */}
        <div className="max-w-[900px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Row 1: Text card + Image */}
            <div className="bg-white p-[26px] flex flex-col justify-center overflow-hidden" style={{ height: '294px' }}>
              <p className="font-sans font-bold mb-4 text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34px' }}>
                <strong>Nährwert statt Nonsens</strong>
              </p>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34px' }}>
                Wir kochen bunt, ausgewogen und frisch – für Mittagspausen, die schmecken und gut tun.
              </p>
            </div>
            <img src="/images/squarespace/88fdf423-e06b-4cfe-9bf0-293f9d851f13_281A7108.jpg" className="w-full object-cover" style={{ height: '294px' }} alt="Nährwert statt Nonsens" />

            {/* Row 2: Image + Text card */}
            <img src="/images/squarespace/a1298426-223d-4ae6-a52e-2227a1e0fa69_281A7118.jpg" className="w-full object-cover md:order-none order-last" style={{ height: '294px' }} alt="Menschen zuerst" />
            <div className="bg-white p-[26px] flex flex-col justify-center overflow-hidden" style={{ height: '294px' }}>
              <p className="font-sans font-bold mb-4 text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34px' }}>
                <strong>Menschen zuerst</strong>
              </p>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34px' }}>
                Ob Gast, Kolleg:in oder Lieferant: Wir arbeiten mit Respekt, Fairness und einem echten Lächeln.
              </p>
            </div>

            {/* Row 3: Text card + Image */}
            <div className="bg-white p-[26px] flex flex-col justify-center overflow-hidden" style={{ height: '294px' }}>
              <p className="font-sans font-bold mb-4 text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34px' }}>
                <strong>Planet vor Profit</strong>
              </p>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34px' }}>
                Regionale Zutaten, wiederverwendbare Verpackung, kurze Wege. Wir denken an morgen.
              </p>
            </div>
            <img src="/images/squarespace/f3cefe40-ce07-40b4-8d55-deaffd9a6c0f_281A7232.jpg" className="w-full object-cover" style={{ height: '294px' }} alt="Planet vor Profit" />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#F2E9EA] py-24 text-center">
        <div className="max-w-[1009px] mx-auto">
          <div className="px-4">
            <h2 className="font-heading font-bold text-center text-[#13141C] mb-12" style={{ fontSize: '47px', lineHeight: '1.39em' }}>
              Warum du bei uns gut aufgehoben bist
            </h2>
          </div>
          <img
            src="/images/squarespace/b1929e91-14ad-4972-8e42-17e7ecc4a18d_281A7102-2.jpg"
            alt="Team"
            className="w-full object-cover mb-12"
            style={{ height: '344px' }}
          />
          <div className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 text-left" style={{ columnGap: '24px', rowGap: '16px' }}>
            <div>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34.368px', marginBottom: '0' }}><strong>Menschen im Fokus</strong></p>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34.368px', marginBottom: '0' }}>Gute Stimmung im Team = gute Stimmung bei den Gästen. Wir hören zu, helfen, feiern Erfolge gemeinsam.</p>
            </div>
            <div>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34.368px', marginBottom: '0' }}><strong>Geregelte Arbeitszeiten</strong></p>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34.368px', marginBottom: '0' }}>Unsere Schichten passen zu Bürozeiten. Keine Nachtschichten. Kein Chaos.</p>
            </div>
            <div>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34.368px', marginBottom: '0' }}><strong>Perspektive statt Stillstand</strong></p>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34.368px', marginBottom: '0' }}>Vom Newbie zur Leitung – bei uns geht's weiter. Mit Trainings und klaren Entwicklungspfaden.</p>
            </div>
            <div>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34.368px', marginBottom: '0' }}><strong>Freies Essen &amp; Mitarbeiterrabatt</strong></p>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34.368px', marginBottom: '0' }}>Ein warmes Mittagessen pro Schicht ist fix. Für dich und Rabatte auch für Family &amp; Friends.</p>
            </div>
            <div>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34.368px', marginBottom: '0' }}><strong>Faire Bezahlung</strong></p>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34.368px', marginBottom: '0' }}>Wir starten über dem lokalen Fair-Pay-Benchmark – damit dein Lohn mit dem Leben mithält.</p>
            </div>
            <div>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34.368px', marginBottom: '0' }}><strong>Dein Job hat Wirkung</strong></p>
              <p className="font-sans text-[#13141C]" style={{ fontSize: '22.912px', lineHeight: '34.368px', marginBottom: '0' }}>Du versorgst Studenten, Angestellte und Stadtmenschen mit Energie – täglich.</p>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="bg-white py-24">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-8">
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-center text-[#7aba94] mb-8">
            Offene Stellen
          </h2>
          <p className="text-center text-xl text-[#13141C] mb-20 max-w-3xl mx-auto leading-relaxed">
            Hungrig auf was Neues? Hier findest du unsere aktuellen Jobs. Schau rein, wähl deinen Platz – und los geht’s!
          </p>

          <div className="space-y-8 mb-24">
            <div className="bg-[#E9F2ED] p-10 md:p-14 flex flex-col items-start text-left rounded-sm">
              <h3 className="text-3xl font-bold mb-2 font-sans text-[#13141C]">Service Mitarbeiter:in</h3>
              <span className="text-base font-semibold text-gray-700 mb-6 block uppercase tracking-wide">Teilzeit</span>
              <p className="text-xl mb-10 text-[#13141C] leading-relaxed">
                Du gibst unsere Gerichte aus, betreust Gäste an der Theke und sorgst an der Kassa für gute Laune – freundlich, schnell und zuverlässig.
              </p>
              <Link href="/kontakt" className="font-bold underline decoration-2 underline-offset-4 text-[#13141C] hover:text-[#7aba94] transition-colors text-lg">
                Jetzt bewerben
              </Link>
            </div>

            <div className="bg-[#E9F2ED] p-10 md:p-14 flex flex-col items-start text-left rounded-sm">
              <h3 className="text-3xl font-bold mb-2 font-sans text-[#13141C]">Küchenhilfe</h3>
              <span className="text-base font-semibold text-gray-700 mb-6 block uppercase tracking-wide">Vollzeit</span>
              <p className="text-xl mb-10 text-[#13141C] leading-relaxed">
                Du unterstützt das Küchenteam beim Vorbereiten, Schneiden, Anrichten und Sauberhalten. Ohne dich läuft hier nix.
              </p>
              <Link href="/kontakt" className="font-bold underline decoration-2 underline-offset-4 text-[#13141C] hover:text-[#7aba94] transition-colors text-lg">
                Jetzt bewerben
              </Link>
            </div>

            <div className="bg-[#E9F2ED] p-10 md:p-14 flex flex-col items-start text-left rounded-sm">
              <h3 className="text-3xl font-bold mb-2 font-sans text-[#13141C]">Lieferant:in</h3>
              <span className="text-base font-semibold text-gray-700 mb-6 block uppercase tracking-wide">Teilzeit</span>
              <p className="text-xl mb-10 text-[#13141C] leading-relaxed">
                Be the friendly face of Topf & Deckel! You’ll explain our menu, build colourful bowls, and keep the front-of-house humming with energy and smiles. If you thrive on fast-paced service and love making people feel at home, this is your stage.
              </p>
              <Link href="/kontakt" className="font-bold underline decoration-2 underline-offset-4 text-[#13141C] hover:text-[#7aba94] transition-colors text-lg">
                Jetzt bewerben
              </Link>
            </div>
          </div>

          <div className="text-center font-sans">
            <p className="text-2xl md:text-3xl font-bold mb-4 text-[#13141C]">Initiativbewerbung</p>
            <p className="text-xl mb-8 text-[#13141C]">
              Keine passende Stelle dabei? <strong>Schreib uns trotzdem</strong> – mit kurzer Nachricht & Lebenslauf.
            </p>
            <Link href="/kontakt" className="font-bold underline decoration-2 underline-offset-4 text-[#13141C] hover:text-[#7aba94] transition-colors text-lg">
              Jetzt bewerben
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-0">
          <img src="/images/squarespace/eccc3e38-f3e1-4656-9958-5ec7ebb86824_281A7174.jpg" className="w-full aspect-square md:aspect-[4/5] lg:h-96 object-cover" alt="Team member" />
          <img src="/images/squarespace/3bd45dd5-d2f2-42c3-82aa-69c042029545_281A6327.jpg" className="w-full aspect-square md:aspect-[4/5] lg:h-96 object-cover" alt="Team member" />
          <img src="/images/squarespace/a5096d0d-40eb-4e70-9953-4607a4a38c14_281A7069.jpg" className="w-full aspect-square md:aspect-[4/5] lg:h-96 object-cover" alt="Team member" />
          <img src="/images/squarespace/8bbf00bd-e796-4a68-9ff3-6d566fac0ee0_281A6743.jpg" className="w-full aspect-square md:aspect-[4/5] lg:h-96 object-cover" alt="Team member" />
          <img src="/images/squarespace/fae5189c-6ec2-42ac-b129-f1d435b6f0da_281A7230.jpg" className="w-full aspect-square md:aspect-[4/5] lg:h-96 object-cover" alt="Team member" />
          <img src="/images/squarespace/899f5199-1fed-48a8-809a-46d8c45dc0ea_281A7141-2.jpg" className="w-full aspect-square md:aspect-[4/5] lg:h-96 object-cover" alt="Team member" />
        </div>
      </section>
    </main>
  );
}
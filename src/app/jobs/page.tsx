import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function JobsPage() {
  return (
    <main className="min-h-screen pt-12 bg-background font-body pb-20">
      {/* Hero Video Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex flex-col items-center justify-center mb-16">
        <div className="absolute inset-0 z-0">
          <video src="/video/jobs-franchise.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-white text-4xl sm:text-5xl md:text-[72px] font-sans font-extrabold mb-6 tracking-tight drop-shadow-md leading-[1.1]">
            We’re hiring – komm in unser Team!
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow">
            Ob Berufseinsteiger:in oder Gastro-Profi: Bei Topf & Deckel lernst du dazu, findest Freunde – und sorgst mit gutem Essen dafür, dass die Stadt weiterläuft.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mission */}
        <div className="mb-24">
          <h2 className="text-3xl font-sans font-bold text-center mb-12">Unsere Mission – in drei schnellen Bissen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-secondary/20 p-8 rounded-2xl border border-border">
              <p className="text-lg font-bold mb-4">Wir kochen bunt, ausgewogen und frisch – für Mittagspausen, die schmecken und gut tun.</p>
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/88fdf423-e06b-4cfe-9bf0-293f9d851f13/281A7108.jpg?format=500w" className="w-full h-48 object-cover rounded-xl mt-6" alt="Fresh food" />
            </div>
            <div className="bg-secondary/20 p-8 rounded-2xl border border-border">
              <p className="text-lg font-bold mb-4">Ob Gast, Kolleg:in oder Lieferant: Wir arbeiten mit Respekt, Fairness und einem echten Lächeln.</p>
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/a1298426-223d-4ae6-a52e-2227a1e0fa69/281A7118.jpg?format=500w" className="w-full h-48 object-cover rounded-xl mt-6" alt="Team" />
            </div>
            <div className="bg-secondary/20 p-8 rounded-2xl border border-border">
              <p className="text-lg font-bold mb-4">Regionale Zutaten, wiederverwendbare Verpackung, kurze Wege. Wir denken an morgen.</p>
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/f3cefe40-ce07-40b4-8d55-deaffd9a6c0f/281A7232.jpg?format=500w" className="w-full h-48 object-cover rounded-xl mt-6" alt="Sustainability" />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <div>
            <img
              src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/b1929e91-14ad-4972-8e42-17e7ecc4a18d/281A7102-2.jpg?format=1500w"
              alt="Team"
              className="w-full h-[600px] object-cover rounded-3xl shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-3xl font-sans font-bold mb-8">Warum du bei uns gut aufgehoben bist</h2>
            <ul className="space-y-6">
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-primary mt-1 mr-4 flex-shrink-0" />
                <p className="text-lg">Gute Stimmung im Team = gute Stimmung bei den Gästen. Wir hören zu, helfen, feiern Erfolge gemeinsam.</p>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-primary mt-1 mr-4 flex-shrink-0" />
                <p className="text-lg">Unsere Schichten passen zu Bürozeiten. Keine Nachtschichten. Kein Chaos.</p>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-primary mt-1 mr-4 flex-shrink-0" />
                <p className="text-lg">Vom Newbie zur Leitung – bei uns geht’s weiter. Mit Trainings und klaren Entwicklungspfaden.</p>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-primary mt-1 mr-4 flex-shrink-0" />
                <p className="text-lg">Ein warmes Mittagessen pro Schicht ist fix. Für dich und Rabatte auch für Family & Friends.</p>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-primary mt-1 mr-4 flex-shrink-0" />
                <p className="text-lg">Wir starten über dem lokalen Fair-Pay-Benchmark – damit dein Lohn mit dem Leben mithält.</p>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-primary mt-1 mr-4 flex-shrink-0" />
                <p className="text-lg">Du versorgst Studenten, Angestellte und Stadtmenschen mit Energie – täglich.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Jobs List */}
        <div className="max-w-4xl mx-auto mb-24">
          <h2 className="text-3xl font-sans font-bold text-center mb-6">Offene Stellen</h2>
          <p className="text-center text-lg text-muted-foreground mb-12">
            Hungrig auf was Neues? Hier findest du unsere aktuellen Jobs. Schau rein, wähl deinen Platz – und los geht’s!
          </p>

          <div className="space-y-6">
            <div className="bg-card p-8 rounded-2xl shadow-md border border-border flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-secondary text-sm font-bold rounded-md mb-2">Teilzeit</span>
                <p className="text-lg font-bold mb-2">Service Mitarbeiter:in</p>
                <p className="text-muted-foreground">Du gibst unsere Gerichte aus, betreust Gäste an der Theke und sorgst an der Kassa für gute Laune – freundlich, schnell und zuverlässig.</p>
              </div>
              <Link href="/kontakt" className="flex-shrink-0 px-6 py-3 bg-foreground text-white rounded-lg font-bold hover:bg-foreground/90 transition-colors">Bewerben</Link>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-md border border-border flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-secondary text-sm font-bold rounded-md mb-2">Vollzeit</span>
                <p className="text-lg font-bold mb-2">Küchenhilfe</p>
                <p className="text-muted-foreground">Du unterstützt das Küchenteam beim Vorbereiten, Schneiden, Anrichten und Sauberhalten. Ohne dich läuft hier nix.</p>
              </div>
              <Link href="/kontakt" className="flex-shrink-0 px-6 py-3 bg-foreground text-white rounded-lg font-bold hover:bg-foreground/90 transition-colors">Bewerben</Link>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-md border border-border flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-secondary text-sm font-bold rounded-md mb-2">Teilzeit</span>
                <p className="text-lg font-bold mb-2">Front of House / Counter Staff</p>
                <p className="text-muted-foreground">Be the friendly face of Topf & Deckel! You’ll explain our menu, build colourful bowls, and keep the front-of-house humming with energy and smiles. If you thrive on fast-paced service and love making people feel at home, this is your stage.</p>
              </div>
              <Link href="/kontakt" className="flex-shrink-0 px-6 py-3 bg-foreground text-white rounded-lg font-bold hover:bg-foreground/90 transition-colors">Bewerben</Link>
            </div>

            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 text-center">
              <p className="text-xl font-bold mb-2">Keine passende Stelle dabei?</p>
              <p className="mb-6">Schreib uns einfach mit kurzer Nachricht & Lebenslauf.</p>
              <Link href="/kontakt" className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors">Initiativbewerbung</Link>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/8bbf00bd-e796-4a68-9ff3-6d566fac0ee0/281A6743.jpg?format=500w" className="w-full h-48 object-cover rounded-xl" alt="Team" />
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/a5096d0d-40eb-4e70-9953-4607a4a38c14/281A7069.jpg?format=500w" className="w-full h-48 object-cover rounded-xl" alt="Team" />
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/fae5189c-6ec2-42ac-b129-f1d435b6f0da/281A7230.jpg?format=500w" className="w-full h-48 object-cover rounded-xl" alt="Team" />
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/899f5199-1fed-48a8-809a-46d8c45dc0ea/281A7141-2.jpg?format=500w" className="w-full h-48 object-cover rounded-xl" alt="Team" />
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/3bd45dd5-d2f2-42c3-82aa-69c042029545/281A6327.jpg?format=500w" className="w-full h-48 object-cover rounded-xl" alt="Team" />
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/eccc3e38-f3e1-4656-9958-5ec7ebb86824/281A7174.jpg?format=500w" className="w-full h-48 object-cover rounded-xl" alt="Team" />
        </div>

      </div>
    </main>
  );
}
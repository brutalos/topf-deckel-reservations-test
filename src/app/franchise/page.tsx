import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FranchisePage() {
  return (
    <main className="min-h-screen pt-24 bg-background font-body pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-sans font-extrabold text-foreground mb-6 leading-tight">
            Warum sich Franchise mit uns auszahlt?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Unser System funktioniert – du startest mit erprobtem Rezept. Keine komplexen Geräte, keine Raketenwissenschaft. Dein Team ist schnell startklar. Du brauchst kein Riesenbudget, um loszulegen – wir halten das Risiko klein.
          </p>
          <img
            src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/281a1a67-e67e-4318-aac0-9dce5d62314c/281A6724-2.jpg?format=2500w"
            alt="Franchise"
            className="w-full h-[400px] object-cover rounded-3xl shadow-xl mb-8"
          />
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6">
            <div className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0 mr-4" />
              <p className="text-lg">Zutaten & Produkte kommen fertig vorbereitet – du kannst direkt loslegen.</p>
            </div>
            <div className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0 mr-4" />
              <p className="text-lg">Büroarbeiter:innen, Studis, Stammkund:innen – wir sprechen breite Zielgruppen an.</p>
            </div>
            <div className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0 mr-4" />
              <p className="text-lg">Standortwahl, Schulung, Marketing, Tagesgeschäft – wir sind an deiner Seite.</p>
            </div>
          </div>
          <div>
            <img
              src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1de12c96-8308-4612-8ebd-a1712f7cd8ca/281A6697.jpg?format=1500w"
              alt="Franchise Support"
              className="w-full h-[400px] object-cover rounded-3xl shadow-lg"
            />
          </div>
        </div>

        {/* Core Values / Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 text-center">
          <div className="bg-secondary/30 p-6 rounded-2xl border border-border">
            <h2 className="text-xl font-bold mb-2">Immer frisch & saisonal.</h2>
          </div>
          <div className="bg-secondary/30 p-6 rounded-2xl border border-border">
            <h2 className="text-xl font-bold mb-2">Höchste Qualität – ohne Schnickschnack.</h2>
          </div>
          <div className="bg-secondary/30 p-6 rounded-2xl border border-border">
            <h2 className="text-xl font-bold mb-2">Hausgemachte Rezepte mit echten Zutaten.</h2>
          </div>
          <div className="bg-secondary/30 p-6 rounded-2xl border border-border">
            <h2 className="text-xl font-bold mb-2">Geschmack, der ankommt – Tag für Tag.</h2>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-24">
          <h2 className="text-3xl font-sans font-bold text-center mb-12">In 5 Schritten zur eigenen Filiale</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/52fb95e4-252c-404a-befd-0c315b53836c/281A7141-2.jpg?format=1500w"
                alt="5 Schritte"
                className="w-full h-[500px] object-cover rounded-3xl shadow-lg"
              />
            </div>
            <div className="space-y-8">
              <div className="flex">
                <div className="w-12 h-12 flex-shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mr-6">1</div>
                <div>
                  <p className="text-lg pt-2">Du meldest dich – wir lernen uns per Call oder Video kennen.</p>
                </div>
              </div>
              <div className="flex">
                <div className="w-12 h-12 flex-shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mr-6">2</div>
                <div>
                  <p className="text-lg pt-2">Gemeinsam entwickeln wir deinen Standortplan inkl. Budget, Forecast und Zeitplan.</p>
                </div>
              </div>
              <div className="flex">
                <div className="w-12 h-12 flex-shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mr-6">3</div>
                <div>
                  <p className="text-lg pt-2">Du bekommst tiefe Einblicke ins Konzept – direkt vor Ort in unseren Filialen.</p>
                </div>
              </div>
              <div className="flex">
                <div className="w-12 h-12 flex-shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mr-6">4</div>
                <div>
                  <p className="text-lg pt-2">Unterschreiben, loslegen. Mit Trainings, Marketing-Support & laufender Begleitung.</p>
                </div>
              </div>
              <div className="flex">
                <div className="w-12 h-12 flex-shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mr-6">5</div>
                <div>
                  <p className="text-lg pt-2">Wir helfen beim Launch-Event – für einen starken Start mit voller Aufmerksamkeit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 rounded-3xl p-12 text-center border border-primary/20">
          <h3 className="text-3xl font-sans font-bold mb-6">Ready to rumble? Wir suchen Macher:innen mit Drive!</h3>
          <p className="text-xl mb-8">Fülle das Formular aus – und starte dein Franchise mit Topf & Deckel.</p>
          <Link
            href="/kontakt"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-sans font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Jetzt Kontakt aufnehmen
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

      </div>
    </main>
  );
}
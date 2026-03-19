import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function OfficeCateringPage() {
  return (
    <main className="min-h-screen pt-24 bg-background font-body pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-sans font-extrabold text-foreground mb-6 leading-tight">
            Wohlfühl-Lunch fürs Office. Frisch & gesund.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Dein Team verdient mehr als Snacks und Schnelllösungen. Wir liefern täglich frisch gekochte Mahlzeiten direkt ins Büro – voll Geschmack, ohne Kompromisse.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-sans font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Office Catering anfragen
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center">
          <div className="bg-destructive/5 rounded-3xl p-8 md:p-12 border border-destructive/10">
            <h3 className="text-2xl font-sans font-bold text-foreground mb-6">Was ohne uns schiefläuft?</h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/0a909979-4f07-4ca8-9e9a-ef68e03148a9/cross_coloured.png" className="w-6 h-6 mr-4 mt-1" alt="Cross" />
                <p className="text-lg">30 Minuten Mittagssuche pro Tag? Muss nicht sein.</p>
              </li>
              <li className="flex items-start">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/0a909979-4f07-4ca8-9e9a-ef68e03148a9/cross_coloured.png" className="w-6 h-6 mr-4 mt-1" alt="Cross" />
                <p className="text-lg">Fast Food macht müde. Unsere Gerichte machen wach.</p>
              </li>
              <li className="flex items-start">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/0a909979-4f07-4ca8-9e9a-ef68e03148a9/cross_coloured.png" className="w-6 h-6 mr-4 mt-1" alt="Cross" />
                <p className="text-lg">Essen verbindet – schlechte Optionen frustrieren.</p>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-sans font-bold text-foreground mb-6">Wir lösen euer Mittagsproblem</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <CheckCircle2 className="w-6 h-6 text-primary mr-4 flex-shrink-0" />
                <p className="text-lg">Täglich gekocht, mit echten Zutaten. Keine Tricks, kein Mist.</p>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-6 h-6 text-primary mr-4 flex-shrink-0" />
                <p className="text-lg">Zuverlässig, pünktlich – Lieferung inklusive.</p>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-6 h-6 text-primary mr-4 flex-shrink-0" />
                <p className="text-lg">Ob 15 oder 100 Personen – wir passen uns euch an.</p>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-6 h-6 text-primary mr-4 flex-shrink-0" />
                <p className="text-lg">5% Extra-Vorteil für eure Mitarbeitenden in allen Filialen.</p>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-6 h-6 text-primary mr-4 flex-shrink-0" />
                <p className="text-lg">Gesunde Office-Lunches, die leistbar bleiben.</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-24">
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/2c488c18-fbeb-4a0a-a625-8bc30d25b955/Topf-%26-Deckel-29.-30.7.2025-%28c%29-Nadja-Hudovernik_1-42.jpg?format=2500w" className="w-full h-[500px] object-cover rounded-3xl shadow-xl" alt="Office Lunch" />
        </div>

        <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 mb-24">
          <h2 className="text-3xl font-sans font-bold text-center mb-12">So einfach funktioniert's</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <p className="font-bold mb-2">Bedarf klären</p>
              <p className="text-muted-foreground">Wir hören zu, lernen euer Team kennen und klären Wünsche & Bedürfnisse.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <p className="font-bold mb-2">Test-Tasting</p>
              <p className="text-muted-foreground">Wir kommen für ein unverbindliches Test-Tasting direkt zu euch ins Office.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <p className="font-bold mb-2">Lieferung</p>
              <p className="text-muted-foreground">Frisch gekocht, heiß geliefert – pünktlich ins Büro.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">4</div>
              <p className="font-bold mb-2">Genießen</p>
              <p className="text-muted-foreground">Eure Leute essen besser – und kommen gern wieder.</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
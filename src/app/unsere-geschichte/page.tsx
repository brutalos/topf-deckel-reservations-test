import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function UnsereGeschichtePage() {
  return (
    <main className="min-h-screen pt-12 bg-background font-body pb-20">
      {/* Hero Video Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex flex-col items-center justify-center mb-16">
        <div className="absolute inset-0 z-0">
          <video src="/video/our-story.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-white text-4xl sm:text-5xl md:text-[72px] font-sans font-extrabold mb-8 tracking-tight drop-shadow-md leading-[1.1]">
            Wofür wir stehen – und warum wir’s tun.
          </h1>
          <p className="text-xl md:text-2xl font-sans font-bold text-primary mb-4 drop-shadow">Vom ersten Topf bis heute.</p>
          <p className="text-white/90 text-lg mb-8 font-medium drop-shadow">Das war von Anfang an unser Versprechen.</p>
          <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto drop-shadow">
            Topf & Deckel wurde geboren aus einem einfachen Gedanken: Gutes, ehrliches Mittagessen sollte keine Ausnahme sein – sondern Teil eines gesunden Alltags. Inmitten von Wiener Bürohäusern, Termindruck und Kantinenroutine haben wir gesehen, wie viele ihre Pause mit Snacks und Schnelllösungen verbringen.
          </p>
          <p className="text-white text-xl font-bold mt-8 drop-shadow-md">Wir wollten zeigen: Es geht besser.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/72573d92-c6f3-491f-960a-8e55e42e8055/281A7200-2.jpg?format=1000w" className="w-full h-80 object-cover rounded-2xl shadow-lg" alt="Team" />
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/069fada0-fd34-4837-aa79-29c78d7cfa9d/281A6858.jpg?format=1000w" className="w-full h-80 object-cover rounded-2xl shadow-lg" alt="Kitchen" />
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-sans font-bold text-foreground mb-6">Wie alles begann</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Also haben wir begonnen zu kochen – täglich frisch, saisonal, mit Zutaten, die wir selbst essen würden. Ohne Schnickschnack, aber mit richtig viel Geschmack.
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            Was als kleine Take-away-Idee begann, ist heute ein Team aus Küchenmenschen und Gastgeber:innen mit mehreren Standorten in Wien. Unser Ziel: Gerichte, die nicht nur satt machen – sondern richtig gut tun.
          </p>
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/b6cc1437-9bf2-4791-b42a-5b09987a0bfb/281A6305.jpg?format=1500w" className="w-full h-[400px] object-cover rounded-2xl shadow-xl" alt="Store front" />
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-sans font-bold text-foreground mb-6">Unsere Werte</h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <p className="text-lg text-muted-foreground">
                  Wir glauben an frische, ausgewogene Mahlzeiten, die gut schmecken und guttun – ohne künstliche Zusätze, ohne Kompromisse. Was bei uns auf den Teller kommt, ist ehrlich gekocht und selbst gewählt.
                </p>
              </div>
              <div className="flex-1">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/7f11ab42-1ce1-4eb5-9af6-0fbd226804ec/281A6612.jpg?format=750w" className="w-full h-64 object-cover rounded-2xl shadow-md" alt="Food ingredients" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="flex-1">
                <p className="text-lg text-muted-foreground">
                  Gute Küche braucht ein gutes Team. Wir arbeiten auf Augenhöhe – mit Respekt, Wertschätzung und dem Wissen: Qualität entsteht nur, wenn sich alle wohlfühlen.
                </p>
              </div>
              <div className="flex-1">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/38be31f7-084a-4c11-acaf-242cccb91966/281A7186-2.jpg?format=750w" className="w-full h-64 object-cover rounded-2xl shadow-md" alt="Team cooking" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <p className="text-lg text-muted-foreground">
                  Unsere Gäste zählen auf uns – dafür übernehmen wir Verantwortung. Mit klaren Abläufen, Transparenz und einem nachhaltigen Umgang mit Ressourcen.
                </p>
              </div>
              <div className="flex-1">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/99a362b4-d5b0-40c9-af89-f846e0b1b1a9/Topf-%26-Deckel-29.-30.7.2025-%28c%29-Nadja-Hudovernik_1-155.jpg?format=750w" className="w-full h-64 object-cover rounded-2xl shadow-md" alt="Customer service" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            href="/standorte"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-sans font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Besuche unsere Standorte
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
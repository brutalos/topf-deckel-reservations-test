import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function EventsPartysPage() {
  return (
    <main className="min-h-screen pt-24 bg-background font-body pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h1 className="text-4xl md:text-5xl font-sans font-extrabold text-foreground mb-6 leading-tight">
              Catering, das Eindruck hinterlässt. Und schmeckt.
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Von bunten Bowls bis zu vollwertigen Hauptgerichten: Unser Catering bringt Geschmack, Freude und Leichtigkeit in jedes Event.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Business Lunch, Teamfeier oder Office-Eröffnung – wir liefern unkompliziert, pünktlich und mit Stil.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-sans font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Jetzt anfragen
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <img
              src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/00c81532-dd48-4732-8291-09f753044669/dish_01.jpg?format=1500w"
              alt="Catering"
              className="w-full h-[300px] object-cover rounded-2xl shadow-xl"
            />
            <img
              src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1751884101489-ULY41VQVSJ3W6KTYMUKS/pexels-abie-zerosix-441402-1748865.jpg?format=1500w"
              alt="Party Catering"
              className="w-full h-[200px] object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>

        <div className="mb-24 text-center max-w-4xl mx-auto">
          <p className="text-xl md:text-2xl font-sans font-bold text-foreground leading-relaxed">
            Wir sind bestrebt, Ihre Erwartungen zu übertreffen, indem wir für jeden Anlass hochwertige, frische und gesunde Speisen anbieten. Sie können darauf vertrauen, dass Ihre Veranstaltung in zuverlässigen Händen ist.
          </p>
        </div>

        {/* Testimonials */}
        <div className="bg-secondary/30 rounded-3xl p-8 md:p-12 mb-24">
          <h2 className="text-3xl font-sans font-bold text-center mb-12">Das sagen unsere Kunden</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-md border border-border">
              <div className="h-12 w-12 rounded-full overflow-hidden mb-6 mx-auto">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/2e0680c7-b85a-40b5-87e8-8764db4e49b8/pexels-rdne-8384330.jpg?format=300w" alt="Maria Gruber" className="w-full h-full object-cover" />
              </div>
              <p className="italic text-muted-foreground mb-6">“Der Geburtstag meiner Tochter war ein Traum. Das Essen war ein Highlight – wunderschön angerichtet und richtig lecker.”</p>
              <p className="font-bold text-center">- Maria Gruber</p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-md border border-border">
              <div className="h-12 w-12 rounded-full overflow-hidden mb-6 mx-auto">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1751884101509-SY2NASRVNKZL4VTM4PAQ/unsplash-image-ABgnuktbi8s.jpg?format=300w" alt="Dominik und Anna" className="w-full h-full object-cover" />
              </div>
              <p className="italic text-muted-foreground mb-6">"Unsere Hochzeit war perfekt! Das Essen war fantastisch, die Präsentation wunderschön – unsere Gäste reden heute noch darüber."</p>
              <p className="font-bold text-center">- Dominik und Anna</p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-md border border-border">
              <div className="h-12 w-12 rounded-full overflow-hidden mb-6 mx-auto">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1751884101513-YA9G989BP5EU4G38LD8J/unsplash-image-L8kMx3rzt7s.jpg?format=300w" alt="Johanna Bauer" className="w-full h-full object-cover" />
              </div>
              <p className="italic text-muted-foreground mb-6">“Unser Familienfest war ein voller Erfolg. Topf & Deckel hat alle Ernährungswünsche berücksichtigt – Service und Essen waren top!”</p>
              <p className="font-bold text-center">- Johanna Bauer</p>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/31116196-502d-4cd8-bca0-85f5e92f6d99/events-and-parties_03.jpg?format=500w" className="w-full h-64 object-cover rounded-xl" alt="Event" />
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1762352009897-CWFBJN9BF7K35OKPBKNH/events-and-parties_01.jpg?format=500w" className="w-full h-64 object-cover rounded-xl" alt="Event" />
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/8b5e16ee-fae6-43cf-9e8d-f0994d7c25f7/events-and-parties_04.jpg?format=500w" className="w-full h-64 object-cover rounded-xl" alt="Event" />
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/9b8daee5-7f19-4751-97fb-54d896468eb9/events-and-parties_02.jpg?format=500w" className="w-full h-64 object-cover rounded-xl" alt="Event" />
        </div>

      </div>
    </main>
  );
}
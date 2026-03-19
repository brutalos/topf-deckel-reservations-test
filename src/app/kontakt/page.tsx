import Link from 'next/link';
import { Send } from 'lucide-react';

export default function KontaktPage() {
  return (
    <main className="min-h-screen pt-24 bg-background font-body pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-sans font-extrabold text-foreground mb-6 leading-tight">
            Hast du Fragen?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Schreib uns dein Anliegen über das Kontaktformular – wir melden uns so schnell wie möglich bei dir zurück.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-card p-8 md:p-12 rounded-3xl shadow-xl border border-border mb-24">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Vorname *</label>
                <input type="text" className="w-full p-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none transition-all" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Nachname *</label>
                <input type="text" className="w-full p-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none transition-all" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">E-Mail Adresse *</label>
              <input type="email" className="w-full p-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none transition-all" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Thema *</label>
              <select className="w-full p-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none transition-all" required>
                <option value="">Bitte wählen...</option>
                <option value="catering">Office Catering</option>
                <option value="events">Events & Partys</option>
                <option value="franchise">Franchise Anfrage</option>
                <option value="jobs">Bewerbung</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Deine Nachricht *</label>
              <textarea rows={6} className="w-full p-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none transition-all resize-none" required></textarea>
            </div>

            <button type="button" className="w-full flex items-center justify-center px-8 py-4 bg-foreground text-white rounded-xl font-sans font-bold text-lg hover:bg-foreground/90 transition-colors shadow-lg">
              Nachricht senden
              <Send className="ml-2 h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-sans font-bold mb-4">Von der Küche direkt in deinen Feed.</h2>
          <p className="text-lg text-muted-foreground">Eindrücke aus unserem Alltag – Gerichte, Lieblingsmomente und alles, was gesundes Essen besonders macht.</p>
        </div>

        {/* Social Feed Gallery placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1754497238144-4LJEP3KVTH8BYQ18IU3V/image-asset.jpeg?format=500w" className="w-full h-64 object-cover rounded-xl hover:scale-[1.02] transition-transform" alt="Feed 1" />
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1754497239168-H2MRKJOZY43P6W7G6H4F/image-asset.jpeg?format=500w" className="w-full h-64 object-cover rounded-xl hover:scale-[1.02] transition-transform" alt="Feed 2" />
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1754497240319-25HZ64GLEWA1Y9677S3G/image-asset.jpeg?format=500w" className="w-full h-64 object-cover rounded-xl hover:scale-[1.02] transition-transform" alt="Feed 3" />
          <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1754497241334-7CZ8XEVV1NE8QNVO0JK5/image-asset.jpeg?format=500w" className="w-full h-64 object-cover rounded-xl hover:scale-[1.02] transition-transform" alt="Feed 4" />
        </div>

      </div>
    </main>
  );
}
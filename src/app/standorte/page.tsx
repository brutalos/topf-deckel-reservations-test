import Link from 'next/link';

export default function StandortePage() {
  return (
    <main className="min-h-screen pt-12 bg-background font-body">
      {/* Hero Video Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video src="/video/locations.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-white text-4xl sm:text-5xl md:text-[72px] font-sans font-extrabold mb-6 tracking-tight drop-shadow-md">
            Hier isst die Stadt
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-medium drop-shadow">
            Lunch-Spots, die hängenbleiben. Bereits 5 Mal in Wien.
          </p>
        </div>
      </section>

      <div className="w-full bg-[#E2F0E9] py-8 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-bold tracking-wide text-[#1C1C1C]">
          <a href="#gumpendorfer" className="hover:opacity-70 transition-opacity">Gumpendorfer Straße</a>
          <a href="#schottengasse" className="hover:opacity-70 transition-opacity">Schottengasse</a>
          <a href="#judengasse" className="hover:opacity-70 transition-opacity">Judengasse</a>
          <a href="#wipplingerstrae" className="hover:opacity-70 transition-opacity">Wipplingerstraße</a>
          <a href="#vorgartenstrae" className="hover:opacity-70 transition-opacity">Vorgartenstraße</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-foreground mb-4">
            Mittags gut essen. Ohne Umwege.
          </h2>
        </div>

        <div className="space-y-32">
          {/* Gumpendorfer */}
          <section id="gumpendorfer" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/f215cea4-c02a-4a0b-baf5-b0424741478b/Store+Gumpendorfer.png?format=1000w"
                alt="Store Gumpendorfer"
                className="w-full max-w-sm mb-6 object-contain"
              />
              <p className="text-lg text-muted-foreground mb-6">
                Unser Standort im 6. Bezirk – urban, gemütlich, mit täglich frischer Auswahl.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-[#6CB78E] text-white text-[10px] sm:text-xs font-bold rounded-full tracking-wider uppercase">OUTDOOR SEATING</span>
                <span className="px-3 py-1 bg-[#6CB78E] text-white text-[10px] sm:text-xs font-bold rounded-full tracking-wider uppercase">WIFI</span>
              </div>
              <div className="bg-secondary/30 p-6 rounded-2xl border border-border mb-6">
                <p className="font-bold text-foreground text-lg mb-2">Gumpendorfer Straße 66, 1060 Wien</p>
                <p className="text-muted-foreground">Geöffnet: Mo.–Fr. 11:00–15:00 Uhr</p>
              </div>
              <Link
                href="/esterhazygasse"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-[#6CB78E] text-white font-bold rounded-xl hover:bg-[#5aa37a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md group"
              >
                <span>Online Bestellen</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[400px] sm:h-[500px] order-1 md:order-2">
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/0efecb50-37c3-4f1f-a28a-006d6c02425c/gumpendorfer.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-2" alt="Location" />
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/9ca288dd-6414-4089-ba9c-94a4ec0fa637/281A6248.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-1" alt="Location" />
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/eccc3e38-f3e1-4656-9958-5ec7ebb86824/281A7174.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-1" alt="Location" />
            </div>
          </section>

          {/* Schottengasse */}
          <section id="schottengasse" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[400px] sm:h-[500px]">
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/547d7e94-c0b9-46bb-954f-bedb59cc9a1a/281A6996.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-2" alt="Location" />
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/2e41cf0d-0625-4ecf-bbee-40867f2da3b0/281A7025.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-1" alt="Location" />
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/88031348-b02b-4df9-84fe-9e695ce6aac8/281A7043.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-1" alt="Location" />
            </div>
            <div>
              <img
                src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1751884087645-EQNMXVA34S9MQ8FDD2XI/Store+Schottengasse.png?format=1000w"
                alt="Store Schottengasse"
                className="w-full max-w-sm mb-6 object-contain"
              />
              <p className="text-lg text-muted-foreground mb-6">
                Hier hat alles begonnen – klassisch, charmant, immer gut besucht.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-[#6CB78E] text-white text-[10px] sm:text-xs font-bold rounded-full tracking-wider uppercase">WIFI</span>
              </div>
              <div className="bg-secondary/30 p-6 rounded-2xl border border-border mb-6">
                <p className="font-bold text-foreground text-lg mb-2">Schottengasse 3, 1010 Wien</p>
                <p className="text-muted-foreground">Geöffnet: Mo.–Fr. 11:00–15:00 Uhr</p>
              </div>
              <Link
                href="/schottengasse"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-[#6CB78E] text-white font-bold rounded-xl hover:bg-[#5aa37a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md group"
              >
                <span>Online Bestellen</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </section>

          {/* Judengasse */}
          <section id="judengasse" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1751884087668-9PW5KLLF3RW4344VNV2M/Store+Judengasse.png?format=1000w"
                alt="Store Judengasse"
                className="w-full max-w-sm mb-6 object-contain"
              />
              <p className="text-lg text-muted-foreground mb-6">
                Unweit vom Schwedenplatz – klein, schnell und voller Geschmack.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-[#6CB78E] text-white text-[10px] sm:text-xs font-bold rounded-full tracking-wider uppercase">INDOOR SEATING</span>
                <span className="px-3 py-1 bg-[#6CB78E] text-white text-[10px] sm:text-xs font-bold rounded-full tracking-wider uppercase">WIFI</span>
              </div>
              <div className="bg-secondary/30 p-6 rounded-2xl border border-border mb-6">
                <p className="font-bold text-foreground text-lg mb-2">Judengasse 1, 1010 Wien</p>
                <p className="text-muted-foreground">Geöffnet: Mo.–Fr. 11:00–15:00 Uhr</p>
              </div>
              <Link
                href="/judengasse"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-[#6CB78E] text-white font-bold rounded-xl hover:bg-[#5aa37a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md group"
              >
                <span>Online Bestellen</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[400px] sm:h-[500px] order-1 md:order-2">
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/d12e9087-34d4-4f21-a675-3708c45a1c73/judengasse.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-2" alt="Location" />
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/9137a0d1-35da-4f17-bc66-166643c41e8d/281A7254.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-1" alt="Location" />
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/8bbf00bd-e796-4a68-9ff3-6d566fac0ee0/281A6743.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-1" alt="Location" />
            </div>
          </section>

          {/* Wipplingerstraße */}
          <section id="wipplingerstrae" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[400px] sm:h-[500px]">
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/091d161a-40cb-4294-b814-40ddcdb70355/wipplinger.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-2" alt="Location" />
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/28ce4056-40bf-43cd-9ce9-5e88e8beedeb/281A7224-2.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-1" alt="Location" />
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/aea2a613-0b56-4062-a85a-719c0bafef04/281A7232.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-1" alt="Location" />
            </div>
            <div>
              <img
                src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1751884087682-OLTBURFRJY85KN47IEFD/Store+Wipplingerstra%C3%9Fe.png?format=1000w"
                alt="Store Wipplingerstraße"
                className="w-full max-w-sm mb-6 object-contain"
              />
              <p className="text-lg text-muted-foreground mb-6">
                Mitten im ersten Bezirk – stylisch, zentral, perfekt für dein Office-Lunch.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-[#6CB78E] text-white text-[10px] sm:text-xs font-bold rounded-full tracking-wider uppercase">WIFI</span>
              </div>
              <div className="bg-secondary/30 p-6 rounded-2xl border border-border mb-6">
                <p className="font-bold text-foreground text-lg mb-2">Wipplingerstraße 22, 1010 Wien</p>
                <p className="text-muted-foreground">Geöffnet: Mo.–Fr. 11:00–15:00 Uhr</p>
              </div>
              <Link
                href="/wipplingerstrasse"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-[#6CB78E] text-white font-bold rounded-xl hover:bg-[#5aa37a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md group"
              >
                <span>Online Bestellen</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </section>

          {/* Vorgartenstraße */}
          <section id="vorgartenstrae" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/0b3b90a6-4a21-4b65-a7c4-18610d7b93da/Store+Vorgartenstrasse.png?format=1000w"
                alt="Store Vorgartenstraße"
                className="w-full max-w-sm mb-6 object-contain"
              />
              <p className="text-lg text-muted-foreground mb-6">
                Mitten im BIZ ZWEI, direkt am Wasser – urbaner geht’s kaum, entspannter auch nicht.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-secondary text-secondary-foreground text-[10px] sm:text-xs font-bold rounded-full tracking-wider uppercase">INDOOR SEATING</span>
                <span className="px-3 py-1 bg-secondary text-secondary-foreground text-[10px] sm:text-xs font-bold rounded-full tracking-wider uppercase">OUTDOOR SEATING</span>
                <span className="px-3 py-1 bg-secondary text-secondary-foreground text-[10px] sm:text-xs font-bold rounded-full tracking-wider uppercase">WIFI</span>
              </div>
              <div className="bg-secondary/30 p-6 rounded-2xl border border-border mb-6">
                <p className="font-bold text-foreground text-lg mb-2">Vorgartenstraße 206B, 1020 Wien</p>
                <p className="text-muted-foreground">Geöffnet: Mo.–Fr. 11:00–15:00 Uhr</p>
              </div>
              <Link
                href="/vorgarten"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-[#6CB78E] text-white font-bold rounded-xl hover:bg-[#5aa37a] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md group"
              >
                <span>Online Bestellen</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[400px] sm:h-[500px] order-1 md:order-2">
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1c7012bf-2e63-4c9d-b748-fa7b44477007/vorgartenstrasse_02.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-2" alt="Location" />
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/ad073d4a-2f7a-49f6-a4a8-84b27a57c643/vorgartenstrasse_01.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-1" alt="Location" />
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/3bd45dd5-d2f2-42c3-82aa-69c042029545/281A6327.jpg?format=1000w" className="w-full h-full object-cover rounded-xl col-span-1 row-span-1" alt="Location" />
            </div>
          </section>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="py-24 bg-[#6CB78E] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-white mb-4">
            Unser Menü – direkt in dein Postfach.
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl mx-auto">
            Trag dich ein und erhalte unser Tages- und Wochenmenü, Aktionen und News bequem per Mail.
          </p>
          {/* Note: In a Server Component, a form must not have onSubmit or hooks. We use a plain action-less layout for visual parity. */}
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-Mail-Adresse"
              className="flex-1 px-4 py-3 rounded-md border-none bg-white text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#1C1C1C] placeholder:text-gray-500"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-[#E2F0E9] text-[#1C1C1C] font-bold rounded-md hover:bg-[#d1e5db] transition-colors"
            >
              Abonnieren
            </button>
          </form>
        </div>
      </section>

      {/* Bottom Image Gallery */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-[250px] sm:h-[300px] lg:h-[350px]">
        <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1751884087701-9KFPIDPSNVOQ05ZEE6MN/pexels-navada-ra-628779-1703272.jpg?format=1000w" className="w-full h-full object-cover" alt="Gallery" />
        <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1751884087708-X9WIAAOKBTKVZOOEXOKK/pexels-solliefoto-299352.jpg?format=1000w" className="w-full h-full object-cover" alt="Gallery" />
        <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1751884087715-KHU7ZK85CQPFQU1IG8OS/pexels-ella-olsson-572949-3026801.jpg?format=1000w" className="w-full h-full object-cover" alt="Gallery" />
        <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1751884087726-VPVNL3WAMN1YXOS4FCUL/pexels-alesiakozik-6544378.jpg?format=1000w" className="w-full h-full object-cover" alt="Gallery" />
        <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1751884087734-072GVEEK8BPOGL7TTV58/pexels-sydney-troxell-223521-718742.jpg?format=1000w" className="w-full h-full object-cover" alt="Gallery" />
        <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1751884087745-APVORYP654LERPIE2MA8/pexels-roman-odintsov-5150558.jpg?format=1000w" className="w-full h-full object-cover" alt="Gallery" />
      </section>
    </main>
  );
}
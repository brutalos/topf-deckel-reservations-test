import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen pt-[168px] font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative h-[600px] w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/3bd45dd5-d2f2-42c3-82aa-69c042029545/281A6327.jpg?format=2500w"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-[3.5rem] md:text-[5rem] font-extrabold tracking-tight leading-tight mb-8 drop-shadow-lg">
            Bei uns schmeckt<br/>jeder Tag anders.
          </h1>
          <Link 
            href="/standorte" 
            className="bg-white text-black font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-gray-100 transition-colors"
          >
            Unsere Standorte
          </Link>
        </div>
      </section>

      {/* 2. Tageskarte Preview */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-[66.666667%] mx-auto max-md:max-w-full">
          <div className="text-center mb-12">
            <h2 className="text-[#6CB78E] text-[2.5rem] md:text-[3rem] font-extrabold tracking-tight mb-4 leading-tight">Was heute auf den Teller kommt</h2>
            <p className="text-black font-medium text-lg">Donnerstag, 19. März 2026</p>
          </div>

          {/* Promo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* LIGHT LUNCH KOMBO */}
            <div className="bg-[#E4F1EA] rounded-2xl p-6 relative overflow-hidden flex flex-col gap-2 max-md:p-4">
              <div className="flex justify-between items-center mb-2 max-md:mb-0">
                <h3 className="text-[1.25rem] font-black text-black uppercase tracking-tight m-0 max-md:text-[1rem]">LIGHT LUNCH KOMBO</h3>
                <span className="text-[1.25rem] font-extrabold text-black">€9.50</span>
              </div>
              <div className="bg-white rounded-xl p-5 flex justify-between items-center min-h-[100px] max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-3 max-md:p-4">
                <div className="flex flex-col gap-4 max-md:gap-1">
                  <p className="text-[1rem] font-bold text-black m-0 max-md:text-[0.9rem] max-md:leading-[1.3]">Salat/Suppe klein + Main Dish klein</p>
                  <p className="text-[1rem] font-bold text-black m-0 max-md:text-[0.9rem] max-md:leading-[1.3]">Main Dish klein + Getränk</p>
                  <p className="text-[1rem] font-bold text-black m-0 max-md:text-[0.9rem] max-md:leading-[1.3]">Main Dish klein + Dessert</p>
                </div>
                <div className="bg-[#f3e5e9] text-black w-[94px] h-[90px] flex flex-col justify-center items-center text-center relative flex-shrink-0 ml-4 py-6 px-2 max-md:ml-0 max-md:w-[75px] max-md:h-[75px] max-md:py-4 max-md:px-1 max-md:self-center"
                     style={{ clipPath: 'polygon(100% 50%, 88.6% 59.6%, 96.6% 70.7%, 83.1% 75.5%, 85.4% 88.6%, 70.7% 88.6%, 67.1% 100%, 55.6% 91.9%, 50% 100%, 44.4% 91.9%, 32.9% 100%, 29.3% 88.6%, 14.6% 88.6%, 16.9% 75.5%, 3.4% 70.7%, 11.4% 59.6%, 0% 50%, 11.4% 40.4%, 3.4% 29.3%, 16.9% 24.5%, 14.6% 11.4%, 29.3% 11.4%, 32.9% 0%, 44.4% 8.1%, 50% 0%, 55.6% 8.1%, 67.1% 0%, 70.7% 11.4%, 85.4% 11.4%, 83.1% 24.5%, 96.6% 29.3%, 88.6% 40.4%)' }}>
                  <span className="text-[0.85rem] font-black uppercase leading-none mb-0.5 max-md:text-[0.6rem]">SPARE</span>
                  <span className="text-[0.75rem] font-black uppercase leading-none mb-0.5 max-md:text-[0.5rem]">bis zu</span>
                  <span className="text-[1.1rem] font-black max-md:text-[0.95rem]">25%</span>
                </div>
              </div>
            </div>

            {/* BIG LUNCH KOMBO */}
            <div className="bg-[#E4F1EA] rounded-2xl p-6 relative overflow-hidden flex flex-col gap-2 max-md:p-4">
              <div className="flex justify-between items-center mb-2 max-md:mb-0">
                <h3 className="text-[1.25rem] font-black text-black uppercase tracking-tight m-0 max-md:text-[1rem]">BIG LUNCH KOMBO</h3>
                <span className="text-[1.25rem] font-extrabold text-black">€13.90</span>
              </div>
              <div className="bg-white rounded-xl p-5 flex justify-between items-center min-h-[100px] max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-3 max-md:p-4">
                <div className="flex flex-col gap-4 max-md:gap-1">
                  <p className="text-[1rem] font-bold text-black m-0 max-md:text-[0.9rem] max-md:leading-[1.3]">Salat/Suppe klein + Main Dish groß</p>
                  <p className="text-[1rem] font-bold text-black m-0 max-md:text-[0.9rem] max-md:leading-[1.3]">Main Dish groß + Getränk</p>
                  <p className="text-[1rem] font-bold text-black m-0 max-md:text-[0.9rem] max-md:leading-[1.3]">Main Dish groß + Dessert</p>
                </div>
                <div className="bg-[#f3e5e9] text-black w-[94px] h-[90px] flex flex-col justify-center items-center text-center relative flex-shrink-0 ml-4 py-6 px-2 max-md:ml-0 max-md:w-[75px] max-md:h-[75px] max-md:py-4 max-md:px-1 max-md:self-center"
                     style={{ clipPath: 'polygon(100% 50%, 88.6% 59.6%, 96.6% 70.7%, 83.1% 75.5%, 85.4% 88.6%, 70.7% 88.6%, 67.1% 100%, 55.6% 91.9%, 50% 100%, 44.4% 91.9%, 32.9% 100%, 29.3% 88.6%, 14.6% 88.6%, 16.9% 75.5%, 3.4% 70.7%, 11.4% 59.6%, 0% 50%, 11.4% 40.4%, 3.4% 29.3%, 16.9% 24.5%, 14.6% 11.4%, 29.3% 11.4%, 32.9% 0%, 44.4% 8.1%, 50% 0%, 55.6% 8.1%, 67.1% 0%, 70.7% 11.4%, 85.4% 11.4%, 83.1% 24.5%, 96.6% 29.3%, 88.6% 40.4%)' }}>
                  <span className="text-[0.85rem] font-black uppercase leading-none mb-0.5 max-md:text-[0.6rem]">SPARE</span>
                  <span className="text-[0.75rem] font-black uppercase leading-none mb-0.5 max-md:text-[0.5rem]">bis zu</span>
                  <span className="text-[1.1rem] font-black max-md:text-[0.95rem]">20%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items Preview */}
          <div className="flex flex-col gap-10">
            {/* Starters */}
            <div>
              <div className="flex justify-between items-baseline border-b border-gray-200 pb-2 mb-4">
                <h4 className="text-xl font-bold text-black m-0">Starters</h4>
                <div className="text-sm">KLEIN <strong>€4.90</strong> / GROSS <strong>€6.90</strong></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-lg font-bold text-black mb-1">Paprika-Zucchinisuppe <span className="inline-block px-2 py-0.5 bg-[#059669] text-white text-[10px] font-bold rounded-full align-middle ml-2">VEGGIE</span></h5>
                  <p className="text-gray-600 text-sm">L, M, O</p>
                </div>
                <div>
                  <h5 className="text-lg font-bold text-black mb-1">Haussalat <span className="inline-block px-2 py-0.5 bg-[#059669] text-white text-[10px] font-bold rounded-full align-middle ml-2">VEGGIE</span></h5>
                </div>
              </div>
            </div>
            
            {/* Saladbowl */}
            <div>
              <div className="flex justify-between items-baseline border-b border-gray-200 pb-2 mb-4">
                <h4 className="text-xl font-bold text-black m-0">Saladbowl</h4>
                <div className="text-sm">KLEIN <strong>€7.50</strong> / GROSS <strong>€10.90</strong></div>
              </div>
            </div>

            {/* Main Dish */}
            <div>
              <div className="flex justify-between items-baseline border-b border-gray-200 pb-2 mb-4">
                <h4 className="text-xl font-bold text-black m-0">Main Dish</h4>
                <div className="text-sm">KLEIN <strong>€7.50</strong> / GROSS <strong>€11.90</strong></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h5 className="text-lg font-bold text-black mb-1 leading-tight">Chicken-Stroganoff in Senf-Rahmsauce mit Waldpilzen & Sauerrahm Dip</h5>
                  <p className="text-black text-sm">mit Lankornreis (G, L, M, O)</p>
                </div>
                <div>
                  <h5 className="text-lg font-bold text-black mb-1 leading-tight">Burritos Chili Con Carne mit Avocado-Guacamole, überbackenem Käse & grünem Salat</h5>
                  <p className="text-black text-sm">(A, C, G, L, M, O)</p>
                </div>
                <div>
                  <h5 className="text-lg font-bold text-black mb-1 leading-tight">Rote Rüben-Erdäpfel Gratin mit Feta, Walnüssen & grünem Salat <span className="inline-block px-2 py-0.5 bg-[#059669] text-white text-[10px] font-bold rounded-full align-middle ml-2">VEGGIE</span></h5>
                  <p className="text-black text-sm">(G, L, M, O)</p>
                </div>
                <div>
                  <h5 className="text-lg font-bold text-black mb-1 leading-tight">Steinpilz Gnocchi in Parmesansauce mit Ruccola & grünem Salat <span className="inline-block px-2 py-0.5 bg-[#059669] text-white text-[10px] font-bold rounded-full align-middle ml-2">VEGGIE</span></h5>
                  <p className="text-black text-sm">(A, C, G, L, M, O)</p>
                </div>
              </div>
            </div>

            {/* Dessert */}
            <div>
              <div className="flex justify-between items-baseline border-b border-gray-200 pb-2 mb-4">
                <h4 className="text-xl font-bold text-black m-0">Dessert</h4>
                <div className="text-sm"><strong>€4.50</strong></div>
              </div>
              <div>
                <h5 className="text-lg font-bold text-black mb-1">Erdbeer-Joghurt Schnitte <span className="inline-block px-2 py-0.5 bg-[#059669] text-white text-[10px] font-bold rounded-full align-middle ml-2">VEGGIE</span></h5>
                <p className="text-black text-sm">self-made</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bei uns ist gutes Essen Alltag */}
      <section className="py-24 bg-[#6CB78E] px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-white text-[2.5rem] md:text-[3.5rem] font-extrabold tracking-tight mb-16 leading-tight">Bei uns ist gutes Essen Alltag</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-[180px] h-[180px] rounded-full overflow-hidden mb-6 border-4 border-transparent hover:scale-105 transition-transform duration-300">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/b89191cf-0265-43b0-a6c1-3ca17e419e53/events-and-parties_03.jpg?format=500w" alt="Täglich andere Gerichte" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Täglich andere Gerichte</h3>
              <p className="text-white/90 text-sm leading-relaxed px-4">Abwechslungsreich, ausgewogen – für jeden etwas dabei.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-[180px] h-[180px] rounded-full overflow-hidden mb-6 border-4 border-transparent hover:scale-105 transition-transform duration-300">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/b9feb942-8959-4a0e-ab86-f7e736d0edc6/06_seasonal_vegetable_soup.jpeg?format=500w" alt="Frisch & selbst gekocht" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Frisch & selbst gekocht</h3>
              <p className="text-white/90 text-sm leading-relaxed px-4">Mit hochwertigen, saisonalen Zutaten – ohne Kompromisse.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[180px] h-[180px] rounded-full overflow-hidden mb-6 border-4 border-transparent hover:scale-105 transition-transform duration-300">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/f11870eb-6638-42d9-8c9d-31fc75bcc0b3/qualitat-ohne-kompromisse.jpg?format=500w" alt="Schnell & unkompliziert" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Schnell & unkompliziert</h3>
              <p className="text-white/90 text-sm leading-relaxed px-4">Lunch, der einfach funktioniert – ob vor Ort oder zum Mitnehmen.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[180px] h-[180px] rounded-full overflow-hidden mb-6 border-4 border-transparent hover:scale-105 transition-transform duration-300">
                <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/934770c8-4f3f-4b25-a188-56adb7d58b30/pexels-kaboompics-5916.jpg?format=500w" alt="Fair, ehrlich & gesund" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Fair, ehrlich & gesund</h3>
              <p className="text-white/90 text-sm leading-relaxed px-4">Top Qualität zum vernünftigen Preis. Kein Schnickschnack.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Catering */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-[#6CB78E] text-[2.5rem] md:text-[3.5rem] font-extrabold tracking-tight mb-6 leading-tight">Übrigens: Wir können auch Catering</h2>
          <p className="text-black font-medium text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
            Ob Office-Lunch, Meeting oder Feier: Unser Essen bringt Geschmack, Frische und ein gutes Gefühl auf den Tisch. Unkompliziert. Flexibel. Und richtig gut.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Link href="/events-partys" className="group block relative rounded-3xl overflow-hidden h-[300px] shadow-lg">
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/eb20c8fe-1779-442b-8b7b-668b5acc254f/Events+%26+Partys?format=1000w" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Events & Partys" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white text-3xl font-bold border-b-2 border-transparent group-hover:border-white transition-all pb-1">Events & Partys</span>
              </div>
            </Link>
            <Link href="/office-catering" className="group block relative rounded-3xl overflow-hidden h-[300px] shadow-lg">
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/de3e785c-8d8a-4df1-bc23-2d6d03b8629c/Office+Catering?format=1000w" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Office Catering" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white text-3xl font-bold border-b-2 border-transparent group-hover:border-white transition-all pb-1">Office Catering</span>
              </div>
            </Link>
          </div>

          <Link href="/unsere-geschichte" className="text-[#6CB78E] font-bold text-sm tracking-wide uppercase hover:underline">
            Unsere Geschichte lesen →
          </Link>
        </div>
      </section>

      {/* 5. Vorgartenstraße */}
      <section className="py-24 bg-[#E4F1EA] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-black text-[2.5rem] md:text-[3.5rem] font-extrabold tracking-tight mb-6 leading-tight">Vorgartenstraße, wir sind da!</h2>
          <p className="text-black text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Unser jüngster Standort serviert ab sofort täglich frisch im Herzen Wiens. Vorbeikommen, Lunch schnappen und sich willkommen fühlen.
          </p>
          <Link 
            href="/standorte" 
            className="inline-block bg-black text-white font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-gray-800 transition-colors"
          >
            ALLE STANDORTE ENTDECKEN
          </Link>
        </div>
      </section>

      {/* 6. Instagram */}
      <section className="py-24 bg-[#6CB78E] px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-white text-[2.5rem] md:text-[3.5rem] font-extrabold tracking-tight mb-6 leading-tight">Von der Küche direkt in deinen Feed.</h2>
          <p className="text-white text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
            Eindrücke aus unserem Alltag – Gerichte, Lieblingsmomente und alles, was gesundes Essen besonders macht.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="relative aspect-square group cursor-pointer overflow-hidden rounded-md">
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1754497238144-4LJEP3KVTH8BYQ18IU3V/image-asset.jpeg?format=500w" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Instagram Post 1" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
            <div className="relative aspect-square group cursor-pointer overflow-hidden rounded-md">
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1754497239168-H2MRKJOZY43P6W7G6H4F/image-asset.jpeg?format=500w" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Instagram Post 2" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
            <div className="relative aspect-square group cursor-pointer overflow-hidden rounded-md">
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1754497240319-25HZ64GLEWA1Y9677S3G/image-asset.jpeg?format=500w" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Instagram Post 3" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
            <div className="relative aspect-square group cursor-pointer overflow-hidden rounded-md">
              <img src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/1754497241334-7CZ8XEVV1NE8QNVO0JK5/image-asset.jpeg?format=500w" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Instagram Post 4" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
          </div>

          <Link href="#" className="text-white font-bold text-sm tracking-wide underline underline-offset-4 hover:text-white/80 transition-colors">
            Folge uns auf Instagram
          </Link>
        </div>
      </section>

    </main>
  );
}
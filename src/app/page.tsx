import Link from 'next/link';
import { getRawWeeklyMenu } from '@/lib/menuFetcher';

export const revalidate = 3600;

export default async function HomePage() {
  const weeklyMenu = await getRawWeeklyMenu();

  const now = new Date();
  const currentDayIndex = now.getDay();
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  let dayKey = daysOfWeek[currentDayIndex];

  const isWeekend = currentDayIndex === 0 || currentDayIndex === 6;

  // Create a target date that corresponds to the menu being shown
  let targetDate = new Date(now);

  if (!isWeekend && !weeklyMenu[dayKey]) {
    dayKey = 'monday'; // default fallback if a weekday is missing

    // If a weekday is missing, fallback the date to Monday of the current week
    const diff = currentDayIndex - 1;
    targetDate.setDate(targetDate.getDate() - diff);
  }

  const currentMenu = isWeekend ? null : (weeklyMenu[dayKey] || {});

  const renderBadge = (dietary: string[]) => {
    if (!dietary) return null;
    if (dietary.includes('veg')) return <span className="inline-block px-2 py-0.5 bg-[#059669] text-white text-[10px] font-bold rounded-full align-middle ml-2">VEGGIE</span>;
    if (dietary.includes('vg')) return <span className="inline-block px-2 py-0.5 bg-[#0d9488] text-white text-[10px] font-bold rounded-full align-middle ml-2">VEG</span>;
    if (dietary.includes('gf')) return <span className="inline-block px-2 py-0.5 bg-[#fbbf24] text-black text-[10px] font-bold rounded-full align-middle ml-2">GF</span>;
    if (dietary.includes('lf')) return <span className="inline-block px-2 py-0.5 bg-[#7dd3fc] text-black text-[10px] font-bold rounded-full align-middle ml-2">LF</span>;
    return null;
  };

  const renderItemSimple = (item: any) => {
    if (!item || !item.name) return null;
    return (
      <div key={item.id || item.name}>
        <h5 className="text-lg font-bold text-black mb-1 leading-tight">
          {item.name} {renderBadge(item.dietary)}
        </h5>
        {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
      </div>
    );
  };

  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = targetDate.toLocaleDateString('de-AT', dateOptions);

  return (
    <main className="min-h-screen font-sans">

      {/* 1. Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video
            src="/video/home.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8 max-w-5xl mx-auto">
          <h1 className="text-white text-[3rem] sm:text-[4rem] md:text-[72px] font-extrabold tracking-tight leading-[1.05] mb-10 drop-shadow-lg">
            Bei uns schmeckt<br />jeder Tag anders.
          </h1>
          <Link
            href="/standorte"
            className="bg-white text-black font-bold text-sm tracking-[0.2em] uppercase px-10 py-5 rounded-sm hover:bg-gray-100 transition-colors"
          >
            Unsere Standorte
          </Link>
        </div>
      </section>

      {/* 2. Tageskarte Preview */}
      <section id="tageskarte" className="py-20 md:py-32 bg-white px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#6CB78E] text-[2.5rem] md:text-[3.5rem] font-extrabold tracking-tight mb-4 leading-[1.1]">Was heute<br className="md:hidden" />auf den Teller kommt</h2>
            <p className="text-black font-medium text-lg md:text-xl">{dateString}</p>
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
          {isWeekend ? (
            <div className="text-center font-bold text-black py-12 mb-10 text-xl max-w-2xl mx-auto">
              Wir sind am Wochenende geschlossen. Besuchen Sie uns Montag bis Freitag!
            </div>
          ) : !currentMenu?.starters ? (
            <div className="text-center font-bold text-black py-12 mb-10">
              Aktuell kein Menü für heute verfügbar.
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {/* Starters */}
              <div>
                <div className="flex justify-between items-baseline border-b border-gray-200 pb-2 mb-4">
                  <h4 className="text-xl font-bold text-black m-0">Starters</h4>
                  <div className="text-sm">KLEIN <strong>€4.90</strong> / GROSS <strong>€6.90</strong></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMenu.starters?.map((i: any) => renderItemSimple(i))}
                </div>
              </div>

              {/* Saladbowl */}
              {currentMenu.salad && currentMenu.salad.name && (
                <div>
                  <div className="flex justify-between items-baseline border-b border-gray-200 pb-2 mb-4">
                    <h4 className="text-xl font-bold text-black m-0">Saladbowl</h4>
                    <div className="text-sm">KLEIN <strong>€7.50</strong> / GROSS <strong>€10.90</strong></div>
                  </div>
                  {renderItemSimple(currentMenu.salad)}
                </div>
              )}

              {/* Main Dish */}
              <div>
                <div className="flex justify-between items-baseline border-b border-gray-200 pb-2 mb-4">
                  <h4 className="text-xl font-bold text-black m-0">Main Dish</h4>
                  <div className="text-sm">KLEIN <strong>€7.50</strong> / GROSS <strong>€11.90</strong></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {currentMenu.meatMains?.map((i: any) => renderItemSimple(i))}
                  {currentMenu.vegetarianMains?.map((i: any) => renderItemSimple(i))}
                </div>
              </div>

              {/* Dessert */}
              {currentMenu.dessert && currentMenu.dessert.name && (
                <div>
                  <div className="flex justify-between items-baseline border-b border-gray-200 pb-2 mb-4">
                    <h4 className="text-xl font-bold text-black m-0">Dessert</h4>
                    <div className="text-sm"><strong>€4.50</strong></div>
                  </div>
                  <div>
                    {renderItemSimple(currentMenu.dessert)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 3. Bei uns ist gutes Essen Alltag */}
      <section className="py-20 md:py-32 bg-[#6CB78E] px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-white text-[2.5rem] sm:text-[3rem] md:text-[4rem] font-extrabold tracking-tight mb-16 leading-[1.1]">Bei uns ist<br className="md:hidden" />gutes Essen Alltag</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden mb-8 border-4 border-transparent hover:scale-105 transition-transform duration-300 shadow-xl">
                <img src="/images/squarespace/b89191cf-0265-43b0-a6c1-3ca17e419e53_events-and-parties_03.jpg" alt="Täglich andere Gerichte" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-[1.35rem] font-bold mb-3 md:mb-4 px-2">Täglich andere Gerichte</h3>
              <p className="text-white/95 text-[15px] leading-relaxed px-4 md:px-2">Abwechslungsreich, ausgewogen – für jeden etwas dabei.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[180px] h-[180px] rounded-full overflow-hidden mb-6 border-4 border-transparent hover:scale-105 transition-transform duration-300">
                <img src="/images/squarespace/b9feb942-8959-4a0e-ab86-f7e736d0edc6_06_seasonal_vegetable_soup.jpeg" alt="Frisch & selbst gekocht" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Frisch & selbst gekocht</h3>
              <p className="text-white/90 text-sm leading-relaxed px-4">Mit hochwertigen, saisonalen Zutaten – ohne Kompromisse.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[180px] h-[180px] rounded-full overflow-hidden mb-6 border-4 border-transparent hover:scale-105 transition-transform duration-300">
                <img src="/images/squarespace/f11870eb-6638-42d9-8c9d-31fc75bcc0b3_qualitat-ohne-kompromisse.jpg" alt="Schnell & unkompliziert" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Schnell & unkompliziert</h3>
              <p className="text-white/90 text-sm leading-relaxed px-4">Lunch, der einfach funktioniert – ob vor Ort oder zum Mitnehmen.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[180px] h-[180px] rounded-full overflow-hidden mb-6 border-4 border-transparent hover:scale-105 transition-transform duration-300">
                <img src="/images/squarespace/934770c8-4f3f-4b25-a188-56adb7d58b30_pexels-kaboompics-5916.jpg" alt="Fair, ehrlich & gesund" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Fair, ehrlich & gesund</h3>
              <p className="text-white/90 text-sm leading-relaxed px-4">Top Qualität zum vernünftigen Preis. Kein Schnickschnack.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Catering */}
      <section className="py-20 md:py-32 bg-white px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-[#66B28C] text-[2.5rem] md:text-[3.5rem] font-bold tracking-tight mb-8 leading-[1.1]">Übrigens: Wir können <br className="md:hidden" />auch Catering</h2>
          <p className="text-black font-medium text-[1.1rem] md:text-[1.2rem] max-w-[800px] mx-auto mb-16 leading-relaxed px-4">
            Ob Office-Lunch, Meeting oder Feier: Unser Essen bringt Geschmack, Frische und ein gutes Gefühl auf den Tisch.<br className="hidden md:block" /> Unkompliziert. Flexibel. Und richtig gut.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 px-4 md:px-8 items-start mb-4">
            <Link href="/office-catering" className="group block text-left">
              <div className="overflow-hidden rounded-sm mb-5">
                <img src="/images/squarespace/de3e785c-8d8a-4df1-bc23-2d6d03b8629c_Office_Catering.jpg" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" alt="Office Catering" />
              </div>
              <span className="text-black text-[1.8rem] font-bold underline underline-offset-4 decoration-2 hover:text-gray-600 transition-colors">Office Catering</span>
            </Link>
            <Link href="/events-partys" className="group block text-left">
              <div className="overflow-hidden rounded-sm mb-5">
                <img src="/images/squarespace/eb20c8fe-1779-442b-8b7b-668b5acc254f_Events__Partys.jpg" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" alt="Events & Partys" />
              </div>
              <span className="text-black text-[1.8rem] font-bold underline underline-offset-4 decoration-2 hover:text-gray-600 transition-colors">Events & Partys</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Vorgartenstraße */}
      <section className="py-20 md:py-32 bg-[#E4F1EA] px-4 md:px-8">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="text-black text-[2.5rem] sm:text-[3rem] md:text-[4rem] font-extrabold tracking-tight mb-12 leading-[1.1]">Vorgartenstraße,<br className="md:hidden" />wir sind da!</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <img src="/images/squarespace/1c7012bf-2e63-4c9d-b748-fa7b44477007_vorgartenstrasse_02.jpg" className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-lg" alt="Vorgartenstraße Store" />
            <img src="/images/squarespace/ad073d4a-2f7a-49f6-a4a8-84b27a57c643_vorgartenstrasse_01.jpg" className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-lg" alt="Vorgartenstraße Interior" />
            <img src="/images/squarespace/3bd45dd5-d2f2-42c3-82aa-69c042029545_281A6327.jpg" className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-lg" alt="Vorgartenstraße Food" />
          </div>

          <p className="text-black text-[1.1rem] md:text-[1.25rem] max-w-[700px] mx-auto mb-12 leading-relaxed font-medium px-4">
            Unser jüngster Standort serviert ab sofort täglich frisch im Herzen Wiens. Vorbeikommen, Lunch schnappen und sich willkommen fühlen.
          </p>

          <Link
            href="/standorte"
            className="inline-block bg-black text-white font-bold text-sm tracking-[0.2em] uppercase px-10 py-5 rounded-sm hover:bg-gray-800 transition-colors"
          >
            ALLE STANDORTE ENTDECKEN
          </Link>
        </div>
      </section>

      {/* 6. Instagram */}
      <section className="py-20 md:py-32 bg-[#6CB78E] px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-white text-[2.5rem] sm:text-[3rem] md:text-[4rem] font-extrabold tracking-tight mb-8 leading-[1.1]">Von der Küche<br className="md:hidden" />direkt in deinen Feed.</h2>
          <p className="text-white text-[1.1rem] md:text-[1.25rem] max-w-[800px] mx-auto mb-16 leading-relaxed font-medium px-4">
            Eindrücke aus unserem Alltag – Gerichte, Lieblingsmomente und alles, was gesundes Essen besonders macht.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <a href="https://www.instagram.com/p/C3lYvffMz13/" target="_blank" rel="noopener noreferrer" className="relative aspect-square group cursor-pointer overflow-hidden rounded-md">
              <img src="/images/squarespace/1754497238144-4LJEP3KVTH8BYQ18IU3V_image-asset.jpeg?format=500w" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Instagram Post 1" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </a>
            <a href="https://www.instagram.com/reel/C3hWiVRtX1M/embed/?autoplay=1" target="_blank" rel="noopener noreferrer" className="relative aspect-square group cursor-pointer overflow-hidden rounded-md">
              <img src="/images/squarespace/1754497239168-H2MRKJOZY43P6W7G6H4F_image-asset.jpeg?format=500w" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Instagram Post 2" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </a>
            <a href="https://www.instagram.com/reel/C3DBEjWMMl5/embed/?autoplay=1" target="_blank" rel="noopener noreferrer" className="relative aspect-square group cursor-pointer overflow-hidden rounded-md">
              <img src="/images/squarespace/1754497240319-25HZ64GLEWA1Y9677S3G_image-asset.jpeg?format=500w" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Instagram Post 3" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </a>
            <a href="https://www.instagram.com/reel/C2724cps-xj/embed/?autoplay=1" target="_blank" rel="noopener noreferrer" className="relative aspect-square group cursor-pointer overflow-hidden rounded-md">
              <img src="/images/squarespace/1754497241334-7CZ8XEVV1NE8QNVO0JK5_image-asset.jpeg?format=500w" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Instagram Post 4" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </a>
          </div>

          <Link href="#" className="text-white font-bold text-sm tracking-wide underline underline-offset-4 hover:text-white/80 transition-colors">
            Folge uns auf Instagram
          </Link>
        </div>
      </section>

    </main>
  );
}
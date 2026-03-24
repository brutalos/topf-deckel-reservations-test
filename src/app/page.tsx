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

  const renderBadges = (dietary: string[]) => {
    if (!dietary || dietary.length === 0) return null;
    const badgeMap: Record<string, { label: string; cls: string }> = {
      veg: { label: 'VEGGIE', cls: 'bg-[#059669] text-white' },
      vg: { label: 'VEG', cls: 'bg-[#0d9488] text-white' },
      gf: { label: 'GF', cls: 'bg-[#fbbf24] text-black' },
      lf: { label: 'LF', cls: 'bg-[#7dd3fc] text-black' },
    };
    return (
      <div className="flex gap-1 items-center">
        {dietary.map(type => {
          const b = badgeMap[type];
          if (!b) return null;
          return (
            <span key={type} className={`inline-flex items-center justify-center px-3 py-[0.625rem] rounded-full text-[0.8rem] font-bold leading-none ${b.cls}`}>
              {b.label}
            </span>
          );
        })}
      </div>
    );
  };

  const renderItemCard = (item: any) => {
    if (!item || !item.name) return null;
    return (
      <div key={item.id || item.name} className="pt-2 pb-4">
        <div className="flex items-center gap-1 mb-2 flex-wrap">
          <h3 className="text-[1.25rem] font-semibold text-[#131318] m-0 leading-normal">{item.name}</h3>
          {renderBadges(item.dietary)}
        </div>
        {item.description && (
          <p className="text-[#131318] text-[1rem] font-normal leading-normal mt-2 mb-2">{item.description}</p>
        )}
        {item.allergens && item.allergens.length > 0 && (
          <p className="text-[#475569] text-[0.85rem]">Allergens: {item.allergens.join(', ')}</p>
        )}
      </div>
    );
  };

  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = targetDate.toLocaleDateString('de-AT', dateOptions);

  return (
    <main className="min-h-screen font-sans">

      {/* 1. Hero Section */}
      <section className="relative min-h-[66vh] w-full flex flex-col items-center justify-center py-20">
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
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8 max-w-5xl mx-auto w-full">
          <h1 className="text-white font-heading text-[3rem] sm:text-[4rem] font-bold tracking-normal leading-[1.5em] mb-12 drop-shadow-md">
            Bei uns schmeckt<br />jeder Tag anders.
          </h1>
          <div className="mt-[32px]">
            <Link
              href="/standorte"
              className="btn-sqs w-auto text-center"
            >
              UNSERE STANDORTE
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Tageskarte Preview */}
      <section id="tageskarte" className="py-[40px] min-h-[195px] bg-white px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#6CB78E] text-[42px] font-bold tracking-normal leading-[1.4] mb-4 normal-case">Was heute <br className="md:hidden" />auf den Teller kommt</h2>
            <p className="text-black font-medium text-lg md:text-xl">{dateString}</p>
          </div>

          {/* Promo Cards */}
          <div className="max-w-[980px] mx-auto w-full mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="max-w-[980px] mx-auto w-full flex flex-col gap-4">

              {/* Starters */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[1.5rem] font-bold text-[#131318] m-0 normal-case">Starters</h2>
                  <div className="flex gap-2 items-center text-[1rem] text-[#131318]">
                    <span className="font-normal uppercase">Klein <strong>€4.90</strong></span>
                    <span className="font-bold">/</span>
                    <span className="font-normal uppercase">Gross <strong>€6.90</strong></span>
                  </div>
                </div>
                <div className="border-t border-[#e5e7eb] mb-2"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  {currentMenu.starters?.map((i: any) => renderItemCard(i))}
                </div>
              </div>

              {/* Saladbowl */}
              {currentMenu.salad && currentMenu.salad.name && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[1.5rem] font-bold text-[#131318] m-0 normal-case">Saladbowl</h2>
                    <div className="flex gap-2 items-center text-[1rem] text-[#131318]">
                      <span className="font-normal uppercase">Klein <strong>€7.50</strong></span>
                      <span className="font-bold">/</span>
                      <span className="font-normal uppercase">Gross <strong>€10.90</strong></span>
                    </div>
                  </div>
                  <div className="border-t border-[#e5e7eb] mb-2"></div>
                  <div className="w-full">
                    {renderItemCard(currentMenu.salad)}
                  </div>
                </div>
              )}

              {/* Main Dish */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[1.5rem] font-bold text-[#131318] m-0 normal-case">Main Dish</h2>
                  <div className="flex gap-2 items-center text-[1rem] text-[#131318]">
                    <span className="font-normal uppercase">Klein <strong>€7.50</strong></span>
                    <span className="font-bold">/</span>
                    <span className="font-normal uppercase">Gross <strong>€11.90</strong></span>
                  </div>
                </div>
                <div className="border-t border-[#e5e7eb] mb-2"></div>
                <div className="mb-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {currentMenu.meatMains?.map((i: any) => renderItemCard(i))}
                  </div>
                </div>
                <div className="mb-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {currentMenu.vegetarianMains?.map((i: any) => renderItemCard(i))}
                  </div>
                </div>
              </div>

              {/* Dessert */}
              {currentMenu.dessert && currentMenu.dessert.name && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[1.5rem] font-bold text-[#131318] m-0 normal-case">Dessert</h2>
                    <div className="text-[1rem] text-[#131318]">
                      <strong>€4.50</strong>
                    </div>
                  </div>
                  <div className="border-t border-[#e5e7eb] mb-2"></div>
                  <div className="w-full">
                    {renderItemCard(currentMenu.dessert)}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </section>

      {/* 3. Bei uns ist gutes Essen Alltag */}
      <section className="py-[60px] md:py-[80px] min-h-[195px] bg-[#6CB78E] px-4 md:px-8">
        <div className="max-w-[1440px] mx-auto text-center antialiased">
          <h2 className="text-white text-[2.5rem] sm:text-[3rem] md:text-[47.1px] font-[700] mb-16 leading-[1.1] md:leading-[70.6px] font-heading normal-case">
            Bei uns ist <br className="md:hidden" />gutes Essen Alltag
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="w-[275px] h-[275px] overflow-hidden mb-8 border-none hover:scale-105 transition-transform duration-300 shadow-xl">
                <img src="/images/squarespace/b89191cf-0265-43b0-a6c1-3ca17e419e53_events-and-parties_03.jpg" alt="Täglich andere Gerichte" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-[29.8px] font-bold mb-3 md:mb-4 px-2 font-heading leading-[41.5px] text-center">Täglich andere Gerichte</h3>
              <p className="text-white text-[19.5px] font-normal leading-[29.2px] px-4 md:px-2 font-sans text-center">Abwechslungsreich, ausgewogen - für jeden etwas dabei.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[275px] h-[275px] overflow-hidden mb-8 border-none hover:scale-105 transition-transform duration-300 shadow-xl">
                <img src="/images/squarespace/b9feb942-8959-4a0e-ab86-f7e736d0edc6_06_seasonal_vegetable_soup.jpeg" alt="Frisch & selbst gekocht" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-[29.8px] font-bold mb-3 md:mb-4 px-2 font-heading leading-[41.5px] text-center">Frisch & selbst gekocht</h3>
              <p className="text-white text-[19.5px] font-normal leading-[29.2px] px-4 md:px-2 font-sans text-center">Mit hochwertigen, saisonalen Zutaten – ohne Kompromisse.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[275px] h-[275px] overflow-hidden mb-8 border-none hover:scale-105 transition-transform duration-300 shadow-xl">
                <img src="/images/squarespace/f11870eb-6638-42d9-8c9d-31fc75bcc0b3_qualitat-ohne-kompromisse.jpg" alt="Schnell & unkompliziert" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-[29.8px] font-bold mb-3 md:mb-4 px-2 font-heading leading-[41.5px] text-center">Schnell & unkompliziert</h3>
              <p className="text-white text-[19.5px] font-normal leading-[29.2px] px-4 md:px-2 font-sans text-center">Lunch, der einfach funktioniert - ob vor Ort oder zum Mitnehmen.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[275px] h-[275px] overflow-hidden mb-8 border-none hover:scale-105 transition-transform duration-300 shadow-xl">
                <img src="/images/squarespace/934770c8-4f3f-4b25-a188-56adb7d58b30_pexels-kaboompics-5916.jpg" alt="Fair, ehrlich & gesund" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-[29.8px] font-bold mb-3 md:mb-4 px-2 font-heading leading-[41.5px] text-center">Fair, ehrlich & <br /> gesund</h3>
              <p className="text-white text-[19.5px] font-normal leading-[29.2px] px-4 md:px-2 font-sans text-center">Top Qualität zum vernünftigen Preis. Kein Schnickschnack.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Catering */}

      <section className="py-[95px] bg-white px-4 md:px-8">
        <div className="max-w-[1440px] mx-auto text-center">

          {/* Section heading */}
          <h2 className="text-[#6CB78E] text-[2.5rem] md:text-[47.1px] font-bold font-heading leading-[1.4] mb-8 normal-case">
            Übrigens: Wir können auch Catering
          </h2>

          {/* Description */}
          <p className="text-[#131318] font-sans text-[1.2rem] md:text-[22.9px] font-normal leading-[1.5] max-w-[672px] mx-auto mb-16">
            Ob Office-Lunch, Meeting oder Feier: Unser Essen bringt Geschmack, Frische und ein gutes Gefühl auf den Tisch. <strong>Unkompliziert. Flexibel. Und richtig gut.</strong>
          </p>

          {/* Image Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[860px] mx-auto items-start">
            <Link href="/office-catering" className="group block text-left md:-mt-[49px]">
              <div className="overflow-hidden mb-4">
                <img
                  src="/images/squarespace/de3e785c-8d8a-4df1-bc23-2d6d03b8629c_Office_Catering.jpg"
                  className="w-full h-[471px] object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Office Catering"
                />
              </div>
              <p className="text-black font-sans text-[22.9px] font-normal leading-[34.4px] underline decoration-1 underline-offset-[4.6px]"><strong>Office Catering</strong></p>
            </Link>
            <Link href="/events-partys" className="group block text-left">
              <div className="overflow-hidden mb-4">
                <img
                  src="/images/squarespace/eb20c8fe-1779-442b-8b7b-668b5acc254f_Events__Partys.jpg"
                  className="w-full h-[471px] object-cover group-hover:scale-105 transition-transform duration-700"
                  alt="Events & Partys"
                />
              </div>
              <p className="text-black font-sans text-[22.9px] font-normal leading-[34.4px] underline decoration-1 underline-offset-[4.6px]"><strong>Events &amp; Partys</strong></p>
            </Link>
          </div>

        </div>
      </section>

      {/* 5. Vorgartenstraße */}
      <section className="py-[40px] min-h-[195px] bg-[#E4F1EA] px-4 md:px-8">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="text-black text-[2.8rem] font-bold tracking-normal mb-12 leading-[1.5em] normal-case antialiased"><strong>Vorgartenstraße</strong>, wir sind da!</h2>

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
            className="btn-sqs !bg-black !text-white"
          >
            ALLE STANDORTE ENTDECKEN
          </Link>
        </div>
      </section>

      {/* 6. Instagram */}
      <section className="py-[40px] min-h-[195px] bg-[#6CB78E] px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-white font-heading text-[33.28px] font-bold mb-8 leading-[47.9232px] normal-case">Von der Küche direkt in deinen<br />Feed.</h2>
          <p className="text-white font-sans text-[22.912px] font-normal max-w-[800px] mx-auto mb-16 leading-[34.368px] px-4">
            Eindrücke aus unserem Alltag – Gerichte, Lieblingsmomente und<br />alles, was gesundes Essen besonders macht.
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
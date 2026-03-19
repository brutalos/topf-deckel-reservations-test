import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white py-16 font-sans">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          <div className="flex flex-col col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-6 tracking-tight">Topf&Deckel</h3>
            <p className="text-gray-300 text-[15px] mb-8 font-medium">Geöffnet: Mo.–Fr. 11:00–15:00 Uhr</p>

            <a href="mailto:info@topfdeckel.at" className="text-[#6CB78E] hover:text-white mb-2 text-[15px] font-bold transition-colors">info@topfdeckel.at</a>
            <p className="text-gray-300 text-[15px]">+43 699 111 911 81</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/unsere-geschichte" className="text-gray-300 hover:text-white text-[15px] font-medium transition-colors">Unsere Geschichte</Link>
            <Link href="/franchise" className="text-gray-300 hover:text-white text-[15px] font-medium transition-colors">Franchise</Link>
            <Link href="/jobs" className="text-gray-300 hover:text-white text-[15px] font-medium transition-colors">Jobs</Link>
            <Link href="/kontakt" className="text-gray-300 hover:text-white text-[15px] font-medium transition-colors">Kontakt</Link>
            <Link href="/impressum" className="text-gray-300 hover:text-white text-[15px] font-medium transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-gray-300 hover:text-white text-[15px] font-medium transition-colors">Datenschutz</Link>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/tageskarte" className="text-gray-300 hover:text-white text-[15px] font-medium transition-colors">Tageskarte</Link>
            <Link href="/wochenmenu" className="text-gray-300 hover:text-white text-[15px] font-medium transition-colors">Wochenmenü</Link>
            <Link href="/standorte" className="text-gray-300 hover:text-white text-[15px] font-medium transition-colors">Standorte</Link>
            <Link href="/office-catering" className="text-gray-300 hover:text-white text-[15px] font-medium transition-colors">Office Catering</Link>
            <Link href="/events-partys" className="text-gray-300 hover:text-white text-[15px] font-medium transition-colors">Events & Partys</Link>
          </div>
        </div>

        <div className="pt-8 flex items-center justify-center border-t border-gray-800 mt-8">
          <p className="text-gray-400 text-sm font-medium text-center">© 2026 Topf & Deckel</p>
        </div>
      </div>
    </footer>
  );
}
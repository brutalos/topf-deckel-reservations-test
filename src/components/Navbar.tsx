'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMehrOpen, setIsMehrOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuExpanded, setIsMobileMenuExpanded] = useState(false);
  const [isMobileMehrExpanded, setIsMobileMehrExpanded] = useState(false);
  const pathname = usePathname();

  const isMenuActive = pathname === '/' || pathname.startsWith('/wochenmenu') || pathname.startsWith('/tageskarte');
  const isStandorteActive = pathname.startsWith('/standorte');
  const isOfficeActive = pathname.startsWith('/office-catering');
  const isEventsActive = pathname.startsWith('/events-partys');
  const isMehrActive = pathname.startsWith('/unsere-geschichte') || pathname.startsWith('/franchise') || pathname.startsWith('/jobs') || pathname.startsWith('/kontakt');

  // Hide the global Navbar on the /store page as requested.
  // Also hiding on individual shop pages (e.g. /[storeId]) to restore their isolated look
  if (
    pathname === '/store' ||
    pathname.includes('/track') ||
    pathname.includes('/success') ||
    pathname.includes('/admin') ||
    (pathname.match(/^\/[a-zA-Z0-9-]+$/) && !['/tageskarte', '/wochenmenu', '/standorte', '/office-catering', '/events-partys', '/unsere-geschichte', '/franchise', '/jobs', '/kontakt'].includes(pathname))
  ) {
    return null;
  }

  return (
    <nav className="relative top-0 w-full z-40 bg-white border-b border-gray-100 transition-all duration-300">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8">

        <div className="flex flex-col items-center justify-center pt-6 pb-4 relative">

          {/* Mobile Layout (flex-row) */}
          <div className="md:hidden flex w-full justify-between items-center h-16">
            <button
              className="p-2 text-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img
                src="/images/squarespace/dc8d1fa4-c438-415b-9193-ec3ecbfcd796_topf-deckel-stadtkantine.png"
                alt="Topf & Deckel Logo"
                className="h-[80px] w-auto object-contain"
              />
            </Link>
            <Link href="/store" className="p-2 text-black hover:text-[#6CB78E] transition-colors relative group">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-0 right-0 bg-[#6CB78E] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>

          {/* Desktop Layout */}

          {/* Top Row: Centered Logo + Cart on right */}
          <div className="hidden md:flex w-full justify-center relative mb-4">
            <Link href="/">
              <img
                src="/images/squarespace/dc8d1fa4-c438-415b-9193-ec3ecbfcd796_topf-deckel-stadtkantine.png"
                alt="Topf & Deckel Logo"
                className="h-[168px] w-auto object-contain"
              />
            </Link>

          </div>

          {/* Bottom Row: Navigation Links */}
          <div className="hidden md:flex w-full justify-center relative items-center">
            <div className="flex items-center space-x-10">
              {/* Menü Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <button className={`flex items-center hover:text-gray-600 font-cabin text-[1.1rem] tracking-wide transition-colors py-1 mb-1 ${isMenuActive ? 'text-black border-b-[1.5px] border-black' : 'text-black'}`}>
                  Menü <ChevronDown strokeWidth={3} className={`ml-[0.5em] h-[0.8em] w-[0.8em] transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white shadow-xl py-2 flex flex-col z-50">
                    <Link href="/#tageskarte" className={`px-6 py-3 text-[15px] xl:text-sm hover:text-gray-500 transition-colors font-cabin font-medium text-center ${pathname === '/' ? 'text-black underline underline-offset-4 decoration-2' : 'text-black'}`}>
                      Tageskarte
                    </Link>
                    <Link href="/wochenmenu" className={`px-6 py-3 text-sm hover:text-gray-500 transition-colors font-cabin font-medium text-center ${pathname.startsWith('/wochenmenu') ? 'text-black underline underline-offset-4 decoration-2' : 'text-black'}`}>
                      Wochenmenü
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/standorte" className={`hover:text-gray-600 font-cabin text-[1.1rem] tracking-wide transition-colors py-1 mb-1 ${isStandorteActive ? 'text-black border-b-[1.5px] border-black' : 'text-black'}`}>
                Standorte
              </Link>
              <Link href="/office-catering" className={`hover:text-gray-600 font-cabin text-[1.1rem] tracking-wide transition-colors py-1 mb-1 ${isOfficeActive ? 'text-black border-b-[1.5px] border-black' : 'text-black'}`}>
                Office Catering
              </Link>
              <Link href="/events-partys" className={`hover:text-gray-600 font-cabin text-[1.1rem] tracking-wide transition-colors py-1 mb-1 ${isEventsActive ? 'text-black border-b-[1.5px] border-black' : 'text-black'}`}>
                Events & Partys
              </Link>

              {/* Mehr Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsMehrOpen(true)}
                onMouseLeave={() => setIsMehrOpen(false)}
              >
                <button className={`flex items-center hover:text-gray-600 font-cabin text-[1.1rem] tracking-wide transition-colors py-1 mb-1 ${isMehrActive ? 'text-black border-b-[1.5px] border-black' : 'text-black'}`}>
                  Mehr <ChevronDown strokeWidth={3} className={`ml-[0.5em] h-[0.8em] w-[0.8em] transition-transform ${isMehrOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMehrOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white shadow-xl py-2 flex flex-col z-50">
                    <Link href="/unsere-geschichte" className={`px-6 py-3 text-sm hover:text-gray-500 transition-colors font-cabin font-medium text-center ${pathname.startsWith('/unsere-geschichte') ? 'text-black underline underline-offset-4 decoration-2' : 'text-black'}`}>
                      Unsere Geschichte
                    </Link>
                    <Link href="/franchise" className={`px-6 py-3 text-sm hover:text-gray-500 transition-colors font-cabin font-medium text-center ${pathname.startsWith('/franchise') ? 'text-black underline underline-offset-4 decoration-2' : 'text-black'}`}>
                      Franchise
                    </Link>
                    <Link href="/jobs" className={`px-6 py-3 text-sm hover:text-gray-500 transition-colors font-cabin font-medium text-center ${pathname.startsWith('/jobs') ? 'text-black underline underline-offset-4 decoration-2' : 'text-black'}`}>
                      Jobs
                    </Link>
                    <Link href="/kontakt" className={`px-6 py-3 text-sm hover:text-gray-500 transition-colors font-cabin font-medium text-center ${pathname.startsWith('/kontakt') ? 'text-black underline underline-offset-4 decoration-2' : 'text-black'}`}>
                      Kontakt
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Cart positioned to right of bottom row */}
            <div className="absolute right-0 flex items-center pr-4">
              <Link href="/store" className="p-2 text-black hover:text-[#6CB78E] transition-colors relative group flex items-center">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute top-0 right-0 bg-[#6CB78E] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl z-50 flex flex-col py-2 border-t border-gray-100 h-screen overflow-y-auto pb-32">

            {/* Menü Accordion */}
            <div className="flex flex-col border-b border-gray-50">
              <button
                onClick={() => setIsMobileMenuExpanded(!isMobileMenuExpanded)}
                className={`flex items-center justify-between px-6 py-4 text-base font-cabin font-medium hover:text-[#6CB78E] ${isMenuActive ? 'text-black underline underline-offset-4 decoration-2' : 'text-black'}`}
              >
                Menü
                <ChevronDown strokeWidth={3} className={`h-[0.8em] w-[0.8em] transition-transform ${isMobileMenuExpanded ? 'rotate-180' : ''}`} />
              </button>
              {isMobileMenuExpanded && (
                <div className="flex flex-col bg-gray-50 py-2">
                  <Link href="/#tageskarte" className={`px-10 py-3 text-base font-cabin hover:text-[#6CB78E] ${pathname === '/' ? 'text-black underline underline-offset-4 decoration-2' : 'text-gray-700'}`} onClick={() => setIsMobileMenuOpen(false)}>Tageskarte</Link>
                  <Link href="/wochenmenu" className={`px-10 py-3 text-base font-cabin hover:text-[#6CB78E] ${pathname.startsWith('/wochenmenu') ? 'text-black underline underline-offset-4 decoration-2' : 'text-gray-700'}`} onClick={() => setIsMobileMenuOpen(false)}>Wochenmenü</Link>
                </div>
              )}
            </div>

            <Link href="/standorte" className={`px-6 py-4 border-b border-gray-50 text-base font-cabin font-medium hover:text-[#6CB78E] ${isStandorteActive ? 'text-black underline underline-offset-4 decoration-2' : 'text-black'}`} onClick={() => setIsMobileMenuOpen(false)}>Standorte</Link>
            <Link href="/office-catering" className={`px-6 py-4 border-b border-gray-50 text-base font-cabin font-medium hover:text-[#6CB78E] ${isOfficeActive ? 'text-black underline underline-offset-4 decoration-2' : 'text-black'}`} onClick={() => setIsMobileMenuOpen(false)}>Office Catering</Link>
            <Link href="/events-partys" className={`px-6 py-4 border-b border-gray-50 text-base font-cabin font-medium hover:text-[#6CB78E] ${isEventsActive ? 'text-black underline underline-offset-4 decoration-2' : 'text-black'}`} onClick={() => setIsMobileMenuOpen(false)}>Events & Partys</Link>

            {/* Mehr Accordion */}
            <div className="flex flex-col border-b border-gray-50">
              <button
                onClick={() => setIsMobileMehrExpanded(!isMobileMehrExpanded)}
                className={`flex items-center justify-between px-6 py-4 text-base font-cabin font-medium hover:text-[#6CB78E] ${isMehrActive ? 'text-black underline underline-offset-4 decoration-2' : 'text-black'}`}
              >
                Mehr
                <ChevronDown strokeWidth={3} className={`h-[0.8em] w-[0.8em] transition-transform ${isMobileMehrExpanded ? 'rotate-180' : ''}`} />
              </button>
              {isMobileMehrExpanded && (
                <div className="flex flex-col bg-gray-50 py-2">
                  <Link href="/unsere-geschichte" className={`px-10 py-3 text-base font-cabin hover:text-[#6CB78E] ${pathname.startsWith('/unsere-geschichte') ? 'text-black underline underline-offset-4 decoration-2' : 'text-gray-700'}`} onClick={() => setIsMobileMenuOpen(false)}>Unsere Geschichte</Link>
                  <Link href="/franchise" className={`px-10 py-3 text-base font-cabin hover:text-[#6CB78E] ${pathname.startsWith('/franchise') ? 'text-black underline underline-offset-4 decoration-2' : 'text-gray-700'}`} onClick={() => setIsMobileMenuOpen(false)}>Franchise</Link>
                  <Link href="/jobs" className={`px-10 py-3 text-base font-cabin hover:text-[#6CB78E] ${pathname.startsWith('/jobs') ? 'text-black underline underline-offset-4 decoration-2' : 'text-gray-700'}`} onClick={() => setIsMobileMenuOpen(false)}>Jobs</Link>
                  <Link href="/kontakt" className={`px-10 py-3 text-base font-cabin hover:text-[#6CB78E] ${pathname.startsWith('/kontakt') ? 'text-black underline underline-offset-4 decoration-2' : 'text-gray-700'}`} onClick={() => setIsMobileMenuOpen(false)}>Kontakt</Link>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </nav>
  );
}
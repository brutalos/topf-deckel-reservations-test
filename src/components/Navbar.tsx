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

  // Hide the global Navbar on the /store page as requested.
  // Also hiding on individual shop pages (e.g. /[storeId]) to restore their isolated look
  if (
    pathname === '/store' ||
    pathname.includes('/track') ||
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
                src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/dc8d1fa4-c438-415b-9193-ec3ecbfcd796/topf-deckel-stadtkantine.png?format=1500w"
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
                src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/dc8d1fa4-c438-415b-9193-ec3ecbfcd796/topf-deckel-stadtkantine.png?format=1500w"
                alt="Topf & Deckel Logo"
                className="h-[220px] w-auto object-contain"
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
                <button className="flex items-center text-black hover:text-gray-600 font-sans text-[18px] font-semibold tracking-wide transition-colors py-2">
                  Menü <ChevronDown className={`ml-1 h-5 w-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white shadow-xl py-2 flex flex-col z-50">
                    <Link href="/#tageskarte" className="px-6 py-3 text-[15px] xl:text-sm text-black hover:text-gray-500 transition-colors font-sans font-medium text-center">
                      Tageskarte
                    </Link>
                    <Link href="/wochenmenu" className="px-6 py-3 text-sm text-black hover:text-gray-500 transition-colors font-sans font-medium text-center">
                      Wochenmenü
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/standorte" className="text-black hover:text-gray-600 font-sans text-[18px] font-semibold tracking-wide transition-colors py-2">
                Standorte
              </Link>
              <Link href="/office-catering" className="text-black hover:text-gray-600 font-sans text-[18px] font-semibold tracking-wide transition-colors py-2">
                Office Catering
              </Link>
              <Link href="/events-partys" className="text-black hover:text-gray-600 font-sans text-[18px] font-semibold tracking-wide transition-colors py-2">
                Events & Partys
              </Link>

              {/* Mehr Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsMehrOpen(true)}
                onMouseLeave={() => setIsMehrOpen(false)}
              >
                <button className="flex items-center text-black hover:text-gray-600 font-sans text-[18px] font-semibold tracking-wide transition-colors py-2">
                  Mehr <ChevronDown className={`ml-1 h-5 w-5 transition-transform ${isMehrOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMehrOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white shadow-xl py-2 flex flex-col z-50">
                    <Link href="/unsere-geschichte" className="px-6 py-3 text-sm text-black hover:text-gray-500 transition-colors font-sans font-medium text-center">
                      Unsere Geschichte
                    </Link>
                    <Link href="/franchise" className="px-6 py-3 text-sm text-black hover:text-gray-500 transition-colors font-sans font-medium text-center">
                      Franchise
                    </Link>
                    <Link href="/jobs" className="px-6 py-3 text-sm text-black hover:text-gray-500 transition-colors font-sans font-medium text-center">
                      Jobs
                    </Link>
                    <Link href="/kontakt" className="px-6 py-3 text-sm text-black hover:text-gray-500 transition-colors font-sans font-medium text-center">
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
                className="flex items-center justify-between px-6 py-4 text-base font-sans font-medium text-black hover:text-[#6CB78E]"
              >
                Menü
                <ChevronDown className={`h-5 w-5 transition-transform ${isMobileMenuExpanded ? 'rotate-180' : ''}`} />
              </button>
              {isMobileMenuExpanded && (
                <div className="flex flex-col bg-gray-50 py-2">
                  <Link href="/#tageskarte" className="px-10 py-3 text-base font-sans text-gray-700 hover:text-[#6CB78E]" onClick={() => setIsMobileMenuOpen(false)}>Tageskarte</Link>
                  <Link href="/wochenmenu" className="px-10 py-3 text-base font-sans text-gray-700 hover:text-[#6CB78E]" onClick={() => setIsMobileMenuOpen(false)}>Wochenmenü</Link>
                </div>
              )}
            </div>

            <Link href="/standorte" className="px-6 py-4 border-b border-gray-50 text-base font-sans font-medium text-black hover:text-[#6CB78E]" onClick={() => setIsMobileMenuOpen(false)}>Standorte</Link>
            <Link href="/office-catering" className="px-6 py-4 border-b border-gray-50 text-base font-sans font-medium text-black hover:text-[#6CB78E]" onClick={() => setIsMobileMenuOpen(false)}>Office Catering</Link>
            <Link href="/events-partys" className="px-6 py-4 border-b border-gray-50 text-base font-sans font-medium text-black hover:text-[#6CB78E]" onClick={() => setIsMobileMenuOpen(false)}>Events & Partys</Link>

            {/* Mehr Accordion */}
            <div className="flex flex-col border-b border-gray-50">
              <button
                onClick={() => setIsMobileMehrExpanded(!isMobileMehrExpanded)}
                className="flex items-center justify-between px-6 py-4 text-base font-sans font-medium text-black hover:text-[#6CB78E]"
              >
                Mehr
                <ChevronDown className={`h-5 w-5 transition-transform ${isMobileMehrExpanded ? 'rotate-180' : ''}`} />
              </button>
              {isMobileMehrExpanded && (
                <div className="flex flex-col bg-gray-50 py-2">
                  <Link href="/unsere-geschichte" className="px-10 py-3 text-base font-sans text-gray-700 hover:text-[#6CB78E]" onClick={() => setIsMobileMenuOpen(false)}>Unsere Geschichte</Link>
                  <Link href="/franchise" className="px-10 py-3 text-base font-sans text-gray-700 hover:text-[#6CB78E]" onClick={() => setIsMobileMenuOpen(false)}>Franchise</Link>
                  <Link href="/jobs" className="px-10 py-3 text-base font-sans text-gray-700 hover:text-[#6CB78E]" onClick={() => setIsMobileMenuOpen(false)}>Jobs</Link>
                  <Link href="/kontakt" className="px-10 py-3 text-base font-sans text-gray-700 hover:text-[#6CB78E]" onClick={() => setIsMobileMenuOpen(false)}>Kontakt</Link>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </nav>
  );
}
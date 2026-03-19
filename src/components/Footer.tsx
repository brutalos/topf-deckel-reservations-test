import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <img
              src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/dc8d1fa4-c438-415b-9193-ec3ecbfcd796/topf-deckel-stadtkantine.png?format=1500w"
              alt="Topf & Deckel Logo"
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="mt-4 text-gray-400 font-body text-sm max-w-xs text-center md:text-left">
              Die moderne Stadtkantine mit frischen, saisonalen Gerichten in Wien.
            </p>
          </div>
          <div className="flex flex-wrap justify-center space-x-6">
            <Link href="/store" className="text-gray-400 hover:text-white transition-colors font-body text-sm">
              Finde deinen Store
            </Link>
            <span className="text-gray-400 hover:text-white transition-colors font-body text-sm cursor-pointer">
              Impressum
            </span>
            <span className="text-gray-400 hover:text-white transition-colors font-body text-sm cursor-pointer">
              Datenschutz
            </span>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 font-body text-xs">
          © {new Date().getFullYear()} Topf & Deckel. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
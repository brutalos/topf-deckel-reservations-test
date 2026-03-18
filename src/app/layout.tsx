import type { Metadata } from 'next';
import { Public_Sans, Cabin, Epilogue } from 'next/font/google';
import './globals.css';

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

const cabin = Cabin({
  variable: '--font-cabin',
  subsets: ['latin'],
});

const epilogue = Epilogue({
  variable: '--font-epilogue',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Topf & Deckel',
  description: 'Online Bestellung für Topf & Deckel in Wien',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            async
            defer
          ></script>
        )}
      </head>
      <body
        className={`${publicSans.variable} ${cabin.variable} ${epilogue.variable} font-sans antialiased bg-[#FFFFFF] text-[#2C2C2C]`}
      >
        {children}
      </body>
    </html>
  );
}

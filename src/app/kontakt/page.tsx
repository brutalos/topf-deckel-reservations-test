"use client";

import Link from 'next/link';

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-[#eef7f2] font-body flex flex-col">
      {/* Hero & Form Section (Deep Green) */}
      <section className="bg-[#6db082] pt-32 pb-24 w-full flex flex-col items-center">
        <h1 className="text-white text-5xl md:text-6xl font-bold font-sans tracking-wide mb-16">
          Hast du Fragen?
        </h1>

        {/* Form Container */}
        <div className="w-full max-w-2xl bg-[#f4f4f4] rounded shadow-sm p-8 md:p-12 z-10 mx-4 md:mx-0">
          <h2 className="text-lg font-bold mb-6 font-sans text-[#13141c]">Namen</h2>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const subject = encodeURIComponent('Kontakt Anfrage');
              const body = encodeURIComponent(
                `Name: ${formData.get('vorname')} ${formData.get('nachname')}\nE-Mail: ${formData.get('email')}\n\nNachricht:\n${formData.get('message')}`
              );
              window.location.href = `mailto:info@topfdeckel.at?subject=${subject}&body=${body}`;
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm text-[#13141c] mb-2">
                  Vorname <span className="text-gray-500 font-normal">(erforderlich)</span>
                </label>
                <input
                  type="text"
                  name="vorname"
                  className="w-full p-4 bg-[#eadeea] border-none focus:outline-none focus:ring-1 focus:ring-gray-400 text-[#13141c] transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-[#13141c] mb-2">
                  Nachname <span className="text-gray-500 font-normal">(erforderlich)</span>
                </label>
                <input
                  type="text"
                  name="nachname"
                  className="w-full p-4 bg-[#eadeea] border-none focus:outline-none focus:ring-1 focus:ring-gray-400 text-[#13141c] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-[#13141c] mb-2">
                Email <span className="text-gray-500 font-normal">(erforderlich)</span>
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-4 bg-[#eadeea] border-none focus:outline-none focus:ring-1 focus:ring-gray-400 text-[#13141c] transition-colors"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-[#13141c] mb-2">
                Nachricht <span className="text-gray-500 font-normal">(erforderlich)</span>
              </label>
              <textarea
                rows={6}
                name="message"
                className="w-full p-4 bg-[#eadeea] border-none focus:outline-none focus:ring-1 focus:ring-gray-400 text-[#13141c] resize-none transition-colors"
                required
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-black text-white text-sm tracking-widest font-bold py-5 hover:bg-gray-800 transition-colors uppercase"
              >
                Anfrage abschicken
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Light Green Feed Section */}
      <section className="bg-[#eef7f2] w-full pt-20 pb-16 flex flex-col items-center">
        {/* Social Feed Text */}
        <div className="text-center mb-12 px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-sans text-[#13141c] leading-tight">
            Von der Küche direkt in deinen Feed.
          </h2>
          <p className="text-lg md:text-xl text-[#13141c]">
            Eindrücke aus unserem Alltag – Gerichte, Lieblingsmomente und alles, was gesundes Essen besonders macht.
          </p>
        </div>

        {/* Social Feed Images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-8 w-full max-w-[1600px] mb-16">
          <a
            href="https://www.instagram.com/p/C3lYvffMz13/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full aspect-square cursor-pointer block hover:opacity-90 transition-opacity"
          >
            <img
              src="/images/squarespace/1754497238144-4LJEP3KVTH8BYQ18IU3V_image-asset.jpeg"
              alt="Fennel"
              className="w-full h-full object-cover"
            />
          </a>
          <a
            href="https://www.instagram.com/reel/C3hWiVRtX1M/embed/?autoplay=1"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full aspect-square cursor-pointer block hover:opacity-90 transition-opacity"
          >
            <img
              src="/images/squarespace/1754497239168-H2MRKJOZY43P6W7G6H4F_image-asset.jpeg"
              alt="Pumpkin"
              className="w-full h-full object-cover"
            />
            {/* Play Button Overlay (Optional, for visual match if it was a video) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 flex items-center justify-center text-white opacity-90">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </a>
          <a
            href="https://www.instagram.com/reel/C3DBEjWMMl5/embed/?autoplay=1"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full aspect-square cursor-pointer block hover:opacity-90 transition-opacity"
          >
            <img
              src="/images/squarespace/1754497240319-25HZ64GLEWA1Y9677S3G_image-asset.jpeg"
              alt="Lasagna"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 flex items-center justify-center text-white opacity-90">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </a>
          <a
            href="https://www.instagram.com/reel/C2724cps-xj/embed/?autoplay=1"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full aspect-square cursor-pointer block hover:opacity-90 transition-opacity"
          >
            <img
              src="/images/squarespace/1754497241334-7CZ8XEVV1NE8QNVO0JK5_image-asset.jpeg"
              alt="Person Episode 6"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 flex items-center justify-center text-white opacity-90">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* Instagram Link */}
        <div className="pb-8">
          <a
            href="https://www.instagram.com/Topfdeckel_wien"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black text-xl font-bold border-b-2 border-black pb-1 hover:text-gray-700 hover:border-gray-700 transition-colors"
          >
            Folge uns auf Instagram
          </a>
        </div>
      </section>
    </main>
  );
}


export default function UnsereGeschichtePage() {
  return (
    <main className="min-h-screen pt-12 font-body">
      {/* Hero Video Section — DO NOT MODIFY */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <video src="/video/our-story.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-white text-4xl sm:text-5xl md:text-[56px] font-sans font-extrabold mb-6 tracking-tight drop-shadow-md leading-[1.15]">
            Wofür wir stehen – und warum wir&apos;s tun.
          </h1>
          <p className="text-white/90 text-xl md:text-2xl font-sans font-medium drop-shadow">Vom ersten Topf bis heute.</p>
        </div>
      </section>

      {/* ── Section 1: Bei uns schmeckt jeder Tag anders ── */}
      <section style={{ backgroundColor: '#d9e8df' }} className="py-20 px-4">
        <div className="max-w-[1100px] mx-auto text-center">
          <h2 className="text-3xl md:text-[40px] font-sans font-bold text-foreground mb-4 leading-tight">
            Bei uns schmeckt jeder Tag anders.
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 font-semibold mb-4">
            Das war von Anfang an unser Versprechen.
          </p>
          <p className="text-base md:text-lg text-foreground/70 max-w-3xl mx-auto mb-3 leading-relaxed">
            Topf &amp; Deckel wurde geboren aus einem einfachen Gedanken: Gutes, ehrliches Mittagessen sollte keine Ausnahme sein – sondern Teil eines gesunden Alltags. Inmitten von Wiener Bürohäusern, Termindruck und Kantinenroutine haben wir gesehen, wie viele ihre Pause mit Snacks und Schnelllösungen verbringen.
          </p>
          <p className="text-lg md:text-xl text-foreground font-bold mb-12">
            Wir wollten zeigen: Es geht besser.
          </p>

          {/* Image grid: 1 tall left + 2 stacked right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: tall image */}
            <div className="h-[500px] md:h-[600px] overflow-hidden rounded-xl">
              <img
                src="/images/squarespace/72573d92-c6f3-491f-960a-8e55e42e8055_281A7200-2.jpg"
                alt="Gründer Topf & Deckel"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Right: 2 stacked evenly */}
            <div className="flex flex-col gap-5 h-auto md:h-[600px]">
              <div className="flex-1 min-h-[280px] overflow-hidden rounded-xl">
                <img
                  src="/images/squarespace/069fada0-fd34-4837-aa79-29c78d7cfa9d_281A6858.jpg"
                  alt="Team bei der Arbeit"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-h-[280px] overflow-hidden rounded-xl">
                <img
                  src="/images/squarespace/bf1c4354-0a91-4ff5-9c09-61c950a3d303_events-and-parties_01.jpg"
                  alt="Events Catering"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Wie alles begann ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-3xl md:text-[40px] font-sans font-bold text-center mb-12 leading-tight" style={{ color: '#6eb68c' }}>
            Wie alles begann
          </h2>

          {/* 2×2 masonry grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Top-left: text card */}
            <div className="rounded-xl p-8 md:p-10 flex items-center" style={{ backgroundColor: '#d9e8df' }}>
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                Also haben wir begonnen zu kochen – täglich frisch, saisonal, mit Zutaten, die wir selbst essen würden. Ohne Schnickschnack, aber mit richtig viel Geschmack.
              </p>
            </div>
            {/* Top-right: image */}
            <div className="h-[300px] md:h-auto md:min-h-[350px] overflow-hidden rounded-xl">
              <img
                src="/images/squarespace/b6cc1437-9bf2-4791-b42a-5b09987a0bfb_281A6305.jpg"
                alt="Mitarbeiterin serviert Essen"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Bottom-left: image */}
            <div className="h-[300px] md:h-auto overflow-hidden rounded-xl">
              <img
                src="/images/squarespace/be390e9c-1b86-4647-a79c-68d0a13e063a_281A6448.jpg"
                alt="Topf & Deckel Tasche"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Bottom-right: text card */}
            <div className="rounded-xl p-8 md:p-10 flex items-center" style={{ backgroundColor: '#d9e8df' }}>
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                Was als kleine Take-away-Idee begann, ist heute ein Team aus Küchenmenschen und Gastgeber:innen mit mehreren Standorten in Wien. Unser Ziel: Gerichte, die nicht nur satt machen – sondern richtig gut tun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Was uns wichtig ist ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-3xl md:text-[40px] font-sans font-bold text-center mb-12 leading-tight" style={{ color: '#6eb68c' }}>
            Was uns wichtig ist
          </h2>

          {/* Hero image */}
          <div className="w-full h-[350px] md:h-[500px] overflow-hidden rounded-xl mb-12">
            <img
              src="/images/squarespace/cc25cb29-5695-4c0c-8460-5f296a36e4da_Topf--Deckel-29.-30.7.2025-c-Nadja-Hudovernik_1-115.jpg"
              alt="Topf & Deckel storefront"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text block */}
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <p className="text-lg md:text-xl text-foreground/80 font-semibold leading-relaxed">
              Es geht um Miteinander, Verantwortung, Gesundheit – und Teamgeist.
            </p>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
              Wir glauben, dass ein gutes Mittagessen nicht nur satt macht, sondern auch stärkt: den Körper, die Stimmung, die Verbindung zu anderen.
            </p>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
              Deshalb arbeiten wir mit Herz, mit echter Hands-on-Mentalität und einem Team, auf das wir stolz sind.
            </p>
            <p className="text-lg md:text-xl text-foreground font-bold leading-relaxed">
              Wir sind Topf &amp; Deckel. Und wir kochen, wie man füreinander sorgt.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 4: Unsere Werte ── */}
      <section className="py-20 px-4" style={{ backgroundColor: '#6eb68c' }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-3xl md:text-[40px] font-sans font-bold text-center text-white mb-14 leading-tight">
            Unsere Werte
          </h2>

          <div className="space-y-6 md:space-y-8">
            {/* Value 1: Gesund & echt — Text Left, Image Right */}
            <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-stretch">
              <div className="md:w-5/12 bg-[#f9f9f9] rounded-xl p-8 md:p-10 flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-sans font-bold text-foreground mb-4">Gesund &amp; echt</h3>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                  Wir glauben an frische, ausgewogene Mahlzeiten, die gut schmecken und guttun – ohne künstliche Zusätze, ohne Kompromisse. Was bei uns auf den Teller kommt, ist ehrlich gekocht und selbst gewählt.
                </p>
              </div>
              <div className="md:w-7/12 h-[300px] md:h-[350px] overflow-hidden rounded-xl">
                <img
                  src="/images/squarespace/7f11ab42-1ce1-4eb5-9af6-0fbd226804ec_281A6612.jpg"
                  alt="Essen mit Getränken"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Value 2: Teamspirit & Vertrauen — Image Left, Text Right */}
            <div className="flex flex-col md:flex-row-reverse gap-5 md:gap-8 items-stretch">
              <div className="md:w-5/12 bg-[#f9f9f9] rounded-xl p-8 md:p-10 flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-sans font-bold text-foreground mb-4">Teamspirit &amp; Vertrauen</h3>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                  Gute Küche braucht ein gutes Team. Wir arbeiten auf Augenhöhe – mit Respekt, Wertschätzung und dem Wissen: Qualität entsteht nur, wenn sich alle wohlfühlen.
                </p>
              </div>
              <div className="md:w-7/12 h-[300px] md:h-[350px] overflow-hidden rounded-xl">
                <img
                  src="/images/squarespace/38be31f7-084a-4c11-acaf-242cccb91966_281A7186-2.jpg"
                  alt="Unser Team"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Value 3: Verlässlichkeit & Verantwortung — Text Left, Image Right */}
            <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-stretch">
              <div className="md:w-5/12 bg-[#f9f9f9] rounded-xl p-8 md:p-10 flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-sans font-bold text-foreground mb-4">Verlässlichkeit &amp; Verantwortung</h3>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                  Unsere Gäste zählen auf uns – dafür übernehmen wir Verantwortung. Mit klaren Abläufen, Transparenz und einem nachhaltigen Umgang mit Ressourcen.
                </p>
              </div>
              <div className="md:w-7/12 h-[300px] md:h-[350px] overflow-hidden rounded-xl">
                <img
                  src="/images/squarespace/99a362b4-d5b0-40c9-af89-f846e0b1b1a9_Topf--Deckel-29.-30.7.2025-c-Nadja-Hudovernik_1-155.jpg"
                  alt="Verpackte Speisen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Value 4: Urban & zukunftsgerichtet — Image Left, Text Right */}
            <div className="flex flex-col md:flex-row-reverse gap-5 md:gap-8 items-stretch">
              <div className="md:w-5/12 bg-[#f9f9f9] rounded-xl p-8 md:p-10 flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-sans font-bold text-foreground mb-4">Urban &amp; zukunftsgerichtet</h3>
                <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                  Wir denken Essen neu: urban, mobil, flexibel. Unsere Konzepte passen sich dem Alltag moderner Stadtmenschen an – ohne unsere Prinzipien zu verlieren. Denn Zukunft beginnt mit jeder Mahlzeit. Kurz gesagt: Wir kochen nicht einfach nur. Wir kümmern uns.
                </p>
              </div>
              <div className="md:w-7/12 h-[300px] md:h-[350px] overflow-hidden rounded-xl">
                <img
                  src="/images/squarespace/69bc371c-8491-4240-a1ec-3894fbdd4bcc_281A6957.jpg"
                  alt="Urbanes Essen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}
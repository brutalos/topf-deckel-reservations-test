'use client';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search } from 'lucide-react';
import { stores, getHaversineDistance, StoreConfig } from '@/config/stores';
import { Button } from '@/components/ui/button';
interface StoreWithDistance extends StoreConfig {
  distanceKm: number;
}

export default function Home() {
  const router = useRouter();
  const [rankedStores, setRankedStores] = useState<StoreWithDistance[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;

    setIsSearching(true);
    setError(null);
    setRankedStores(null);

    try {
      // 1. Hit the Google Geocoding REST API directly
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) throw new Error('Google Maps API Key missing in environment.');

      // We append "Vienna, Austria" to ensure accurate local results
      const query = encodeURIComponent(`${addressInput}, Vienna, Austria`);
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`);
      const data = await res.json();

      if (data.status !== 'OK' || data.results.length === 0) {
        throw new Error('Adresse konnte nicht gefunden werden.');
      }

      const userLat = data.results[0].geometry.location.lat;
      const userLon = data.results[0].geometry.location.lng;

      // 2. Calculate distance to all stores via Haversine
      const sorted = stores
        .map((store) => ({
          ...store,
          distanceKm: getHaversineDistance(userLat, userLon, store.lat, store.lon),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm);

      setRankedStores(sorted);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ein Fehler ist aufgetreten.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 bg-background font-body flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl text-center mb-8 mt-12 flex flex-col items-center">
        <img
          src="https://images.squarespace-cdn.com/content/v1/686ba132b57f0f0495047c8a/dc8d1fa4-c438-415b-9193-ec3ecbfcd796/topf-deckel-stadtkantine.png?format=1500w"
          alt="Topf & Deckel Logo"
          className="h-20 md:h-28 object-contain mb-8 hover:scale-105 transition-transform duration-500 will-change-transform"
        />
        {/* <h1 className="text-3xl font-sans font-extrabold tracking-tight text-foreground sm:text-4xl mb-4">
          Willkommen bei Topf & Deckel
        </h1> */}
        <p className="text-lg text-muted-foreground font-body max-w-md mx-auto">
          Gib deine Lieferadresse ein, um den nähesten Store für deine Bestellung zu finden.
        </p>
      </div>

      <Card className="w-full max-w-xl shadow-2xl border-0 ring-1 ring-border bg-card rounded-3xl overflow-hidden">
        <CardHeader className="bg-white rounded-t-xl pb-6 border-b border-border">
          <CardTitle className="text-2xl font-sans text-foreground">Finde deinen Store</CardTitle>
          <CardDescription className="text-base font-body text-muted-foreground">
            Tippe deine Adresse in Wien ein.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 bg-white rounded-b-xl">
          <form onSubmit={handleSearch} className="relative mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
              {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground text-foreground font-body text-lg"
                  placeholder="z.B. Stephansplatz 1"
                  required
                />
              ) : (
                <div className="w-full pl-12 pr-4 py-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-body">
                  FEHLER: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY fehlt in .env.local
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSearching || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              className="h-auto px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-sans text-lg font-bold transition-all"
            >
              {isSearching ? 'Sucht...' : <Search className="w-6 h-6" />}
            </Button>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20 font-body">
              {error}
            </div>
          )}

          {isSearching && (
            <div className="text-center py-8 text-muted-foreground animate-pulse font-body text-lg">
              Suche Stores in deiner Nähe...
            </div>
          )}

          {rankedStores && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
              <h3 className="font-sans font-bold text-foreground mb-4 px-2 text-xl">
                Verfügbare Stores
              </h3>
              {rankedStores.map((store, index) => (
                <div
                  key={store.id}
                  onClick={() => router.push(`/${store.id}`)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${index === 0
                    ? 'border-primary bg-primary text-primary-foreground shadow-xl transform scale-[1.02]'
                    : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                    }`}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <h4 className={`font-sans font-bold text-2xl ${index === 0 ? 'text-primary-foreground' : 'text-foreground'}`}>
                        {store.name}
                      </h4>
                      <p className={`font-body text-base mt-2 ${index === 0 ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                        {store.address}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className={`font-body text-sm font-bold px-3 py-1.5 rounded-lg ${index === 0 ? 'bg-white/20 text-white' : 'bg-secondary text-secondary-foreground'}`}>
                        {store.distanceKm.toFixed(1)} km
                      </span>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
                      <MapPin className="w-32 h-32" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

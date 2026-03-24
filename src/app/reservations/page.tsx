import React from 'react';
import BookingForm from './components/BookingForm';

export default function ReservationsPage() {
    return (
        <div className="min-h-screen bg-[#F8F8F8] pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-[#2C2C2C] tracking-tight">Tisch Reservieren</h1>
                    <p className="text-zinc-500 text-lg max-w-xl mx-auto font-medium">
                        Wählen Sie Ihr Lieblingsrestaurant und sichern Sie sich Ihren Platz für ein köstliches Erlebnis.
                    </p>
                </div>
                
                <BookingForm />

                <div className="grid md:grid-cols-3 gap-6 pt-12">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-2">
                        <h3 className="font-bold text-zinc-900">Öffnungszeiten</h3>
                        <p className="text-sm text-zinc-500">Wir haben täglich von 11:00 bis 15:00 Uhr für Sie geöffnet.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-2">
                        <h3 className="font-bold text-zinc-900">Gruppenbuchungen</h3>
                        <p className="text-sm text-zinc-500">Für Gruppen über 10 Personen kontaktieren Sie uns bitte direkt.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-2">
                        <h3 className="font-bold text-zinc-900">Änderungen</h3>
                        <p className="text-sm text-zinc-500">Sie können Ihre Reservierung bis zu 2 Stunden vor Beginn online ändern.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

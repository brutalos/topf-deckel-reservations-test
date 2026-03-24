'use client';

import React, { useState, useEffect } from 'react';
import { stores, StoreConfig } from '@/config/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
    Calendar, 
    Users, 
    Clock, 
    MapPin, 
    CheckCircle, 
    ChevronRight, 
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { format, addDays, isAfter, startOfToday } from 'date-fns';

type Step = 'location' | 'details' | 'time' | 'guest' | 'success';

export default function BookingForm() {
    const [step, setStep] = useState<Step>('location');
    const [loading, setLoading] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    
    const [formData, setFormData] = useState({
        storeId: '',
        partySize: 2,
        reservationDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        startTime: '',
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        notes: ''
    });

    const [reservation, setReservation] = useState<any>(null);

    const selectedStore = stores.find(s => s.id === formData.storeId);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/reservations/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeId: formData.storeId,
                    partySize: formData.partySize,
                    reservationDate: formData.reservationDate
                })
            });
            const data = await res.json();
            if (data.availableSlots) {
                setAvailableSlots(data.availableSlots);
            }
        } catch (error) {
            toast.error('Fehler beim Laden der Verfügbarkeit');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setReservation(data);
                setStep('success');
                toast.success('Reservierung erfolgreich!');
            } else {
                toast.error(data.error || 'Fehler bei der Reservierung');
            }
        } catch (error) {
            toast.error('Serverfehler');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 'location') setStep('details');
        else if (step === 'details') {
            fetchSlots();
            setStep('time');
        }
        else if (step === 'time') setStep('guest');
    };

    const prevStep = () => {
        if (step === 'details') setStep('location');
        else if (step === 'time') setStep('details');
        else if (step === 'guest') setStep('time');
    };

    if (step === 'success' && reservation) {
        return (
            <Card className="max-w-md mx-auto border-2 border-green-500 bg-white">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-zinc-900">Reservierung Bestätigt!</CardTitle>
                    <CardDescription className="text-zinc-600">
                        Vielen Dank, {reservation.guestName}. Wir freuen uns auf Ihren Besuch!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-zinc-50 rounded-lg space-y-2 text-zinc-800">
                        <div className="flex justify-between">
                            <span className="font-medium">Restaurant:</span>
                            <span>{selectedStore?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Datum:</span>
                            <span>{format(new Date(reservation.reservationDate), 'dd.MM.yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Uhrzeit:</span>
                            <span>{reservation.startTime} Uhr</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Personen:</span>
                            <span>{reservation.partySize}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="font-medium">Referenz:</span>
                            <span className="font-mono text-sm">{reservation.id.split('-')[0].toUpperCase()}</span>
                        </div>
                    </div>
                    
                    <div className="text-center text-sm text-zinc-500">
                        Eine Bestätigungs-E-Mail wurde an {reservation.guestEmail} gesendet.
                    </div>

                    <Button variant="outline" className="w-full text-zinc-900 border-zinc-200" onClick={() => window.location.href = `/reservations/manage/${reservation.editToken}`}>
                        Reservierung verwalten
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-xl mx-auto bg-white border-zinc-200 shadow-xl overflow-hidden">
            <div className="h-2 bg-zinc-100">
                <div 
                    className="h-full bg-[#E51B24] transition-all duration-300" 
                    style={{ width: `${(Object.keys(stepMap).indexOf(step) + 1) * 25}%` }}
                />
            </div>
            
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
                <CardTitle className="text-zinc-900 flex items-center gap-2">
                    {step === 'location' && <><MapPin className="w-5 h-5 text-[#E51B24]" /> Restaurant wählen</>}
                    {step === 'details' && <><Users className="w-5 h-5 text-[#E51B24]" /> Details festlegen</>}
                    {step === 'time' && <><Clock className="w-5 h-5 text-[#E51B24]" /> Uhrzeit wählen</>}
                    {step === 'guest' && <><CheckCircle className="w-5 h-5 text-[#E51B24]" /> Kontaktinformationen</>}
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
                {step === 'location' && (
                    <div className="grid gap-3">
                        {stores.map(store => (
                            <div 
                                key={store.id}
                                onClick={() => setFormData({ ...formData, storeId: store.id })}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                                    formData.storeId === store.id 
                                        ? 'border-[#E51B24] bg-red-50' 
                                        : 'border-zinc-100 hover:border-zinc-200 bg-white'
                                }`}
                            >
                                <div>
                                    <div className="font-bold text-zinc-900">{store.name}</div>
                                    <div className="text-sm text-zinc-500">{store.address}</div>
                                </div>
                                {formData.storeId === store.id && <CheckCircle className="w-6 h-6 text-[#E51B24]" />}
                            </div>
                        ))}
                    </div>
                )}

                {step === 'details' && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="partySize" className="text-zinc-700">Personenanzahl</Label>
                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                                    <Button
                                        key={n}
                                        variant={formData.partySize === n ? 'default' : 'outline'}
                                        onClick={() => setFormData({ ...formData, partySize: n })}
                                        className={`h-12 text-lg ${formData.partySize === n ? 'bg-[#E51B24] text-white hover:bg-[#C4161D]' : 'text-zinc-900 border-zinc-200 hover:bg-zinc-50'}`}
                                    >
                                        {n}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-zinc-700">Datum</Label>
                            <div className="relative">
                                <Input 
                                    id="date"
                                    type="date"
                                    min={format(new Date(), 'yyyy-MM-dd')}
                                    value={formData.reservationDate}
                                    onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
                                    className="h-12 bg-white border-zinc-200 text-zinc-900 pl-10"
                                />
                                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                            </div>
                        </div>
                    </div>
                )}

                {step === 'time' && (
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                                <p>Verfügbarkeit wird geprüft...</p>
                            </div>
                        ) : availableSlots.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2">
                                {availableSlots.map(time => (
                                    <Button
                                        key={time}
                                        variant={formData.startTime === time ? 'default' : 'outline'}
                                        onClick={() => setFormData({ ...formData, startTime: time })}
                                        className={`h-11 ${formData.startTime === time ? 'bg-[#E51B24] text-white hover:bg-[#C4161D]' : 'text-zinc-900 border-zinc-200 hover:bg-zinc-50'}`}
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-zinc-500 border-2 border-dashed rounded-xl border-zinc-100">
                                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p>Keine freien Tische an diesem Tag gefunden.</p>
                                <p className="text-sm">Bitte wählen Sie ein anderes Datum oder eine andere Personenzahl.</p>
                            </div>
                        )}
                    </div>
                )}

                {step === 'guest' && (
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-zinc-700">Name</Label>
                            <Input 
                                id="name"
                                value={formData.guestName}
                                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                                placeholder="Vor- und Nachname"
                                className="h-11 bg-white border-zinc-200 text-zinc-900"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-zinc-700">E-Mail</Label>
                                <Input 
                                    id="email"
                                    type="email"
                                    value={formData.guestEmail}
                                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                                    placeholder="email@beispiel.de"
                                    className="h-11 bg-white border-zinc-200 text-zinc-900"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-zinc-700">Telefon</Label>
                                <Input 
                                    id="phone"
                                    type="tel"
                                    value={formData.guestPhone}
                                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                                    placeholder="+43 123 456789"
                                    className="h-11 bg-white border-zinc-200 text-zinc-900"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes" className="text-zinc-700">Besondere Wünsche (Optional)</Label>
                            <Input 
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="z.B. Allergien, Kinderstuhl, ..."
                                className="h-11 bg-white border-zinc-200 text-zinc-900"
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t border-zinc-100">
                    {step !== 'location' && (
                        <Button variant="ghost" onClick={prevStep} disabled={loading} className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50">
                            <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
                        </Button>
                    )}
                    <div className="ml-auto">
                        {step !== 'guest' ? (
                            <Button 
                                onClick={nextStep} 
                                disabled={
                                    (step === 'location' && !formData.storeId) ||
                                    (step === 'time' && !formData.startTime) ||
                                    loading
                                }
                                className="bg-[#E51B24] text-white hover:bg-[#C4161D] h-12 px-8 rounded-xl font-bold"
                            >
                                Weiter <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleBooking} 
                                disabled={!formData.guestName || !formData.guestEmail || !formData.guestPhone || loading}
                                className="bg-green-600 text-white hover:bg-green-700 h-12 px-8 rounded-xl font-bold"
                            >
                                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Buchung...</> : 'Jetzt Reservieren'}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const stepMap = {
    location: 1,
    details: 2,
    time: 3,
    guest: 4,
    success: 5
};

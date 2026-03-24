'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Calendar, Clock, Users, MapPin, XCircle, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { format, isBefore, subHours, parseISO } from 'date-fns';
import { stores } from '@/config/stores';

export default function GuestManagementPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;
    
    const [reservation, setReservation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    const fetchReservation = async () => {
        try {
            const res = await fetch(`/api/reservations/manage/${token}`);
            const data = await res.json();
            if (res.ok) {
                setReservation(data);
            } else {
                toast.error('Reservierung nicht gefunden');
                router.push('/reservations');
            }
        } catch (error) {
            toast.error('Fehler beim Laden');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservation();
    }, [token]);

    const handleCancel = async () => {
        if (!confirm('Möchten Sie diese Reservierung wirklich stornieren?')) return;
        
        setCancelling(true);
        try {
            const res = await fetch(`/api/reservations/manage/${token}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'CANCEL' })
            });
            if (res.ok) {
                toast.success('Reservierung erfolgreich storniert');
                fetchReservation();
            } else {
                const data = await res.json();
                toast.error(data.error === 'TOO_LATE_TO_MODIFY' ? 'Stornierung zu kurzfristig möglich' : 'Fehler beim Stornieren');
            }
        } catch (error) {
            toast.error('Serverfehler');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <Loader2 className="w-10 h-10 animate-spin text-[#E51B24]" />
            </div>
        );
    }

    if (!reservation) return null;

    const store = stores.find(s => s.id === reservation.storeId);
    const canModify = isBefore(new Date(), subHours(parseISO(`${reservation.reservationDate}T${reservation.startTime}:00`), 2));
    const isCancelled = reservation.status === 'CANCELLED';

    return (
        <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-4">
            <div className="max-w-xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => router.push('/reservations')} className="text-zinc-500 hover:text-zinc-900">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Zurück zur Reservierung
                </Button>

                <Card className="bg-white border-zinc-200 shadow-xl overflow-hidden">
                    <div className={`h-2 ${isCancelled ? 'bg-zinc-300' : 'bg-[#E51B24]'}`} />
                    <CardHeader className="bg-zinc-50 border-b border-zinc-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl font-black text-zinc-900">Ihre Reservierung</CardTitle>
                                <CardDescription className="text-zinc-500">Referenz: {reservation.id.split('-')[0].toUpperCase()}</CardDescription>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                isCancelled ? 'bg-zinc-200 text-zinc-600' : 'bg-green-100 text-green-700'
                            }`}>
                                {reservation.status}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 space-y-8">
                        <div className="grid gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <MapPin className="w-6 h-6 text-[#E51B24]" />
                                </div>
                                <div>
                                    <div className="font-bold text-zinc-900">{store?.name}</div>
                                    <div className="text-sm text-zinc-500">{store?.address}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-50 rounded-xl">
                                        <Calendar className="w-6 h-6 text-[#E51B24]" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-zinc-900">{format(new Date(reservation.reservationDate), 'dd.MM.yyyy')}</div>
                                        <div className="text-sm text-zinc-500">Datum</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-50 rounded-xl">
                                        <Clock className="w-6 h-6 text-[#E51B24]" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-zinc-900">{reservation.startTime} Uhr</div>
                                        <div className="text-sm text-zinc-500">Zeit</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <Users className="w-6 h-6 text-[#E51B24]" />
                                </div>
                                <div>
                                    <div className="font-bold text-zinc-900">{reservation.partySize} Personen</div>
                                    <div className="text-sm text-zinc-500">Gästeanzahl</div>
                                </div>
                            </div>
                        </div>

                        {!isCancelled && (
                            <div className="pt-8 border-t border-zinc-100 space-y-4">
                                {canModify ? (
                                    <Button 
                                        variant="outline" 
                                        onClick={handleCancel}
                                        disabled={cancelling}
                                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-12 rounded-xl font-bold"
                                    >
                                        {cancelling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                                        Reservierung stornieren
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-2 p-4 bg-zinc-50 rounded-xl text-zinc-500 text-sm">
                                        <AlertCircle className="w-5 h-5" />
                                        Stornierungen sind online nur bis zu 2 Stunden vor Beginn möglich. Bitte kontaktieren Sie uns telefonisch.
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {isCancelled && (
                            <div className="p-4 bg-zinc-50 rounded-xl text-zinc-500 text-sm text-center">
                                Diese Reservierung wurde storniert.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

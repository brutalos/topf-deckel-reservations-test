'use client';

import React, { useState, useEffect } from 'react';
import { RESERVATION_CONFIG } from '@/config/reservations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
    format, 
    addMinutes, 
    parseISO, 
    setHours, 
    setMinutes 
} from 'date-fns';
import { 
    Loader2, 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    XCircle, 
    User, 
    Phone, 
    Mail, 
    MessageSquare,
    ExternalLink,
    Utensils,
    Calendar
} from 'lucide-react';

interface TimelineViewProps {
    storeId: string;
    date: string;
    adminKey: string;
}

export default function TimelineView({ storeId, date, adminKey }: TimelineViewProps) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ assignments: any[], blocks: any[] }>({ assignments: [], blocks: [] });
    const [selectedReservation, setSelectedReservation] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const config = RESERVATION_CONFIG[storeId];

    const fetchTimeline = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/${storeId}/reservations/timeline?date=${date}`, {
                headers: { 'Authorization': `Bearer ${adminKey}` }
            });
            const json = await res.json();
            if (res.ok) {
                setData(json);
                // Update selected reservation if it's currently open
                if (selectedReservation) {
                    const updated = json.assignments.find((a: any) => a.reservation.id === selectedReservation.id)?.reservation;
                    if (updated) setSelectedReservation(updated);
                }
            }
        } catch (error) {
            toast.error('Fehler beim Laden der Timeline');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimeline();
    }, [storeId, date, adminKey]);

    if (!config) return null;

    const dayBase = parseISO(`${date}T00:00:00`);
    const slots: string[] = [];
    let current = setMinutes(setHours(dayBase, 11), 0);
    const end = setMinutes(setHours(dayBase, 15), 0);

    while (current < end) {
        slots.push(format(current, 'HH:mm'));
        current = addMinutes(current, 15);
    }

    const getOccupant = (tableId: string, time: string) => {
        const slotDT = `${date}T${time}:00`;
        const assignment = data.assignments.find(a => a.tableId === tableId && a.slotDateTime === slotDT);
        if (assignment) return { type: 'RESERVATION', data: assignment.reservation };
        
        const block = data.blocks.find(b => (b.tableId === tableId || !b.tableId) && b.slotDateTime === slotDT);
        if (block) return { type: 'BLOCK', data: block };

        return null;
    };

    const handleStatusUpdate = async (reservationId: string, status: string) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/admin/reservations/${reservationId}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminKey}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast.success(`Status aktualisiert auf ${status}`);
                await fetchTimeline();
            }
        } catch (error) {
            toast.error('Fehler beim Aktualisieren');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading && data.assignments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                <p>Timeline wird geladen...</p>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
            <div className="space-y-6 overflow-hidden">
                <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b">
                                <th className="p-3 text-left border-r w-32 font-bold text-zinc-900 sticky left-0 bg-zinc-50 z-10">Tisch</th>
                                {slots.map(slot => (
                                    <th key={slot} className="p-3 text-center text-xs font-bold text-zinc-500 border-r min-w-[80px]">
                                        {slot}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {config.tables.map(table => {
                                let skipCount = 0;
                                return (
                                    <tr key={table.id} className="border-b hover:bg-zinc-50/50 transition-colors">
                                        <td className="p-3 border-r font-medium text-zinc-700 sticky left-0 bg-white z-10">
                                            <div className="flex items-center justify-between">
                                                <span>{table.id}</span>
                                                <Badge variant="outline" className="text-[10px] px-1 h-4">{table.capacity}P</Badge>
                                            </div>
                                        </td>
                                        {slots.map((slot, index) => {
                                            if (skipCount > 0) {
                                                skipCount--;
                                                return null;
                                            }

                                            const occupant = getOccupant(table.id, slot);
                                            
                                            if (occupant?.type === 'RESERVATION') {
                                                if (occupant.data.startTime === slot) {
                                                    const span = occupant.data.durationMinutes / 15;
                                                    skipCount = span - 1;
                                                    
                                                    const isSelected = selectedReservation?.id === occupant.data.id;
                                                    
                                                    return (
                                                        <td key={slot} colSpan={span} className="p-1 border-r h-14">
                                                            <div 
                                                                className={`h-full rounded-md p-2 text-[10px] overflow-hidden flex flex-col justify-between cursor-pointer border shadow-sm transition-all hover:scale-[1.01] ${
                                                                    isSelected ? 'ring-2 ring-black border-transparent' : ''
                                                                } ${
                                                                    occupant.data.status === 'SEATED' ? 'bg-green-100 border-green-200 text-green-800' :
                                                                    occupant.data.status === 'CANCELLED' ? 'bg-zinc-100 border-zinc-200 text-zinc-400' :
                                                                    occupant.data.status === 'COMPLETED' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                                                                    'bg-red-50 border-red-100 text-[#E51B24]'
                                                                }`}
                                                                onClick={() => setSelectedReservation(occupant.data)}
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div className="font-bold truncate text-xs">{occupant.data.guestName}</div>
                                                                    <Badge variant="outline" className="text-[9px] px-1 h-3.5 bg-white/50">{occupant.data.partySize}P</Badge>
                                                                </div>
                                                                <div className="flex justify-between items-center opacity-80 mt-1">
                                                                    <span className="font-medium">{occupant.data.startTime}</span>
                                                                    {occupant.data.status === 'SEATED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                } else {
                                                    return <td key={slot} className="p-1 border-r h-14 bg-zinc-50/30" />;
                                                }
                                            }

                                            if (occupant?.type === 'BLOCK') {
                                                return (
                                                    <td key={slot} className="p-1 border-r h-14">
                                                        <div className="h-full bg-zinc-200 rounded-md p-1 flex items-center justify-center opacity-50">
                                                            <AlertCircle className="w-4 h-4 text-zinc-500" />
                                                        </div>
                                                    </td>
                                                );
                                            }

                                            return <td key={slot} className="p-1 border-r h-14" />;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex gap-4 p-4 bg-zinc-50 rounded-xl border text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-100 border border-red-200 rounded" /> Bestätigt
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-100 border border-green-200 rounded" /> Platziert
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-50 border border-blue-100 rounded" /> Abgeschlossen
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-zinc-200 rounded" /> Blockiert
                    </div>
                </div>
            </div>

            {/* Details Panel */}
            <aside className="sticky top-24 space-y-4">
                {selectedReservation ? (
                    <Card className="border-zinc-200 shadow-md animate-in fade-in slide-in-from-right-4">
                        <CardHeader className="p-5 border-b bg-zinc-50/50">
                            <div className="flex justify-between items-start mb-2">
                                <Badge className={`uppercase text-[10px] font-bold ${
                                    selectedReservation.status === 'SEATED' ? 'bg-green-100 text-green-700' :
                                    selectedReservation.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                    'bg-zinc-100 text-zinc-700'
                                }`}>
                                    {selectedReservation.status}
                                </Badge>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedReservation(null)}>
                                    <XCircle className="w-4 h-4 text-zinc-400" />
                                </Button>
                            </div>
                            <CardTitle className="text-xl font-black text-zinc-900">{selectedReservation.guestName}</CardTitle>
                            <CardDescription className="text-zinc-500 text-xs font-mono">#{selectedReservation.id.split('-')[0].toUpperCase()}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-5 space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-zinc-600">
                                    <Clock className="w-4 h-4 text-[#E51B24]" />
                                    <span className="font-bold text-zinc-900">{selectedReservation.startTime} Uhr</span>
                                    <span className="text-zinc-400">({selectedReservation.durationMinutes} Min.)</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-600">
                                    <User className="w-4 h-4 text-[#E51B24]" />
                                    <span className="font-bold text-zinc-900">{selectedReservation.partySize} Personen</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-600">
                                    <Phone className="w-4 h-4 text-zinc-400" />
                                    <span>{selectedReservation.guestPhone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-600">
                                    <Mail className="w-4 h-4 text-zinc-400" />
                                    <span className="truncate">{selectedReservation.guestEmail}</span>
                                </div>
                            </div>

                            {selectedReservation.notes && (
                                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800 space-y-1">
                                    <div className="flex items-center gap-1 font-bold">
                                        <MessageSquare className="w-3 h-3" /> Notiz vom Gast:
                                    </div>
                                    <p>{selectedReservation.notes}</p>
                                </div>
                            )}

                            <div className="space-y-2 pt-4 border-t">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Aktionen</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {selectedReservation.status === 'CONFIRMED' && (
                                        <Button 
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-10"
                                            disabled={isUpdating}
                                            onClick={() => handleStatusUpdate(selectedReservation.id, 'SEATED')}
                                        >
                                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Utensils className="w-4 h-4 mr-2" />}
                                            Gast platzieren
                                        </Button>
                                    )}
                                    {selectedReservation.status === 'SEATED' && (
                                        <Button 
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10"
                                            disabled={isUpdating}
                                            onClick={() => handleStatusUpdate(selectedReservation.id, 'COMPLETED')}
                                        >
                                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                            Besuch abschließen
                                        </Button>
                                    )}
                                    {selectedReservation.status !== 'CANCELLED' && selectedReservation.status !== 'COMPLETED' && (
                                        <Button 
                                            variant="outline" 
                                            className="w-full border-red-100 text-red-600 hover:bg-red-50 font-bold h-10"
                                            disabled={isUpdating}
                                            onClick={() => handleStatusUpdate(selectedReservation.id, 'CANCELLED')}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" /> Stornieren / No-Show
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="p-8 text-center bg-zinc-50 border border-dashed rounded-2xl border-zinc-200 text-zinc-400">
                        <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-widest leading-tight">Keine Auswahl</p>
                        <p className="text-[10px] mt-2">Klicken Sie auf eine Reservierung in der Timeline für Details.</p>
                    </div>
                )}
            </aside>
        </div>
    );
}

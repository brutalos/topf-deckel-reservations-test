'use client';

import React, { useState, useEffect } from 'react';
import { RESERVATION_CONFIG } from '@/config/reservations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
    format, 
    parse, 
    addMinutes, 
    isWithinInterval, 
    parseISO, 
    startOfDay, 
    setHours, 
    setMinutes 
} from 'date-fns';
import { Loader2, Users, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TimelineViewProps {
    storeId: string;
    date: string;
    adminKey: string;
}

export default function TimelineView({ storeId, date, adminKey }: TimelineViewProps) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ assignments: any[], blocks: any[] }>({ assignments: [], blocks: [] });
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

    // Generate slots: 11:00 to 15:00
    // Use the passed date instead of new Date() for consistency
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
                fetchTimeline();
            }
        } catch (error) {
            toast.error('Fehler beim Aktualisieren');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                <p>Timeline wird geladen...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
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
                                        // Handle skipped slots for spanning cells
                                        if (skipCount > 0) {
                                            skipCount--;
                                            return null;
                                        }

                                        const occupant = getOccupant(table.id, slot);
                                        
                                        if (occupant?.type === 'RESERVATION') {
                                            // Only render if this is the START of the reservation
                                            if (occupant.data.startTime === slot) {
                                                const span = occupant.data.durationMinutes / 15;
                                                skipCount = span - 1;
                                                
                                                return (
                                                    <td key={slot} colSpan={span} className="p-1 border-r h-14">
                                                        <div 
                                                            className={`h-full rounded-md p-2 text-[10px] overflow-hidden flex flex-col justify-between cursor-pointer border shadow-sm transition-all hover:scale-[1.02] ${
                                                                occupant.data.status === 'SEATED' ? 'bg-green-100 border-green-200 text-green-800' :
                                                                occupant.data.status === 'CANCELLED' ? 'bg-zinc-100 border-zinc-200 text-zinc-400' :
                                                                'bg-red-50 border-red-100 text-[#E51B24]'
                                                            }`}
                                                            onClick={() => {
                                                                const action = occupant.data.status === 'CONFIRMED' ? 'SEATED' : 
                                                                               occupant.data.status === 'SEATED' ? 'COMPLETED' : null;
                                                                if (action) handleStatusUpdate(occupant.data.id, action);
                                                            }}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="font-bold truncate text-xs">{occupant.data.guestName}</div>
                                                                <Badge variant="outline" className="text-[9px] px-1 h-3.5 bg-white/50">{occupant.data.partySize}P</Badge>
                                                            </div>
                                                            <div className="flex justify-between items-center opacity-80 mt-1">
                                                                <span className="font-medium">{occupant.data.startTime} - {format(addMinutes(parseISO(`${date}T${occupant.data.startTime}:00`), occupant.data.durationMinutes), 'HH:mm')}</span>
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
                    <div className="w-3 h-3 bg-zinc-200 rounded" /> Blockiert
                </div>
                <div className="ml-auto">
                    Klicken Sie auf eine Reservierung, um den Status zu ändern (Bestätigt → Platziert → Abgeschlossen).
                </div>
            </div>
        </div>
    );
}

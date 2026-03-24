'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TimelineView from './components/TimelineView';
import { stores } from '@/config/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar, 
    ChevronLeft, 
    ChevronRight, 
    Search, 
    Users, 
    Clock, 
    MapPin, 
    CalendarDays, 
    LayoutList, 
    GanttChart 
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

export default function AdminReservationsPage() {
    const params = useParams();
    const router = useRouter();
    const storeId = params.storeId as string;
    const store = stores.find(s => s.id === storeId);
    
    const [view, setView] = useState<'timeline' | 'list'>('timeline');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const handlePrevDay = () => setDate(format(subDays(new Date(date), 1), 'yyyy-MM-dd'));
    const handleNextDay = () => setDate(format(addDays(new Date(date), 1), 'yyyy-MM-dd'));
    const handleToday = () => setDate(format(new Date(), 'yyyy-MM-dd'));

    if (!store) return <div className="p-8 text-center text-red-500 font-bold">Store not found</div>;

    return (
        <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-500 mb-1">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/${storeId}`)} className="p-0 h-auto hover:bg-transparent hover:text-zinc-900">
                                <ChevronLeft className="w-4 h-4" /> Zurück zum Dashboard
                            </Button>
                        </div>
                        <h1 className="text-3xl font-black text-zinc-900 flex items-center gap-3">
                            <CalendarDays className="w-8 h-8 text-[#E51B24]" />
                            Reservierungen: {store.name}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 bg-white p-1 border rounded-xl shadow-sm">
                        <Button 
                            variant={view === 'timeline' ? 'default' : 'ghost'} 
                            onClick={() => setView('timeline')}
                            className={`rounded-lg h-9 ${view === 'timeline' ? 'bg-[#E51B24] text-white' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}
                        >
                            <GanttChart className="w-4 h-4 mr-2" /> Timeline
                        </Button>
                        <Button 
                            variant={view === 'list' ? 'default' : 'ghost'} 
                            onClick={() => setView('list')}
                            className={`rounded-lg h-9 ${view === 'list' ? 'bg-[#E51B24] text-white' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}
                        >
                            <LayoutList className="w-4 h-4 mr-2" /> Liste
                        </Button>
                    </div>
                </div>

                {/* Date Controls */}
                <Card className="bg-white border-zinc-200 shadow-sm overflow-hidden">
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={handlePrevDay} className="rounded-lg h-10 w-10 border-zinc-200 text-zinc-500">
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center gap-2 px-4 h-10 border border-zinc-200 rounded-lg bg-zinc-50 font-bold text-zinc-900">
                                <Calendar className="w-4 h-4 text-[#E51B24]" />
                                {format(new Date(date), 'dd. MMMM yyyy')}
                            </div>
                            <Button variant="outline" size="icon" onClick={handleNextDay} className="rounded-lg h-10 w-10 border-zinc-200 text-zinc-500">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" onClick={handleToday} className="text-[#E51B24] hover:bg-red-50 font-bold">Heute</Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                                <Input placeholder="Gast suchen..." className="pl-9 bg-zinc-50 border-zinc-200 rounded-lg h-10" />
                            </div>
                            <Button className="bg-[#E51B24] text-white hover:bg-[#C4161D] h-10 rounded-lg font-bold">
                                + Neue Buchung
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main View */}
                {view === 'timeline' ? (
                    <TimelineView storeId={storeId} date={date} />
                ) : (
                    <div className="text-center py-24 bg-white border border-dashed rounded-2xl text-zinc-400">
                        <LayoutList className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">Listenansicht in Entwicklung</p>
                        <p className="text-sm">Nutzen Sie vorerst die Timeline für alle Aktionen.</p>
                    </div>
                )}

                {/* Footer / Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Card className="bg-white border-zinc-200 shadow-sm">
                        <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <Users className="w-4 h-4" /> Gesamt Gäste
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <div className="text-3xl font-black text-zinc-900">--</div>
                            <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100 h-4 px-1">+12%</Badge> vs. Gestern
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-zinc-200 shadow-sm">
                        <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Erschienen
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <div className="text-3xl font-black text-zinc-900">--</div>
                            <p className="text-[10px] text-zinc-500 mt-1">Ausstehend: --</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-zinc-200 shadow-sm">
                        <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Freie Tische
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <div className="text-3xl font-black text-zinc-900">--</div>
                            <p className="text-[10px] text-zinc-500 mt-1">Kapazität: 10 Tische</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-zinc-200 shadow-sm">
                        <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Durchschn. Aufenthalt
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <div className="text-3xl font-black text-zinc-900">60m</div>
                            <p className="text-[10px] text-zinc-500 mt-1">Konfiguriert</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}

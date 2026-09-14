import { useState, useEffect, useMemo } from 'react';
import { 
    Calendar as CalendarIcon, Clock, Search, ChevronLeft, ChevronRight, 
    X, LayoutGrid, List, CalendarPlus, Sparkles, ArrowRight
} from 'lucide-react';
import { API_BASE_URL, apiFetch } from "@/config/api";
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { 
    parseDateParts, MONTH_NAMES_FULL, 
    WEEKDAY_NAMES_SHORT, getMonthName, 
    formatDateExtensoCompleto 
} from "@/utils/date-format";
import SocialLinksBar from '@/components/shared/SocialLinksBar';
import type { Socials } from "@/types/interfacesTypes";

interface AppEvent {
    _id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
    image?: string;
    socials?: Socials;
}

export default function Eventos() {
    const [events, setEvents] = useState<AppEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const today = useMemo(() => new Date(), []);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1 = Janeiro, 12 = Dezembro
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');

    // Popup Modal do Evento
    const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await apiFetch(`${API_BASE_URL}/api/events`);
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data);
                }
            } catch (error) {
                console.error("Erro ao carregar eventos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Anos disponíveis com base nos eventos e ano atual
    const availableYears = useMemo(() => {
        const yearsSet = new Set<number>([today.getFullYear()]);
        events.forEach(e => {
            const parts = parseDateParts(e.date);
            if (parts?.year) yearsSet.add(parts.year);
        });
        return Array.from(yearsSet).sort((a, b) => a - b);
    }, [events, today]);

    // Contagem de eventos por mês no ano selecionado
    const eventsCountByMonth = useMemo(() => {
        const counts = Array(12).fill(0);
        events.forEach(e => {
            const parts = parseDateParts(e.date);
            if (parts && parts.year === selectedYear && parts.month >= 1 && parts.month <= 12) {
                counts[parts.month - 1]++;
            }
        });
        return counts;
    }, [events, selectedYear]);

    // Mapa de eventos indexados pelo dia do mês selecionado
    const eventsByDay = useMemo(() => {
        const map = new Map<number, AppEvent[]>();
        events.forEach(e => {
            const parts = parseDateParts(e.date);
            if (parts && parts.year === selectedYear && parts.month === selectedMonth) {
                const list = map.get(parts.day) || [];
                list.push(e);
                map.set(parts.day, list);
            }
        });
        return map;
    }, [events, selectedYear, selectedMonth]);

    // Filtro final de eventos para exibição
    const filteredEvents = useMemo(() => {
        return events.filter(e => {
            if (!e.date) return false;
            const parts = parseDateParts(e.date);
            if (!parts) return false;

            if (parts.year !== selectedYear) return false;
            if (parts.month !== selectedMonth) return false;
            if (selectedDay !== null && parts.day !== selectedDay) return false;

            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase();
                const matchName = e.name?.toLowerCase().includes(term);
                const matchDesc = e.description?.toLowerCase().includes(term);
                if (!matchName && !matchDesc) return false;
            }

            return true;
        }).sort((a, b) => {
            const da = parseDateParts(a.date)?.day || 0;
            const db = parseDateParts(b.date)?.day || 0;
            return da - db;
        });
    }, [events, selectedYear, selectedMonth, selectedDay, searchTerm]);

    // Navegação entre meses
    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(prev => prev - 1);
        } else {
            setSelectedMonth(prev => prev - 1);
        }
        setSelectedDay(null);
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(prev => prev + 1);
        } else {
            setSelectedMonth(prev => prev + 1);
        }
        setSelectedDay(null);
    };

    const handleGoToToday = () => {
        setSelectedYear(today.getFullYear());
        setSelectedMonth(today.getMonth() + 1);
        setSelectedDay(today.getDate());
    };

    // Cálculos da grade do calendário mensal
    const daysInMonth = useMemo(() => {
        return new Date(selectedYear, selectedMonth, 0).getDate();
    }, [selectedYear, selectedMonth]);

    const firstDayWeekday = useMemo(() => {
        return new Date(selectedYear, selectedMonth - 1, 1).getDay(); // 0 = Domingo
    }, [selectedYear, selectedMonth]);

    const prevMonthDaysCount = useMemo(() => {
        return new Date(selectedYear, selectedMonth - 1, 0).getDate();
    }, [selectedYear, selectedMonth]);

    const calendarGridCells = useMemo(() => {
        const cells: Array<{
            type: 'prev' | 'current' | 'next';
            dayNumber: number;
            date?: string;
        }> = [];

        // Dias do mês anterior para completar a primeira semana
        for (let i = firstDayWeekday - 1; i >= 0; i--) {
            cells.push({
                type: 'prev',
                dayNumber: prevMonthDaysCount - i,
            });
        }

        // Dias do mês atual
        for (let day = 1; day <= daysInMonth; day++) {
            cells.push({
                type: 'current',
                dayNumber: day,
            });
        }

        // Dias do próximo mês para fechar a grade (múltiplo de 7)
        const totalSoFar = cells.length;
        const remainder = totalSoFar % 7;
        const neededNext = remainder === 0 ? 0 : 7 - remainder;
        for (let day = 1; day <= neededNext; day++) {
            cells.push({
                type: 'next',
                dayNumber: day,
            });
        }

        return cells;
    }, [firstDayWeekday, daysInMonth, prevMonthDaysCount]);

    // Gerador de URL para Google Calendar
    const getGoogleCalendarUrl = (event: AppEvent) => {
        const parts = parseDateParts(event.date);
        if (!parts) return '#';
        const pad = (n: number) => String(n).padStart(2, '0');
        const y = parts.year;
        const m = pad(parts.month);
        const d = pad(parts.day);

        let startIso = `${y}${m}${d}`;
        let endIso = `${y}${m}${d}`;
        if (event.startTime) {
            const [h, min] = event.startTime.split(':').map(Number);
            if (!isNaN(h)) {
                startIso += `T${pad(h)}${pad(min || 0)}00`;
            }
        }
        if (event.endTime) {
            const [h, min] = event.endTime.split(':').map(Number);
            if (!isNaN(h)) {
                endIso += `T${pad(h)}${pad(min || 0)}00`;
            }
        } else {
            endIso = startIso;
        }

        const title = encodeURIComponent(event.name);
        const details = encodeURIComponent(`${event.description || ''}\n\nNaviraí - MS | Visit Naviraí`);
        const location = encodeURIComponent('Naviraí, MS, Brasil');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    };

    const isCurrentMonthToday = today.getFullYear() === selectedYear && (today.getMonth() + 1) === selectedMonth;

    return (
        <div className="min-h-screen bg-(--color-background) flex flex-col">
            <Header />

            {/* Hero Principal do Calendário */}
            <section className="relative bg-linear-to-b from-[#1a1208] via-[#241a06] to-[#1a1208] text-white py-16 md:py-20 px-4 sm:px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(254,187,6,0.12),transparent_50%)] pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles size={14} />
                            Programação Cultural & Festiva
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight drop-shadow-md mb-4 text-[#f0e6d6]">
                            Calendário de Eventos
                        </h1>
                        <p className="text-[#c5b49e] text-base md:text-lg max-w-2xl font-light leading-relaxed">
                            Acompanhe feiras, festivais gastronômicos, celebrações religiosas, torneios esportivos e atrações culturais em Naviraí durante todo o ano.
                        </p>
                    </div>

                    {/* Barra de Busca em Tempo Real */}
                    <div className="w-full md:w-96">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7968] dark:text-[#c5b49e]" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou atração..."
                                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#241a06]/80 text-[#f0e6d6] placeholder:text-[#c5b49e]/60 border border-[#3a2e1a] shadow-xl focus:ring-2 focus:ring-amber-400/50 outline-none transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c5b49e] hover:text-white p-1"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        {searchTerm && (
                            <div className="text-xs text-amber-400/90 mt-2 px-1">
                                Filtrando por: "{searchTerm}" ({filteredEvents.length} resultado{filteredEvents.length !== 1 ? 's' : ''})
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Área Central: Navegação Temporal e Calendário */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-20 w-full grow space-y-8">
                
                {/* Painel de Navegação de Mês e Ano */}
                <div className="bg-white dark:bg-[#241a06] rounded-3xl p-6 shadow-xl border border-[#ede0d8] dark:border-[#3a2e1a] space-y-6">
                    
                    {/* Linha Superior: Mês Atual Extenso + Botões de Navegação + Seletor de Ano + Alternador de Visualização */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#ede0d8] dark:border-[#3a2e1a]">
                        
                        {/* Nome do Mês por Extenso e Ano com Setas */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePrevMonth}
                                title="Mês anterior"
                                className="w-10 h-10 rounded-2xl bg-[#f5ede5] dark:bg-[#2e2310] hover:bg-(--color-primary) text-[#5a4d3e] dark:text-[#c5b49e] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="flex flex-col">
                                <h2 className="text-2xl sm:text-3xl font-black text-[#241a06] dark:text-[#f0e6d6] tracking-tight flex items-center gap-2">
                                    <span className="capitalize">{MONTH_NAMES_FULL[selectedMonth - 1]}</span>
                                    <span className="text-amber-500 font-bold">{selectedYear}</span>
                                </h2>
                                <span className="text-xs text-[#8a7968] dark:text-[#c5b49e]">
                                    {eventsCountByMonth[selectedMonth - 1]} evento{eventsCountByMonth[selectedMonth - 1] !== 1 ? 's' : ''} neste mês
                                </span>
                            </div>

                            <button
                                onClick={handleNextMonth}
                                title="Próximo mês"
                                className="w-10 h-10 rounded-2xl bg-[#f5ede5] dark:bg-[#2e2310] hover:bg-(--color-primary) text-[#5a4d3e] dark:text-[#c5b49e] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Ações Rápidas: Ir para Hoje, Trocar Ano e Modo de Visualização */}
                        <div className="flex flex-wrap items-center gap-3">
                            {!isCurrentMonthToday && (
                                <button
                                    onClick={handleGoToToday}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#f5ede5] dark:bg-[#2e2310] hover:bg-[#ede0d8] dark:hover:bg-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                    <CalendarIcon size={14} className="text-amber-500" />
                                    Ir para Mês Atual
                                </button>
                            )}

                            {/* Dropdown de Ano */}
                            <div className="flex items-center gap-2 bg-[#f5ede5] dark:bg-[#2e2310] px-3 py-1.5 rounded-xl border border-[#ede0d8] dark:border-[#3a2e1a]">
                                <span className="text-xs font-bold text-[#8a7968] dark:text-[#c5b49e] uppercase">Ano:</span>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => {
                                        setSelectedYear(Number(e.target.value));
                                        setSelectedDay(null);
                                    }}
                                    className="bg-transparent font-bold text-sm text-[#241a06] dark:text-[#f0e6d6] outline-none cursor-pointer"
                                >
                                    {availableYears.map(yr => (
                                        <option key={yr} value={yr} className="bg-white dark:bg-[#241a06] text-[#241a06] dark:text-[#f0e6d6]">
                                            {yr}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Alternador de Visualização: Grade Mensal vs Lista */}
                            <div className="flex items-center bg-[#f5ede5] dark:bg-[#2e2310] p-1 rounded-xl border border-[#ede0d8] dark:border-[#3a2e1a]">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-[#1a1208] text-(--color-primary) shadow-sm'
                                            : 'text-[#8a7968] dark:text-[#c5b49e] hover:text-[#241a06] dark:hover:text-[#f0e6d6]'
                                    }`}
                                >
                                    <LayoutGrid size={14} />
                                    Grade Mensal
                                </button>
                                <button
                                    onClick={() => setViewMode('cards')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        viewMode === 'cards'
                                            ? 'bg-white dark:bg-[#1a1208] text-(--color-primary) shadow-sm'
                                            : 'text-[#8a7968] dark:text-[#c5b49e] hover:text-[#241a06] dark:hover:text-[#f0e6d6]'
                                    }`}
                                >
                                    <List size={14} />
                                    Lista Completa
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Seletor dos 12 Meses POR EXTENSO */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#8a7968] dark:text-[#c5b49e]">
                                Selecione o Mês por Extenso:
                            </span>
                            {selectedDay && (
                                <button
                                    onClick={() => setSelectedDay(null)}
                                    className="text-xs font-bold text-(--color-primary) hover:underline cursor-pointer"
                                >
                                    Limpar filtro de dia (Ver todo o mês)
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 customized-scrollbar">
                            {MONTH_NAMES_FULL.map((monthName, idx) => {
                                const mNum = idx + 1;
                                const isCurrent = mNum === selectedMonth;
                                const count = eventsCountByMonth[idx];
                                const isTodayMonth = today.getFullYear() === selectedYear && (today.getMonth() + 1) === mNum;

                                return (
                                    <button
                                        key={monthName}
                                        onClick={() => {
                                            setSelectedMonth(mNum);
                                            setSelectedDay(null);
                                        }}
                                        className={`shrink-0 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 border ${
                                            isCurrent
                                                ? 'bg-(--color-primary) text-white border-(--color-primary) shadow-md scale-105 z-10'
                                                : 'bg-white dark:bg-[#1a1208] text-[#5a4d3e] dark:text-[#c5b49e] border-[#ede0d8] dark:border-[#3a2e1a] hover:bg-[#f5ede5] dark:hover:bg-[#2e2310] hover:text-[#241a06] dark:hover:text-[#f0e6d6]'
                                        }`}
                                    >
                                        <span>{monthName}</span>
                                        {count > 0 && (
                                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                                                isCurrent 
                                                    ? 'bg-white text-(--color-primary)' 
                                                    : 'bg-amber-400/20 text-amber-700 dark:text-amber-400'
                                            }`}>
                                                {count}
                                            </span>
                                        )}
                                        {isTodayMonth && !isCurrent && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-(--color-primary)" title="Mês Atual" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* VISÃO 1: GRADE MENSAL DO CALENDÁRIO */}
                {viewMode === 'grid' && (
                    <div className="bg-white dark:bg-[#241a06] rounded-3xl p-4 sm:p-6 shadow-xl border border-[#ede0d8] dark:border-[#3a2e1a] space-y-4">
                        
                        {/* Dias da Semana (Dom a Sáb) */}
                        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm font-black text-[#8a7968] dark:text-[#c5b49e] uppercase tracking-wider pb-2 border-b border-[#ede0d8] dark:border-[#3a2e1a]">
                            {WEEKDAY_NAMES_SHORT.map((wd, i) => (
                                <div key={wd} className={i === 0 || i === 6 ? 'text-amber-600 dark:text-amber-400' : ''}>
                                    {wd}
                                </div>
                            ))}
                        </div>

                        {/* Grade de Células dos Dias */}
                        <div className="grid grid-cols-7 gap-1 sm:gap-2">
                            {calendarGridCells.map((cell, idx) => {
                                const isCurrentMonth = cell.type === 'current';
                                const dayEvents = isCurrentMonth ? (eventsByDay.get(cell.dayNumber) || []) : [];
                                const hasEvents = dayEvents.length > 0;
                                const isSelected = isCurrentMonth && selectedDay === cell.dayNumber;
                                const isToday = isCurrentMonth && isCurrentMonthToday && today.getDate() === cell.dayNumber;

                                if (!isCurrentMonth) {
                                    return (
                                        <div
                                            key={`pad-${idx}`}
                                            className="min-h-16 sm:min-h-24 p-2 rounded-2xl bg-[#faf5f0]/40 dark:bg-[#1a1208]/30 border border-transparent text-[#8a7968]/30 dark:text-[#c5b49e]/20 text-xs sm:text-sm font-medium flex flex-col justify-between select-none"
                                        >
                                            <span>{cell.dayNumber}</span>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={`day-${cell.dayNumber}`}
                                        onClick={() => setSelectedDay(isSelected ? null : cell.dayNumber)}
                                        className={`min-h-18 sm:min-h-24 p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                                            isSelected
                                                ? 'bg-amber-400/15 dark:bg-amber-400/20 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                                                : hasEvents
                                                    ? 'bg-white dark:bg-[#2e2310] border-emerald-500/40 hover:border-(--color-primary) shadow-sm hover:shadow-md'
                                                    : 'bg-white dark:bg-[#1a1208] border-[#ede0d8] dark:border-[#3a2e1a] hover:bg-[#f5ede5] dark:hover:bg-[#241a06]'
                                        }`}
                                    >
                                        {/* Cabeçalho do Dia */}
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs sm:text-base font-black ${
                                                isToday
                                                    ? 'w-6 h-6 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-xs'
                                                    : isSelected
                                                        ? 'text-amber-600 dark:text-amber-400 font-black'
                                                        : 'text-[#241a06] dark:text-[#f0e6d6]'
                                            }`}>
                                                {cell.dayNumber}
                                            </span>

                                            {hasEvents && (
                                                <span className="flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                                    <span className="hidden sm:inline text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                                        {dayEvents.length}
                                                    </span>
                                                </span>
                                            )}
                                        </div>

                                        {/* Lista rápida de eventos na célula (telas médias/grandes) */}
                                        <div className="space-y-1 mt-1">
                                            {dayEvents.slice(0, 2).map((ev) => (
                                                <div
                                                    key={ev._id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedEvent(ev);
                                                    }}
                                                    title={ev.name}
                                                    className="hidden sm:block truncate text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-(--color-primary)/10 text-(--color-primary) dark:text-emerald-300 hover:bg-(--color-primary) hover:text-white transition-colors"
                                                >
                                                    {ev.name}
                                                </div>
                                            ))}
                                            {dayEvents.length > 2 && (
                                                <span className="hidden sm:block text-[10px] font-bold text-[#8a7968] dark:text-[#c5b49e]">
                                                    +{dayEvents.length - 2} mais
                                                </span>
                                            )}
                                            {dayEvents.length > 0 && (
                                                <div className="sm:hidden flex justify-center mt-1">
                                                    <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-[#241a06] text-[9px] font-black">
                                                        {dayEvents.length}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* SEÇÃO DE LISTA DE EVENTOS DO MÊS / DIA SELECIONADO */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-black text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2.5">
                                <CalendarIcon className="text-(--color-primary)" />
                                {selectedDay ? (
                                    <span>
                                        Eventos em {selectedDay} de {MONTH_NAMES_FULL[selectedMonth - 1]} de {selectedYear}
                                    </span>
                                ) : (
                                    <span>
                                        Programação de {MONTH_NAMES_FULL[selectedMonth - 1]} de {selectedYear}
                                    </span>
                                )}
                            </h3>
                            <p className="text-sm text-[#8a7968] dark:text-[#c5b49e] mt-1">
                                {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} {selectedDay ? 'nesta data' : 'neste mês'}
                            </p>
                        </div>

                        {selectedDay && (
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#f5ede5] dark:bg-[#2e2310] hover:bg-[#ede0d8] dark:hover:bg-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] transition-colors cursor-pointer w-fit"
                            >
                                <ArrowRight size={14} />
                                Ver todos os eventos de {MONTH_NAMES_FULL[selectedMonth - 1]}
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-24">
                            <div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {filteredEvents.map(event => {
                                const parts = parseDateParts(event.date);
                                const monthExtenso = parts ? getMonthName(parts.month) : '';
                                const fullDateExtenso = formatDateExtensoCompleto(event.date);

                                return (
                                    <div
                                        key={event._id}
                                        onClick={() => setSelectedEvent(event)}
                                        className="bg-white dark:bg-[#241a06] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-[#ede0d8] dark:border-[#3a2e1a] hover:border-(--color-primary)/40 transition-all duration-300 group cursor-pointer flex flex-col transform hover:-translate-y-1"
                                    >
                                        {/* Imagem do Evento com Badge de Data Extensa */}
                                        <div className="h-56 relative overflow-hidden bg-[#f5ede5] dark:bg-[#1a1208]">
                                            <img
                                                src={event.image || "/fejunavi.png"}
                                                alt={event.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                            {/* Badge com Mês Por Extenso */}
                                            <div className="absolute top-4 right-4 bg-white/95 dark:bg-[#1a1208]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl flex flex-col items-center shadow-lg border border-[#ede0d8] dark:border-[#3a2e1a]">
                                                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider leading-none mb-1">
                                                    {monthExtenso}
                                                </span>
                                                <span className="text-2xl font-black text-[#241a06] dark:text-[#f0e6d6] leading-none">
                                                    {parts?.day}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Detalhes do Card */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 uppercase tracking-wider">
                                                <CalendarIcon size={14} />
                                                <span>{fullDateExtenso}</span>
                                            </div>

                                            <h4 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] mb-3 group-hover:text-(--color-primary) transition-colors line-clamp-2">
                                                {event.name}
                                            </h4>

                                            <div className="flex items-center gap-2 text-sm text-[#8a7968] dark:text-[#c5b49e] mb-4">
                                                <Clock size={16} className="text-(--color-primary) shrink-0" />
                                                <span>{event.startTime} - {event.endTime}</span>
                                            </div>

                                            <p className="text-[#5a4d3e] dark:text-[#c5b49e] text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                                {event.description}
                                            </p>

                                            {/* Rodapé do Card com Ações */}
                                            <div className="mt-auto pt-4 border-t border-[#ede0d8] dark:border-[#3a2e1a] flex items-center justify-between gap-3">
                                                <a
                                                    href={getGoogleCalendarUrl(event)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    title="Salvar no Google Agenda"
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5a4d3e] dark:text-[#c5b49e] hover:text-(--color-primary) transition-colors"
                                                >
                                                    <CalendarPlus size={15} />
                                                    Salvar na Agenda
                                                </a>

                                                <span className="inline-flex items-center gap-1 text-sm font-bold text-(--color-primary) group-hover:translate-x-0.5 transition-transform">
                                                    Detalhes
                                                    <ChevronRight size={16} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State Acolhedor */
                        <div className="text-center py-20 px-4 bg-white dark:bg-[#241a06] rounded-3xl border border-dashed border-[#ede0d8] dark:border-[#3a2e1a]">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-[#f5ede5] dark:bg-[#1a1208] flex items-center justify-center text-[#8a7968]">
                                <CalendarIcon size={40} className="opacity-40" />
                            </div>
                            <h4 className="text-2xl font-bold text-[#241a06] dark:text-[#f0e6d6] mb-2">
                                Nenhum evento encontrado
                            </h4>
                            <p className="text-[#8a7968] dark:text-[#c5b49e] max-w-md mx-auto text-sm leading-relaxed mb-6">
                                {selectedDay
                                    ? `Não encontramos eventos marcados para o dia ${selectedDay} de ${MONTH_NAMES_FULL[selectedMonth - 1]}.`
                                    : `Ainda não há eventos cadastrados para o mês de ${MONTH_NAMES_FULL[selectedMonth - 1]} de ${selectedYear}.`}
                            </p>
                            
                            <div className="flex flex-wrap justify-center gap-3">
                                {selectedDay && (
                                    <button
                                        onClick={() => setSelectedDay(null)}
                                        className="px-5 py-2.5 rounded-xl bg-(--color-primary) text-white font-bold text-sm shadow-md hover:bg-(--color-forest-green-400) transition-colors cursor-pointer"
                                    >
                                        Ver mês de {MONTH_NAMES_FULL[selectedMonth - 1]} completo
                                    </button>
                                )}
                                {eventsCountByMonth.some(c => c > 0) && (
                                    <button
                                        onClick={() => {
                                            const firstWithEvents = eventsCountByMonth.findIndex(c => c > 0);
                                            if (firstWithEvents !== -1) {
                                                setSelectedMonth(firstWithEvents + 1);
                                                setSelectedDay(null);
                                            }
                                        }}
                                        className="px-5 py-2.5 rounded-xl bg-[#ede0d8] dark:bg-[#2e2310] text-[#241a06] dark:text-[#f0e6d6] font-bold text-sm hover:bg-[#e0d0c4] dark:hover:bg-[#3a2e1a] transition-colors cursor-pointer"
                                    >
                                        Explorar meses com eventos
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal de Detalhes do Evento */}
            {selectedEvent && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" 
                    onClick={() => setSelectedEvent(null)}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" />

                    <div
                        className="bg-white dark:bg-[#241a06] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col border border-[#ede0d8] dark:border-[#3a2e1a]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        {/* Banner do Modal */}
                        <div className="w-full h-64 sm:h-80 relative shrink-0 bg-[#1a1208]">
                            <img
                                src={selectedEvent.image || "/fejunavi.png"}
                                alt={selectedEvent.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                            <div className="absolute bottom-6 left-6 right-6">
                                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg mb-3">
                                    {selectedEvent.name}
                                </h2>
                                <div className="flex flex-wrap gap-2.5">
                                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-white font-semibold text-xs sm:text-sm">
                                        <CalendarIcon size={16} className="text-amber-400" /> 
                                        {formatDateExtensoCompleto(selectedEvent.date)}
                                    </span>
                                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-white font-semibold text-xs sm:text-sm">
                                        <Clock size={16} className="text-amber-400" /> 
                                        {selectedEvent.startTime} - {selectedEvent.endTime}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo do Modal */}
                        <div className="p-6 sm:p-8 overflow-y-auto customized-scrollbar space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">
                                    Sobre o Evento
                                </h4>
                                <p className="text-[#241a06] dark:text-[#f0e6d6] leading-relaxed whitespace-pre-wrap text-base sm:text-lg font-light">
                                    {selectedEvent.description}
                                </p>
                            </div>

                            {/* Botão de Adicionar ao Calendário */}
                            <div className="p-4 rounded-2xl bg-[#f5ede5] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center shrink-0">
                                        <CalendarPlus size={20} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-sm text-[#241a06] dark:text-[#f0e6d6]">
                                            Deseja ser lembrado?
                                        </h5>
                                        <p className="text-xs text-[#8a7968] dark:text-[#c5b49e]">
                                            Adicione à sua agenda do Google em 1 clique
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={getGoogleCalendarUrl(selectedEvent)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2.5 rounded-xl bg-(--color-primary) text-white font-bold text-xs hover:bg-(--color-forest-green-400) transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
                                >
                                    <CalendarPlus size={15} />
                                    Salvar no Google Agenda
                                </a>
                            </div>

                            {/* Redes Sociais se houver */}
                            {selectedEvent.socials && (
                                <div className="pt-4 border-t border-[#ede0d8] dark:border-[#3a2e1a]">
                                    <h4 className="text-xs font-bold text-[#8a7968] dark:text-[#c5b49e] uppercase tracking-wider mb-3">
                                        Canais do Organizador
                                    </h4>
                                    <SocialLinksBar socials={selectedEvent.socials} />
                                </div>
                            )}
                        </div>

                        {/* Rodapé do Modal */}
                        <div className="p-4 sm:p-6 bg-[#f5ede5] dark:bg-[#1a1208] border-t border-[#ede0d8] dark:border-[#3a2e1a] flex justify-end">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="px-6 py-2.5 rounded-xl bg-[#ede0d8] dark:bg-[#2e2310] text-[#241a06] dark:text-[#f0e6d6] hover:bg-[#e0d0c4] dark:hover:bg-[#3a2e1a] font-bold text-sm transition-colors cursor-pointer"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Search, ChevronRight, X } from 'lucide-react';
import { API_BASE_URL, apiFetch } from "@/config/api";
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { formatDateDisplay, parseDateParts } from "@/utils/date-format";

interface AppEvent {
    _id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
    image?: string;
}

export default function Eventos() {
    const [events, setEvents] = useState<AppEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const currentDate = new Date();
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Popup Modal
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
                console.error("Erro ao buscar eventos", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    // Anos baseados nos eventos + ano atual
    const availableYears = Array.from(new Set([
        currentDate.getFullYear(),
        ...events
            .map(e => parseDateParts(e.date)?.year)
            .filter((year): year is number => typeof year === 'number')
    ])).sort((a, b) => b - a);

    // Linha do Tempo (Dias do mês selecionado)
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getDayName = (day: number) => {
        const date = new Date(selectedYear, selectedMonth - 1, day);
        return ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][date.getDay()];
    };

    const hasEventsOnDay = (day: number) => {
        return events.some(e => {
            const parts = parseDateParts(e.date);
            return parts?.year === selectedYear && parts?.month === selectedMonth && parts?.day === day;
        });
    };

    // Filtro Final
    const filteredEvents = events.filter(e => {
        if (!e.date) return false;
        const parts = parseDateParts(e.date);
        if (!parts) return false;
        const { year: y, month: m, day: d } = parts;

        if (y !== selectedYear) return false;
        if (m !== selectedMonth) return false;
        if (selectedDay !== null && d !== selectedDay) return false;
        if (searchTerm && !e.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

        return true;
    });

    return (
        <div className="min-h-screen bg-(--color-background)">
            {/* Header Arrojado */}
            <Header />
            <div className="bg-(--color-primary) text-white py-16 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Descubra os Eventos</h1>
                        <p className="text-(--color-primary-light) text-lg max-w-xl">
                            Fique por dentro de tudo que acontece em Naviraí. Festivais, shows, palestras e muito mais.
                        </p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar evento..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-800 shadow-xl focus:ring-4 focus:ring-white/20 outline-none transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8 space-y-10 mb-16px">
                {/* Filtros Glassmorphism */}
                <div className="bg-white/70 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-sm space-y-8">

                    {/* Anos e Meses */}
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Ano</span>
                            <select
                                className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-(--color-primary) outline-none"
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(Number(e.target.value));
                                    setSelectedDay(null);
                                }}
                            >
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <div className="w-px h-8 bg-slate-200 hidden md:block"></div>

                        <div className="flex-1 w-full overflow-x-auto hide-scrollbar">
                            <div className="flex gap-2 min-w-max">
                                {months.map((month, idx) => {
                                    const mNumber = idx + 1;
                                    const isActive = mNumber === selectedMonth;
                                    return (
                                        <button
                                            key={month}
                                            onClick={() => {
                                                setSelectedMonth(mNumber);
                                                setSelectedDay(null);
                                            }}
                                            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer
                                                ${isActive
                                                    ? 'bg-(--color-primary) text-white shadow-md shadow-(--color-primary)/20 scale-105'
                                                    : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200'}`}
                                        >
                                            {month}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Linha do Tempo (Dias) */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Linha do Tempo (Dias com eventos marcados com bolinha)</span>
                            {selectedDay && (
                                <button onClick={() => setSelectedDay(null)} className="text-xs font-bold text-(--color-primary) hover:underline cursor-pointer">
                                    Ver mês completo
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4 pt-2 px-2 -mx-2">
                            {daysArray.map(day => {
                                const hasEvent = hasEventsOnDay(day);
                                const isSelected = selectedDay === day;
                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(isSelected ? null : day)}
                                        className={`shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-2xl transition-all relative cursor-pointer
                                            ${isSelected ? 'bg-(--color-forest-green-500) text-white shadow-lg scale-110 z-10' :
                                                hasEvent ? 'bg-white border-2 border-(--color-primary)/30 text-slate-800 hover:border-(--color-primary)' :
                                                    'bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-100'}
                                        `}
                                    >
                                        <span className="text-[10px] uppercase font-bold opacity-70 mb-1">{getDayName(day)}</span>
                                        <span className="text-lg font-black leading-none">{day}</span>
                                        {hasEvent && !isSelected && (
                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 border-2 border-white rounded-full"></span>
                                        )}
                                        {hasEvent && isSelected && (
                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Lista de Eventos */}
                <div>
                    <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                        <CalendarIcon className="text-(--color-primary)" />
                        {selectedDay ? `Eventos em ${selectedDay} de ${months[selectedMonth - 1]}` : `Eventos de ${months[selectedMonth - 1]}`}
                    </h3>

                    {loading ? (
                        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div></div>
                    ) : filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {filteredEvents.map(event => (
                                <div
                                    key={event._id}
                                    onClick={() => setSelectedEvent(event)}
                                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-(--color-primary)/30 transition-all duration-300 group cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
                                >
                                    <div className="h-56 relative overflow-hidden bg-slate-100">
                                        <img
                                            src={event.image || "https://placehold.co/600x400"}
                                            alt={event.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex flex-col items-center shadow-lg">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-0.5">{months[(parseDateParts(event.date)?.month ?? 1) - 1]}</span>
                                            <span className="text-xl font-black text-(--color-primary) leading-none">{parseDateParts(event.date)?.day}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-(--color-primary) transition-colors line-clamp-2">{event.name}</h4>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                            <Clock size={16} className="text-(--color-primary)" />
                                            <span>{event.startTime} - {event.endTime}</span>
                                        </div>
                                        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
                                            {event.description}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-(--color-primary) font-bold text-sm">Ver detalhes</span>
                                            <div className="w-8 h-8 rounded-full bg-(--color-primary)/10 flex items-center justify-center text-(--color-primary) group-hover:bg-(--color-primary) group-hover:text-white transition-colors">
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                            <CalendarIcon size={64} className="mx-auto mb-4 text-slate-200" />
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum evento encontrado</h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Não encontramos nenhum evento agendado para {selectedDay ? `o dia ${selectedDay}` : 'este mês'}. Tente selecionar outra data.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Popup Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedEvent(null)}>
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"></div>

                    <div
                        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="absolute top-4 right-4 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-full h-64 sm:h-80 relative shrink-0">
                            <img
                                src={selectedEvent.image || "https://placehold.co/800x400"}
                                alt={selectedEvent.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>

                            <div className="absolute bottom-6 left-6 right-6">
                                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg mb-2">{selectedEvent.name}</h2>
                                <div className="flex flex-wrap gap-3">
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white font-semibold text-sm">
                                        <CalendarIcon size={16} /> {formatDateDisplay(selectedEvent.date)}
                                    </span>
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white font-semibold text-sm">
                                        <Clock size={16} /> {selectedEvent.startTime} - {selectedEvent.endTime}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 overflow-y-auto customized-scrollbar">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Sobre o evento</h4>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                                {selectedEvent.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function EventsWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Buscar eventos dinamicamente
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`http://localhost:${import.meta.env.VITE_API_PORT}/api/events`);
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

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const calendarDays = Array(firstDayOfMonth).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    // Filtra os eventos dinâmicos que caem no mês atual (assumindo que event.date venha como 'YYYY-MM-DD')
    const monthEvents = events.filter(event => {
        if (!event.date) return false;
        const [year, month] = event.date.split('-').map(Number);
        return year === currentDate.getFullYear() && month - 1 === currentDate.getMonth();
    });

    const hasEventOnDay = (day: number | null) => {
        if (!day) return false;
        return monthEvents.some(event => {
            const [, , eventDay] = event.date.split('-').map(Number);
            return eventDay === day;
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 bg-(--color-neutral-white) p-6 rounded-2xl shadow-xl max-w-5xl mx-auto border border-(--color-neutral-gray)/20">
            {/* Esquerda: Calendário */}
            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-(--color-text-header) font-bold text-2xl flex items-center gap-2">
                        <CalendarIcon className="text-(--color-primary)" />
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 bg-(--color-background) hover:bg-(--color-primary) hover:text-white rounded-full transition-colors"><ChevronLeft size={20} /></button>
                        <button onClick={nextMonth} className="p-2 bg-(--color-background) hover:bg-(--color-primary) hover:text-white rounded-full transition-colors"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-bold text-(--color-neutral-gray)">
                    <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-(--color-text-body)">
                    {calendarDays.map((day, idx) => (
                        <div key={idx} className={`
                                flex items-center justify-center rounded-lg h-12 text-sm md:text-base font-medium relative transition-all duration-300
                                ${day ? 'hover:bg-(--color-background) cursor-pointer' : ''} 
                                ${hasEventOnDay(day) ? 'bg-(--color-primary) text-white font-bold shadow-md hover:bg-(--color-primary-dark)' : ''}
                            `}>
                            {day}
                            {hasEventOnDay(day) && <span className="absolute bottom-2 w-1.5 h-1.5 bg-(--color-accent-gold) rounded-full"></span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Direita: Lista Dinâmica de Eventos */}
            <div className="flex flex-col border-t md:border-t-0 md:border-l border-(--color-neutral-gray)/20 pt-6 md:pt-0 md:pl-8">
                <h4 className="text-xl font-bold text-(--color-text-header) mb-6">Eventos do Mês</h4>

                {loading ? (
                    <div className="flex-1 flex justify-center items-center"><div className="animate-spin w-8 h-8 border-4 border-(--color-primary) border-t-transparent rounded-full"></div></div>
                ) : (
                    <div className="flex-1 overflow-y-auto max-h-[350px] pr-2 space-y-4 customized-scrollbar">
                        {monthEvents.length > 0 ? (
                            monthEvents.map((event, idx) => {
                                const [, , day] = event.date.split('-').map(Number);
                                return (
                                    <div key={idx} className="bg-(--color-background) p-4 rounded-xl border border-gray-100 hover:border-(--color-primary)/30 transition-colors group flex gap-4">
                                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-(--color-primary)/10 text-(--color-primary) rounded-xl font-black shrink-0">
                                            <span className="text-2xl">{day}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-bold text-gray-800 text-lg truncate group-hover:text-(--color-primary)">{event.name}</h5>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1 font-medium mt-1">
                                                <Clock size={12} /> {event.startTime} - {event.endTime}
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                                <CalendarIcon size={48} className="mb-4 opacity-30" />
                                <p>Nenhum evento programado.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
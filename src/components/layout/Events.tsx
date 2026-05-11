import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { API_BASE_URL, apiFetch } from "@/config/api";

interface AppEvent {
    _id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
    image?: string;
}

export default function EventsWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<AppEvent[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estado para o Popup/Modal
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

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const calendarDays = Array(firstDayOfMonth).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

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
        <>
            <div className={`grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 bg-white p-6 rounded-2xl shadow-xl max-w-5xl mx-auto border h-fit md:h-[450px] border-gray-100`}>
                {/* Esquerda: Calendário */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-slate-800 font-bold text-2xl flex items-center gap-2">
                            <CalendarIcon className="text-(--color-primary)" />
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-2 cursor-pointer bg-gray-100 hover:bg-(--color-primary) text-gray-400 hover:text-white rounded-full transition-colors"><ChevronLeft size={20} /></button>
                            <button onClick={nextMonth} className="p-2 cursor-pointer bg-gray-100 hover:bg-(--color-primary) text-gray-400 hover:text-white rounded-full transition-colors"><ChevronRight size={20} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-bold text-gray-400">
                        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center">
                        {calendarDays.map((day, idx) => (
                            <div key={idx} className={`
                                    flex items-center justify-center rounded-lg h-12 text-sm font-medium relative transition-all
                                    ${day ? 'hover:cursor-pointer' : ''} 
                                    ${hasEventOnDay(day) ? 'bg-(--color-primary) text-white shadow-md hover:scale-105 hover:bg-(--color-forest-green-400)' : 'text-slate-600'}
                                `}>
                                {day}
                                {hasEventOnDay(day) && <span className="absolute bottom-2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Direita: Lista de Eventos Rápida */}
                <div className="flex flex-col border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 md:min-h-0 h-[400px] md:h-auto">
                    <h4 className="text-xl font-bold text-slate-800 mb-6">
                        Eventos do Mês
                    </h4>

                    {loading ? (
                        <div className="flex-1 flex justify-center items-center">
                            <div className="animate-spin w-8 h-8 border-4 border-(--color-primary) border-t-transparent rounded-full"></div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 customized-scrollbar">
                            {monthEvents.length > 0 ? (
                                <div className="space-y-4">
                                    {monthEvents.map((event) => (
                                        <div 
                                            key={event._id} 
                                            onClick={() => setSelectedEvent(event)}
                                            className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-(--color-primary)/40 hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all flex gap-4 overflow-hidden"
                                        >
                                            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                                <img 
                                                    src={event.image || "https://placehold.co/150"} 
                                                    alt={event.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1 flex flex-col justify-center">
                                                <h5 className="font-bold text-slate-800 truncate">{event.name}</h5>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1"><CalendarIcon size={12}/> {event.date.split('-')[2]}/{event.date.split('-')[1]}</span>
                                                    <span className="flex items-center gap-1"><Clock size={12}/> {event.startTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400">
                                    <CalendarIcon size={40} className="mx-auto mb-2 opacity-20" />
                                    <p>Sem eventos para este mês.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Popup/Modal de Detalhes do Evento */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedEvent(null)}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"></div>
                    
                    {/* Modal Content */}
                    <div 
                        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()} // Impede que clique dentro do modal o feche
                    >
                        {/* Botão Fechar */}
                        <button 
                            onClick={() => setSelectedEvent(null)}
                            className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        {/* Imagem de Capa */}
                        <div className="w-full h-56 sm:h-64 relative bg-slate-100">
                            <img 
                                src={selectedEvent.image || "https://placehold.co/800x400"} 
                                alt={selectedEvent.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay degradê para o texto não sumir */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                            
                            <div className="absolute bottom-4 left-6 right-6">
                                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-lg">{selectedEvent.name}</h2>
                            </div>
                        </div>

                        {/* Corpo do Modal */}
                        <div className="p-6 sm:p-8 space-y-6">
                            {/* Informações Rápidas */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold text-sm">
                                    <CalendarIcon size={18} />
                                    {selectedEvent.date.split("-").reverse().join("/")}
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-semibold text-sm">
                                    <Clock size={18} />
                                    {selectedEvent.startTime} - {selectedEvent.endTime}
                                </div>
                            </div>

                            {/* Descrição */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Sobre o evento</h4>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {selectedEvent.description}
                                </p>
                            </div>
                        </div>
                        
                        {/* Rodapé do Modal */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={() => setSelectedEvent(null)}
                                className="px-6 py-3 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold transition-colors cursor-pointer"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
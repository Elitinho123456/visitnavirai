import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Edit3, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

export default function EventsWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // 1. ADICIONADA: Função para deletar evento
    const confirmDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este evento?")) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (res.ok) {
                    // Atualiza a lista localmente após deletar
                    setEvents(events.filter(e => e._id !== id));
                }
            } catch (error) {
                console.error("Erro ao deletar", error);
            }
        }
    };

    useEffect(() => {
        const verificarAdmin = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded: any = jwtDecode(token);
                    if (decoded.role !== 'user') {
                        setIsAdmin(true);
                    }
                } catch (error) {
                    console.error("Token inválido.");
                }
            }
        };

        const fetchEvents = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/events`);
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

        verificarAdmin();
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
        <div className={`grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 bg-white p-6 rounded-2xl shadow-xl ${isAdmin ? "max-w-7xl" : "max-w-5xl" } mx-auto border border-gray-100`}>
            {/* Esquerda: Calendário */}
            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-slate-800 font-bold text-2xl flex items-center gap-2">
                        <CalendarIcon className="text-(--color-primary)" />
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 bg-gray-100 hover:bg-(--color-primary) hover:text-white rounded-full transition-colors"><ChevronLeft size={20} /></button>
                        <button onClick={nextMonth} className="p-2 bg-gray-100 hover:bg-(--color-primary) hover:text-white rounded-full transition-colors"><ChevronRight size={20} /></button>
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
                                ${hasEventOnDay(day) ? 'bg-(--color-primary) text-white shadow-md' : 'text-slate-600'}
                            `}>
                            {day}
                            {hasEventOnDay(day) && <span className="absolute bottom-2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Direita: Lista de Eventos (Scroll Corrigido) */}
            <div className="flex flex-col border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                <h4 className="text-xl font-bold text-slate-800 mb-6">
                    {isAdmin ? "Gerenciar Eventos" : "Eventos do Mês"}
                </h4>

                {loading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <div className="animate-spin w-8 h-8 border-4 border-(--color-primary) border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 space-y-4 customized-scrollbar">
                        {monthEvents.length > 0 ? (
                            <div className={isAdmin ? "grid grid-cols-1 gap-4" : "space-y-4"}>
                                {monthEvents.map((event) => (
                                    isAdmin ? (
                                        // Visualização ADMIN rolável
                                        <div key={event._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col sm:flex-row">
                                            <img 
                                                src={event.image || "https://placehold.co/150"} 
                                                className="w-full sm:w-32 h-32 object-cover" 
                                                alt="" 
                                            />
                                            <div className="p-4 flex-1">
                                                <h5 className="font-bold text-slate-800 truncate">{event.name}</h5>
                                                <p className="text-xs text-gray-500 flex"> <Clock size={14} /> - {event.startTime} - {event.endTime}</p>
                                                
                                                <p className="text-xs text-gray-500 flex"> <CalendarIcon size={14} /> - {event.date?.split("-").reverse().join("-")}</p>

                                                <div className="flex gap-2 mt-3">
                                                    <Link to={`editar/${event._id}`} className="flex-1 bg-(--color-primary) text-white text-xs py-2 rounded-lg text-center font-bold hover:cursor-pointer">Editar</Link>
                                                    <button onClick={() => confirmDelete(event._id)} className="px-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={16}/></button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Visualização USER rolável
                                        <div key={event._id} className="bg-slate-50 p-4 rounded-xl border border-transparent hover:border-blue-200 transition-all flex gap-4">
                                            <div className="w-12 h-12 bg-blue-100 text-(--color-primary) rounded-lg flex items-center justify-center font-bold shrink-0">
                                                {event.date.split('-')[2]}
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="font-bold text-slate-800 truncate">{event.name}</h5>
                                                <p className="text-xs text-gray-500 line-clamp-2">{event.description}</p>
                                            </div>
                                        </div>
                                    )
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
    );
}
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
    Search, ChevronLeft, ChevronRight, X, Calendar as CalendarIcon,
    Clock, Image as ImageIcon, Type, Edit3, Trash2, AlertTriangle, Upload
} from "lucide-react";
import { API_BASE_URL } from "../../../config/api";

// Interface para Tipagem
export interface AppEvent {
    _id: string;
    name: string;
    date?: string;
    image?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
}

export default function EventManager() {
    // --- ESTADOS DO CALENDÁRIO E CRIAÇÃO ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        startTime: "",
        endTime: "",
        image: "",
        description: ""
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- ESTADOS DA LISTA E FILTROS ---
    const [eventsData, setEventsData] = useState<AppEvent[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // --- LÓGICA DE BUSCA ---
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/events`);
            if (res.ok) {
                const data = await res.json();
                setEventsData(data);
            }
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // --- LÓGICA DO CALENDÁRIO ---
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const calendarDays = Array(firstDayOfMonth).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    // FUNÇÃO ADICIONADA: Identifica se há evento no dia
    const hasEventOnDay = (day: number | null) => {
        if (!day) return false;
        return eventsData.some(event => {
            if (!event.date) return false;
            const [year, month, eventDay] = event.date.split('-').map(Number);
            return year === currentDate.getFullYear() && (month - 1) === currentDate.getMonth() && eventDay === day;
        });
    };

    const handleDayClick = (day: number) => {
        if (!day) return;
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
        setIsDrawerOpen(true);
    };

    // --- UPLOAD DE IMAGEM ---
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) setImageFile(files[0]);
    };

    async function uploadSingleFile(file: File, category: string, name: string): Promise<string> {
        const fd = new FormData();
        fd.append("category", category);
        fd.append("name", name);
        fd.append("file", file);
        const res = await fetch(`${API_BASE_URL}/api/imgs/upload`, { method: "POST", body: fd });
        if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Erro no upload"); }
        return (await res.json()).url;
    }

    // --- AÇÕES (CRIAR, EXCLUIR) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingSave(true);
        try {
            if (!imageFile) {
                alert("Por favor, selecione uma imagem para o evento.");
                setLoadingSave(false);
                return;
            }

            const token = localStorage.getItem("token");
            const dateStr = selectedDate?.toISOString().split('T')[0];
            
            // Upload Image
            const imageUrl = await uploadSingleFile(imageFile, "Eventos", formData.name || "Evento_Sem_Nome");
            const payload = { ...formData, date: dateStr, image: imageUrl };

            const response = await fetch(`${API_BASE_URL}/api/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setIsDrawerOpen(false);
                setFormData({ name: "", startTime: "", endTime: "", image: "", description: "" });
                setImageFile(null); // Clear file
                fetchEvents(); // Atualiza a lista automaticamente
            } else {
                alert("Erro ao cadastrar evento.");
            }
        } catch (error) {
            console.error("Erro no cadastro:", error);
        } finally {
            setLoadingSave(false);
        }
    };

    const handleDelete = async () => {
        if (!eventToDelete) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/events/${eventToDelete}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setEventsData(eventsData.filter(e => e._id !== eventToDelete));
                setShowDeleteModal(false);
                setEventToDelete(null);
            }
        } catch (error) {
            console.error("Erro ao excluir:", error);
        }
    };

    const filteredEvents = eventsData.filter((event) =>
        event.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-20">
            {/* --- SEÇÃO 1: CALENDÁRIO --- */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 max-w-5xl mx-auto relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <CalendarIcon className="text-(--color-primary)" /> Calendário de Eventos
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 bg-slate-50 hover:bg-(--color-primary) hover:text-white rounded-full transition-colors cursor-pointer">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-bold text-lg min-w-40 text-center">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 bg-slate-50 hover:bg-(--color-primary) hover:text-white rounded-full transition-colors cursor-pointer">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center mb-2 font-bold text-slate-400 text-sm">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2 md:gap-4 text-center">
                    {calendarDays.map((day, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleDayClick(day)}
                            className={`h-16 md:h-24 flex flex-col items-center justify-center rounded-xl font-medium transition-all border border-transparent relative
                                ${day ? 'bg-slate-50 cursor-pointer hover:border-(--color-primary) hover:shadow-md' : 'bg-transparent'}
                                ${selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth() ? 'ring-2 ring-(--color-primary) bg-(--color-primary)/5' : ''}
                            `}
                        >
                            <span className="text-lg">{day}</span>
                            {/* INDICADOR DE EVENTO ADICIONADO AQUI */}
                            {hasEventOnDay(day) && (
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1"></span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-slate-100 max-w-5xl mx-auto" />

            {/* ... Resto do código permanece igual ... */}
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800">Todos os Eventos</h2>
                        <p className="text-slate-500">Visualize e gerencie a programação completa.</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar evento..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-(--color-primary) outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div></div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredEvents.map((event) => (
                            <div key={event._id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col sm:flex-row group">
                                <div className="sm:w-40 h-40 sm:h-auto relative overflow-hidden">
                                    <img src={event.image || "https://placehold.co/400x400"} alt={event.name} className="w-full h-full object-cover transition-transform duration-500" />
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{event.name}</h3>
                                        <div className="flex items-center gap-3 text-slate-400 text-xs mt-2">
                                            <span className="flex items-center gap-1"><CalendarIcon size={14} /> {event.date?.split("-").reverse().join("/")}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {event.startTime} - {event.endTime}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Link to={`editar/${event._id}`} className="flex-1 bg-(--color-primary) text-(--color-neutral-white) py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-colors">
                                            <Edit3 size={14} /> Editar
                                        </Link>
                                        <button onClick={() => { setEventToDelete(event._id); setShowDeleteModal(true); }} className="px-3 bg-red-50 text-red-500 py-2 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400">Nenhum evento encontrado para "{searchTerm}"</p>
                    </div>
                )}
            </div>

            {/* --- DRAWER DE CADASTRO --- */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-112.5 bg-white shadow-2xl border-l border-slate-100 transform transition-transform duration-300 z-50 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Novo Evento</h3>
                        <p className="text-sm text-(--color-primary) font-medium">
                            {selectedDate?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-slate-400 hover:text-red-500 rounded-full cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <form id="event-form" onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Type size={16} /> Nome do Evento</label>
                            <input type="text" required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Clock size={16} /> Início</label>
                                <input type="time" required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50"
                                    value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Clock size={16} /> Fim</label>
                                <input type="time" required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50"
                                    value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><ImageIcon size={16} /> Imagem do Evento</label>
                            {imageFile && (
                                <div className="w-full h-32 rounded-2xl overflow-hidden border border-slate-200 mb-2 relative group">
                                    <img src={URL.createObjectURL(imageFile)} alt="Preview imagem" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => setImageFile(null)}
                                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full flex flex-col items-center gap-2 px-5 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                                    isDragging
                                        ? 'border-(--color-primary) bg-(--color-primary)/10 scale-[1.02]'
                                        : 'border-slate-300 bg-slate-50 hover:border-(--color-primary)'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                    isDragging ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-slate-200 text-slate-500'
                                }`}>
                                    <Upload size={18} />
                                </div>
                                <span className="text-slate-500 text-sm font-medium text-center">
                                    {isDragging ? '📸 Solte a imagem aqui!' : (imageFile ? imageFile.name : 'Clique ou arraste a imagem do evento')}
                                </span>
                                <input ref={fileInputRef} type="file" required={!imageFile} accept="image/*" className="hidden"
                                    onChange={(e) => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }} />
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Type size={16} /> Descrição</label>
                            <textarea required rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 resize-none"
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-slate-100 bg-white">
                    <button type="submit" form="event-form" disabled={loadingSave} className="w-full bg-(--color-primary) hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer">
                        {loadingSave ? "Salvando..." : "Confirmar Evento"}
                    </button>
                </div>
            </div>

            {/* --- MODAL DE EXCLUSÃO --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <AlertTriangle size={36} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">Tem certeza?</h3>
                        <p className="text-slate-500 mt-3">Esta ação excluirá o evento permanentemente do sistema.</p>
                        <div className="flex flex-col gap-3 mt-8">
                            <button onClick={handleDelete} className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition-colors cursor-pointer">Sim, Excluir</button>
                            <button onClick={() => setShowDeleteModal(false)} className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-colors cursor-pointer">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay para fechar o Drawer */}
            {isDrawerOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsDrawerOpen(false)} />}
        </div>
    );
}
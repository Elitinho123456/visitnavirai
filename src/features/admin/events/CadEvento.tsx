import { toast } from '@/utils/toast';
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Calendar as CalendarIcon, Clock, Type, ImageIcon,
    X, ChevronLeft, ChevronRight, Upload,
    AlertCircle, Edit
} from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/config/api";

export interface AppEvent {
    _id: string;
    name: string;
    date: string;
    image?: string;
    startTime: string;
    endTime: string;
    description: string;
}

export default function CadEvento() {
    const navigate = useNavigate();

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // Events (to show dots on calendar)
    const [eventsData, setEventsData] = useState<AppEvent[]>([]);

    // Drawer State (Formulário)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [loadingSave, setLoadingSave] = useState(false);
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

    // Conflict State
    const [conflictInfo, setConflictInfo] = useState<{ message: string, suggestion: string, existingId: string } | null>(null);

    const fetchEvents = async () => {
        try {
            const res = await apiFetch(`${API_BASE_URL}/api/events`);
            if (res.ok) {
                const data = await res.json();
                setEventsData(data);
            }
        } catch (error) {
            console.error("Failed to fetch events from DB.");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Calendar Logic
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const calendarDays = Array(firstDayOfMonth).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    const getEventsOnDay = (day: number | null) => {
        if (!day) return [];
        return eventsData.filter(event => {
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

    // --- UPLOAD DE IMAGEM (Drawer) ---
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) setImageFile(files[0]);
    };

    async function uploadSingleFile(file: File, category: string, name: string): Promise<string> {
        const fd = new FormData();
        fd.append("category", category);
        fd.append("name", name);
        fd.append("file", file);
        const res = await apiFetch(`${API_BASE_URL}/api/imgs/upload`, { method: "POST", body: fd });
        if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Erro no upload"); }
        return (await res.json()).url;
    }

    // --- SUBMIT (Drawer) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingSave(true);
        try {
            const token = localStorage.getItem("token");

            // Corrige o fuso horário para enviar a data certa (YYYY-MM-DD) localmente
            const tzOffset = selectedDate!.getTimezoneOffset() * 60000;
            const localISOTime = new Date(selectedDate!.getTime() - tzOffset).toISOString().slice(0, 10);

            let imageUrl = "";

            if (imageFile) {
                imageUrl = await uploadSingleFile(imageFile, "Eventos", formData.name || "Evento_Sem_Nome");
            }

            const payload = { ...formData, date: localISOTime, image: imageUrl };

            const response = await apiFetch(`${API_BASE_URL}/api/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("Evento criado com sucesso!");
                navigate("/admin/eventos");
            } else if (response.status === 409) {
                const errData = await response.json();
                setConflictInfo(errData);
            } else {
                const errData = await response.json().catch(() => ({}));
                toast.error(errData.message || "Erro ao cadastrar evento.");
            }
        } catch (error) {
            console.error("Erro no cadastro:", error);
            toast.error("Ocorreu um erro no servidor.");
        } finally {
            setLoadingSave(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/eventos" className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-(--color-primary) hover:border-(--color-primary)/30 transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Novo Evento</h2>
                    <p className="text-slate-500 font-medium mt-1">Selecione uma data no calendário para registrar um novo evento na plataforma.</p>
                </div>
            </div>

            {/* Calendário */}
            <section>
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            <CalendarIcon className="text-(--color-primary)" /> Calendário
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
                        {calendarDays.map((day, idx) => {
                            const eventsInThisDay = getEventsOnDay(day);
                            const hasEvents = eventsInThisDay.length > 0;
                            const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth() && isDrawerOpen;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => day && handleDayClick(day)}
                                    className={`h-16 md:h-24 flex flex-col items-center justify-center rounded-xl font-medium transition-all relative
                                    ${day ? 'cursor-pointer hover:shadow-md' : 'bg-transparent'}
                                    ${!day ? '' : hasEvents ? 'bg-(--color-forest-green-100) border border-(--color-forest-green-300) text-slate-800' : 'bg-slate-50 text-slate-600 hover:border-(--color-primary)'}
                                    ${isSelected ? 'ring-2 ring-(--color-primary) bg-(--color-primary)/10 scale-105 z-10' : ''}
                                `}
                                >
                                    {day && <span className="text-lg">{day}</span>}
                                    {hasEvents && (
                                        <div className="flex gap-1 mt-1">
                                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                            {eventsInThisDay.length > 1 && (
                                                <span className="text-[10px] bg-(--color-forest-green-500) text-white px-1.5 py-0.5 rounded-full leading-none absolute top-2 right-2 shadow-sm">
                                                    {eventsInThisDay.length}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- DRAWER DE CADASTRO --- */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] h-full bg-white shadow-2xl border-l border-slate-100 transform transition-transform duration-300 z-50 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Novo Evento</h3>
                        <p className="text-sm text-(--color-primary) font-medium">
                            {selectedDate && new Date(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-slate-400 hover:text-red-500 rounded-full cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5 customized-scrollbar">
                    <form id="event-form" onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Type size={16} /> Nome do Evento</label>
                            <input type="text" required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-(--color-primary) outline-none"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nome do Evento" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Clock size={16} /> Início</label>
                                <input type="time" required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-(--color-primary) outline-none"
                                    value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Clock size={16} /> Fim</label>
                                <input type="time" required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-(--color-primary) outline-none"
                                    value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><ImageIcon size={16} /> Imagem do Evento (Opcional)</label>
                            {imageFile && (
                                <div className="w-full h-32 rounded-2xl overflow-hidden border border-slate-200 mb-2 relative group">
                                    <img src={URL.createObjectURL(imageFile)} alt="Preview imagem" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => setImageFile(null)}
                                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            {!imageFile && (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`w-full flex flex-col items-center gap-2 px-5 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${isDragging
                                        ? 'border-(--color-primary) bg-(--color-primary)/10 scale-[1.02]'
                                        : 'border-slate-300 bg-slate-50 hover:border-(--color-primary)'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDragging ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-slate-200 text-slate-500'
                                        }`}>
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-slate-500 text-sm font-medium text-center">
                                        {isDragging ? '📸 Solte a imagem aqui!' : 'Clique ou arraste a imagem do evento'}
                                    </span>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                                        onChange={(e) => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }} />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Type size={16} /> Descrição</label>
                            <textarea required rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 resize-none focus:ring-2 focus:ring-(--color-primary) outline-none"
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Descrição completa..." />
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex gap-3">
                    <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                        Cancelar
                    </button>
                    <button type="submit" form="event-form" disabled={loadingSave} className="flex-1 bg-(--color-primary) hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                        {loadingSave ? (
                            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Salvando...</>
                        ) : "Confirmar"}
                    </button>
                </div>
            </div>

            {/* Overlay para fechar o Drawer */}
            {isDrawerOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsDrawerOpen(false)} />}

            {/* Modal de Conflito de Nome */}
            {conflictInfo && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setConflictInfo(null)}></div>
                    <div className="bg-white rounded-4xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-slate-100">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <AlertCircle size={36} />
                        </div>

                        <h3 className="text-2xl font-black text-slate-800 text-center">Conflito de Nome</h3>
                        <p className="text-slate-500 text-center mt-3 leading-relaxed">
                            {conflictInfo.message} <br />
                            Deseja usar o nome sugerido ou gerenciar o evento que já existe?
                        </p>

                        <div className="mt-8 space-y-3">
                            <button
                                onClick={() => {
                                    setFormData({ ...formData, name: conflictInfo.suggestion });
                                    setConflictInfo(null);
                                    toast.info(`Nome alterado para: ${conflictInfo.suggestion}`);
                                }}
                                className="w-full bg-(--color-primary) text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-(--color-primary)/20 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Usar "{conflictInfo.suggestion}"
                            </button>

                            <Link
                                to={`/admin/eventos`}
                                className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Edit size={20} /> Ver Eventos do Mês
                            </Link>

                            <button
                                onClick={() => setConflictInfo(null)}
                                className="w-full text-slate-400 py-2 font-medium hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
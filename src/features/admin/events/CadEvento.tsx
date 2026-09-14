import { toast } from '@/utils/toast';
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Calendar as CalendarIcon, Clock, Type, ImageIcon,
    X, ChevronLeft, ChevronRight, Upload,
    AlertCircle, Edit
} from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/config/api";
import { formatDateDisplay, isSameCalendarDay } from "@/utils/date-format";
import SocialsInput from "@/components/shared/SocialsInput";
import type { Socials } from "@/types/interfacesTypes";

export interface AppEvent {
    _id: string;
    name: string;
    date: string;
    image?: string;
    startTime: string;
    endTime: string;
    description: string;
    socials?: Socials;
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
    const [formData, setFormData] = useState<{
        name: string;
        startTime: string;
        endTime: string;
        image: string;
        description: string;
        socials?: Socials;
    }>({
        name: "",
        startTime: "",
        endTime: "",
        image: "",
        description: "",
        socials: {
            whatsapp: "",
            instagram: "",
            facebook: "",
            website: ""
        }
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
        return eventsData.filter(event => isSameCalendarDay(event.date, currentDate.getFullYear(), currentDate.getMonth(), day));
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

            let imageUrl = "";

            if (imageFile) {
                imageUrl = await uploadSingleFile(imageFile, "Eventos", formData.name || "Evento_Sem_Nome");
            }

            const payload = { ...formData, date: formatDateDisplay(selectedDate), image: imageUrl };

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
                <Link to="/admin/eventos" className="p-3 bg-white dark:bg-[#241a06] rounded-xl shadow-sm border border-[#ede0d8] dark:border-[#3a2e1a] text-[#8a7968] dark:text-[#c5b49e] hover:text-(--color-primary) hover:border-(--color-primary)/30 transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h2 className="text-3xl font-black text-[#241a06] dark:text-[#f0e6d6]">Novo Evento</h2>
                    <p className="text-[#8a7968] dark:text-[#c5b49e] font-medium mt-1">Selecione uma data no calendário para registrar um novo evento na plataforma.</p>
                </div>
            </div>

            {/* Calendário */}
            <section>
                <div className="bg-white dark:bg-[#241a06] rounded-3xl p-6 md:p-8 shadow-sm border border-[#ede0d8] dark:border-[#3a2e1a] relative overflow-hidden max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6 border-b border-[#ede0d8] dark:border-[#3a2e1a] pb-4">
                        <h2 className="text-2xl font-black text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2">
                            <CalendarIcon className="text-(--color-primary)" /> Calendário
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 bg-[#faf5f0] dark:bg-[#2e2310] hover:bg-(--color-primary) hover:text-white text-[#241a06] dark:text-[#f0e6d6] rounded-full transition-colors cursor-pointer">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="font-bold text-lg min-w-40 text-center text-[#241a06] dark:text-[#f0e6d6]">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </span>
                            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 bg-[#faf5f0] dark:bg-[#2e2310] hover:bg-(--color-primary) hover:text-white text-[#241a06] dark:text-[#f0e6d6] rounded-full transition-colors cursor-pointer">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center mb-2 font-bold text-[#8a7968] dark:text-[#c5b49e] text-sm">
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
                                    ${!day ? '' : hasEvents ? 'bg-(--color-forest-green-100) dark:bg-emerald-950/40 border border-(--color-forest-green-300) dark:border-emerald-800 text-[#241a06] dark:text-emerald-300' : 'bg-[#faf5f0] dark:bg-[#2e2310]/50 text-[#5a4d3e] dark:text-[#f0e6d6] hover:border-(--color-primary)'}
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
            <div className={`fixed inset-y-0 right-0 w-full md:w-112.5 h-full bg-white dark:bg-[#241a06] shadow-2xl border-l border-[#ede0d8] dark:border-[#3a2e1a] transform transition-transform duration-300 z-50 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 border-b border-[#ede0d8] dark:border-[#3a2e1a] bg-[#faf5f0] dark:bg-[#1a1208]/60 shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6]">Novo Evento</h3>
                        <p className="text-sm text-(--color-primary) font-medium">
                            {selectedDate && formatDateDisplay(selectedDate)}
                        </p>
                    </div>
                    <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-[#8a7968] hover:text-red-500 rounded-full cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5 customized-scrollbar">
                    <form id="event-form" onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] mb-2"><Type size={16} /> Nome do Evento</label>
                            <input type="text" required className="w-full px-4 py-3 border border-[#ede0d8] dark:border-[#3a2e1a] rounded-xl bg-[#faf5f0] dark:bg-[#1a1208] text-[#241a06] dark:text-[#f0e6d6] focus:ring-2 focus:ring-(--color-primary) outline-none"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nome do Evento" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] mb-2"><Clock size={16} /> Início</label>
                                <input type="time" required className="w-full px-4 py-3 border border-[#ede0d8] dark:border-[#3a2e1a] rounded-xl bg-[#faf5f0] dark:bg-[#1a1208] text-[#241a06] dark:text-[#f0e6d6] focus:ring-2 focus:ring-(--color-primary) outline-none"
                                    value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] mb-2"><Clock size={16} /> Fim</label>
                                <input type="time" required className="w-full px-4 py-3 border border-[#ede0d8] dark:border-[#3a2e1a] rounded-xl bg-[#faf5f0] dark:bg-[#1a1208] text-[#241a06] dark:text-[#f0e6d6] focus:ring-2 focus:ring-(--color-primary) outline-none"
                                    value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] mb-2"><ImageIcon size={16} /> Imagem do Evento (Opcional)</label>
                            {imageFile && (
                                <div className="w-full h-32 rounded-2xl overflow-hidden border border-[#ede0d8] dark:border-[#3a2e1a] mb-2 relative group">
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
                                        : 'border-[#ede0d8] dark:border-[#3a2e1a] bg-[#faf5f0] dark:bg-[#1a1208]/40 hover:border-(--color-primary)'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDragging ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-[#ede0d8] dark:bg-[#2e2310] text-[#8a7968] dark:text-[#c5b49e]'
                                        }`}>
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-[#8a7968] dark:text-[#c5b49e] text-sm font-medium text-center">
                                        {isDragging ? '📸 Solte a imagem aqui!' : 'Clique ou arraste a imagem do evento'}
                                    </span>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                                        onChange={(e) => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }} />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] mb-2"><Type size={16} /> Descrição</label>
                            <textarea required rows={4} className="w-full px-4 py-3 border border-[#ede0d8] dark:border-[#3a2e1a] rounded-xl bg-[#faf5f0] dark:bg-[#1a1208] text-[#241a06] dark:text-[#f0e6d6] resize-none focus:ring-2 focus:ring-(--color-primary) outline-none"
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Descrição completa..." />
                        </div>

                        <div className="pt-4 border-t border-[#ede0d8] dark:border-[#3a2e1a]">
                            <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] mb-3">Redes Sociais e Contato</label>
                            <SocialsInput
                                compact
                                socials={formData.socials}
                                onChange={(socials) => setFormData({ ...formData, socials })}
                            />
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-[#ede0d8] dark:border-[#3a2e1a] bg-white dark:bg-[#241a06] shrink-0 flex gap-3">
                    <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 bg-[#ede0d8] dark:bg-[#2e2310] text-[#241a06] dark:text-[#f0e6d6] font-bold py-4 rounded-xl hover:bg-[#ede0d8] dark:hover:bg-[#3a2e1a] transition-colors cursor-pointer">
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
            {isDrawerOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsDrawerOpen(false)} />}

            {/* Modal de Conflito de Nome */}
            {conflictInfo && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setConflictInfo(null)}></div>
                    <div className="bg-white dark:bg-[#241a06] rounded-4xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-[#ede0d8] dark:border-[#3a2e1a]">
                        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <AlertCircle size={36} />
                        </div>

                        <h3 className="text-2xl font-black text-[#241a06] dark:text-[#f0e6d6] text-center">Conflito de Nome</h3>
                        <p className="text-[#8a7968] dark:text-[#c5b49e] text-center mt-3 leading-relaxed">
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
                                className="w-full bg-[#ede0d8] dark:bg-[#2e2310] text-[#241a06] dark:text-[#f0e6d6] py-4 rounded-2xl font-bold text-lg hover:bg-[#ede0d8] dark:hover:bg-[#3a2e1a] transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Edit size={20} /> Ver Eventos do Mês
                            </Link>

                            <button
                                onClick={() => setConflictInfo(null)}
                                className="w-full text-[#8a7968] dark:text-[#c5b49e] py-2 font-medium hover:text-[#5a4d3e] dark:hover:text-[#8a7968] transition-colors cursor-pointer"
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
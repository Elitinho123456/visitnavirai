import { toast } from '@/utils/toast';
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
    Plus, Search, Calendar as CalendarIcon, Clock, Type, ImageIcon,
    Edit3, AlertTriangle, X, Trash2, Upload, AlertCircle
} from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/config/api";
import type { AppEvent } from './CadEvento'; // Reusing interface
import { formatDateDisplay, formatDateInputValue } from "@/utils/date-format";

export default function ListEvents() {
    const [eventsData, setEventsData] = useState<AppEvent[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // Deletion Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);

    // Edit Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [loadingSave, setLoadingSave] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        date: "",
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
        setLoading(true);
        try {
            const res = await apiFetch(`${API_BASE_URL}/api/events`);
            if (res.ok) {
                const data = await res.json();
                setEventsData(data);
            }
        } catch (error) {
            console.error("Failed to fetch events from DB.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async () => {
        if (!eventToDelete) return;
        try {
            const token = localStorage.getItem("token");
            const res = await apiFetch(`${API_BASE_URL}/api/events/${eventToDelete}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setEventsData(eventsData.filter(h => h._id !== eventToDelete));
                setShowDeleteModal(false);
                setEventToDelete(null);
                toast.success("Evento excluído.");
            } else {
                toast.error("Erro ao excluir.");
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const confirmDelete = (id: string) => {
        setEventToDelete(id);
        setShowDeleteModal(true);
    };

    // --- UPLOAD DE IMAGEM (Drawer Edit) ---
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
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

    // --- EDIT (Drawer) ---
    const handleEditClick = (event: AppEvent) => {
        setEditingEventId(event._id);
        setFormData({
            name: event.name,
            date: formatDateInputValue(event.date),
            startTime: event.startTime,
            endTime: event.endTime,
            image: event.image || "",
            description: event.description
        });
        setImageFile(null);
        setIsDrawerOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEventId) return;
        setLoadingSave(true);
        try {
            const token = localStorage.getItem("token");
            let imageUrl = formData.image;

            if (imageFile) {
                imageUrl = await uploadSingleFile(imageFile, "Eventos", formData.name || "Evento_Edicao");
            }

            const payload = { ...formData, date: formatDateDisplay(formData.date), image: imageUrl };

            const response = await apiFetch(`${API_BASE_URL}/api/events/${editingEventId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("Evento atualizado com sucesso!");
                setIsDrawerOpen(false);
                setEditingEventId(null);
                fetchEvents();
            } else if (response.status === 409) {
                const errData = await response.json();
                setConflictInfo(errData);
            } else {
                const errData = await response.json().catch(() => ({}));
                toast.error(errData.message || "Erro ao atualizar evento.");
            }
        } catch (error) {
            console.error("Erro na edição:", error);
            toast.error("Ocorreu um erro no servidor.");
        } finally {
            setLoadingSave(false);
        }
    };

    const filteredEvents = eventsData.filter((event) =>
        event.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-(--color-primary) opacity-[0.03] rounded-full -mr-20 -mt-20"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                                <CalendarIcon className="text-(--color-primary)" size={32} />
                                Eventos
                            </h2>
                            <p className="text-slate-500 mt-2 max-w-xl">
                                Gerencie todos os eventos cadastrados no site.
                            </p>
                        </div>
                        <Link
                            to="/admin/eventos/novo"
                            className="bg-(--color-primary) text-white px-6 py-4 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-(--color-primary)/20 flex items-center gap-2 font-bold text-lg self-start md:self-center cursor-pointer"
                        >
                            <Plus size={24} />
                            Novo Evento
                        </Link>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nome..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Listagem de Eventos */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">
                            Todos os Eventos ({filteredEvents.length})
                        </h2>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div></div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <div key={event._id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col group">
                                <div className="w-full h-48 relative overflow-hidden bg-slate-100">
                                    {event.image ? (
                                        <img src={event.image} alt={event.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                            <ImageIcon size={48} />
                                            <span className="text-xs font-semibold mt-2">Sem imagem</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{event.name}</h3>
                                        <div className="flex flex-col gap-2 text-slate-500 text-xs mt-3">
                                            <span className="flex items-center gap-1.5"><CalendarIcon size={14} className="text-(--color-primary)" /> {formatDateDisplay(event.date)}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-(--color-primary)" /> {event.startTime} - {event.endTime}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-5 pt-4 border-t border-slate-100">
                                        <button onClick={() => handleEditClick(event)} className="flex-1 bg-(--color-primary)/10 text-(--color-primary) hover:bg-(--color-primary) hover:text-white py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer">
                                            <Edit3 size={14} /> Editar
                                        </button>
                                        <button onClick={() => confirmDelete(event._id)} className="px-3 bg-red-50 text-red-500 py-2 rounded-xl hover:bg-red-100 transition-colors cursor-pointer">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400">Nenhum evento encontrado.</p>
                    </div>
                )}
            </div>

            {/* --- DRAWER DE EDIÇÃO --- */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-112.5 h-full bg-white shadow-2xl border-l border-slate-100 transform transition-transform duration-300 z-50 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Editar Evento</h3>
                        <p className="text-sm text-(--color-primary) font-medium">Atualize os dados abaixo</p>
                    </div>
                    <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-slate-400 hover:text-red-500 rounded-full cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5 customized-scrollbar">
                    <form id="edit-form" onSubmit={handleEditSubmit} className="space-y-5">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><Type size={16} /> Nome do Evento</label>
                            <input type="text" required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-(--color-primary) outline-none"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nome do Evento" />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2"><CalendarIcon size={16} /> Data</label>
                            <input type="date" required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-(--color-primary) outline-none"
                                value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
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
                            {(imageFile || formData.image) && (
                                <div className="w-full h-32 rounded-2xl overflow-hidden border border-slate-200 mb-2 relative group">
                                    <img src={imageFile ? URL.createObjectURL(imageFile) : formData.image} alt="Preview imagem" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => { setImageFile(null); setFormData({ ...formData, image: "" }); }}
                                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            {(!imageFile && !formData.image) && (
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
                                        {isDragging ? '📸 Solte a nova imagem!' : 'Alterar imagem do evento'}
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
                    <button type="submit" form="edit-form" disabled={loadingSave} className="flex-1 bg-(--color-primary) hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                        {loadingSave ? (
                            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Atualizando...</>
                        ) : "Salvar Alterações"}
                    </button>
                </div>
            </div>

            {/* Overlay para fechar o Drawer */}
            {isDrawerOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsDrawerOpen(false)} />}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <X size={24} />
                        </button>

                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <AlertTriangle size={36} />
                        </div>

                        <h3 className="text-2xl font-black text-slate-800 text-center">Tem certeza?</h3>
                        <p className="text-slate-500 text-center mt-3">
                            Esta ação é irreversível. O cadastro será excluído permanentemente do sistema.
                        </p>

                        <div className="flex flex-col gap-3 mt-8">
                            <button
                                onClick={handleDelete}
                                className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 cursor-pointer"
                            >
                                Sim, Excluir
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                            Deseja usar o nome sugerido para evitar conflitos de imagens?
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

                            <button
                                onClick={() => {
                                    // Busca o evento conflitante na lista local e abre para edição
                                    const existing = eventsData.find(e => e._id === conflictInfo.existingId);
                                    if (existing) {
                                        handleEditClick(existing);
                                    }
                                    setConflictInfo(null);
                                }}
                                className="w-full bg-amber-50 text-amber-700 border border-amber-200 py-4 rounded-2xl font-bold text-lg hover:bg-amber-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Edit3 size={20} /> Editar Evento Existente
                            </button>

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
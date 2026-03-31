import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventsWidget from "../../layout/Events.tsx";
// Adicionadas as importações faltantes: Star, MapPin, Edit3, Trash2, AlertTriangle
import {
    Plus, Search, ChevronLeft, ChevronRight, X, Calendar as CalendarIcon,
    Clock, Image as ImageIcon, Type, Star, MapPin, Edit3, Trash2, AlertTriangle
} from "lucide-react";
import { API_BASE_URL } from "../../../config/api";

// Criei uma interface básica para substituir o "Event" nativo. 
// Ajuste os campos conforme o seu backend.
export interface AppEvent {
    _id: string;
    name: string;
    date?: string;
    image?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
}

export default function ListEvents() {
    // Usando a interface AppEvent ao invés de Event
    const [EventsData, setEventsData] = useState<AppEvent[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all"); // Variável criada, mas ainda sem uso na interface
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [EventToDelete, setEventToDelete] = useState<string | null>(null);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/Events`);
            if (res.ok) {
                const data = await res.json();
                setEventsData(data);
            }
        } catch (error) {
            console.error("Failed to fetch Events from DB.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async () => {
        if (!EventToDelete) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/api/Events/${EventToDelete}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setEventsData(EventsData.filter(h => h._id !== EventToDelete));
                setShowDeleteModal(false);
                setEventToDelete(null);
            } else {
                alert("Erro ao excluir.");
            }
        } catch (error) {
            console.error("Error deleting Event:", error);
        }
    };

    const confirmDelete = (id: string) => {
        setEventToDelete(id);
        setShowDeleteModal(true);
    };

    // CORREÇÃO: Declarando a variável filteredEvents para a barra de pesquisa funcionar
    const filteredEvents = EventsData.filter((event) =>
        event.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (


            <div className="space-y-6">
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
                                to="novo"
                                className="bg-(--color-primary) text-white px-6 py-4 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-(--color-primary)/20 flex items-center gap-2 font-bold text-lg self-start md:self-center"
                            >
                                <Plus size={24} />
                                Novo
                            </Link>
                        </div>

                        {/* Search + Category Filters */}
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

                <EventsWidget />


                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            </div>

  
    );
}
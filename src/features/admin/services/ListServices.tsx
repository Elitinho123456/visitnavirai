import { toast } from '@/utils/toast';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Service } from "../../../types/interfacesTypes";
import { Plus, Search, MapPin, Edit3, Trash2, Briefcase, AlertTriangle, X, Star } from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/config/api";
import { jwtDecode } from "jwt-decode";

const CATEGORY_FILTERS = [
    { label: "Todos", value: "all" },
    { label: "Agências", value: "Agência" },
    { label: "Espaços para Eventos", value: "Espaços para Eventos" },
    { label: "Locadoras", value: "Locadora de Veículos" },
    { label: "Organizadoras de Eventos", value: "Organizadoras de Eventos" },
    { label: "Táxi", value: "Taxi" },
    { label: "Transp. Rodoviárias", value: "Transportadoras Rodoviárias" },
    { label: "Transp. Turísticas", value: "Transportadoras Turísticas" },
];

export default function ListServices() {
    const [servicesData, setServicesData] = useState<Service[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

    const [permissions, setPermissions] = useState<any>({});
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`${API_BASE_URL}/api/services`);
            if (res.ok) {
                const data = await res.json();
                setServicesData(data);
            }
        } catch (error) {
            console.error("Failed to fetch services from DB.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                if (decoded.role === "admin") setIsAdmin(true);
                setPermissions(decoded.permissions?.services || {});
            } catch (error) {
                console.error("Token parsing error");
            }
        }
        fetchServices();
    }, []);

    const canCreate = isAdmin || permissions?.create === true;
    const canEdit = isAdmin || permissions?.edit === true;
    const canDelete = isAdmin || permissions?.delete === true;

    const handleDelete = async () => {
        if (!serviceToDelete) return;
        try {
            const token = localStorage.getItem("token");
            const res = await apiFetch(`${API_BASE_URL}/api/services/${serviceToDelete}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setServicesData(servicesData.filter(s => s._id !== serviceToDelete));
                setShowDeleteModal(false);
                setServiceToDelete(null);
                toast.success("Serviço excluído com sucesso!");
            } else {
                toast.error("Erro ao excluir o serviço.");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("Erro ao excluir o serviço.");
        }
    };

    const confirmDelete = (id: string) => {
        setServiceToDelete(id);
        setShowDeleteModal(true);
    };

    const filteredServices = servicesData.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === "all" || (s as any).category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // Contar por categoria para os badges nos filtros
    const countByCategory = (cat: string) => {
        if (cat === "all") return servicesData.length;
        return servicesData.filter(s => (s as any).category === cat).length;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-(--color-primary) opacity-[0.03] rounded-full -mr-20 -mt-20"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                                <Briefcase className="text-(--color-primary)" size={32} />
                                Cadastro de Serviços
                            </h2>
                            <p className="text-slate-500 mt-2 max-w-xl">
                                Gerencie as agências, táxis, transportadoras e demais serviços turísticos locais.
                            </p>
                        </div>
                        {canCreate && (
                            <Link
                                to="novo"
                                className="bg-(--color-primary) text-white px-6 py-4 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-(--color-primary)/20 flex items-center gap-2 font-bold text-lg self-start md:self-center"
                            >
                                <Plus size={24} />
                                Novo Serviço
                            </Link>
                        )}
                    </div>

                    {/* Search + Category Filters */}
                    <div className="mt-8 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nome do serviço..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            {CATEGORY_FILTERS.map((cat) => {
                                const isActive = activeCategory === cat.value;
                                const count = countByCategory(cat.value);
                                return (
                                    <button
                                        key={cat.value}
                                        onClick={() => setActiveCategory(cat.value)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                                            isActive
                                                ? 'bg-(--color-primary) text-white shadow-md'
                                                : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300'
                                        }`}
                                    >
                                        {cat.label}
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* List Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredServices.map((service) => (
                        <div key={service._id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col sm:flex-row">
                            <div className="sm:w-48 h-48 sm:h-auto overflow-hidden relative">
                                <img
                                    src={service.image || "https://placehold.co/600x400"}
                                    alt={service.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Badge de Destaque */}
                                {service.highlight && (
                                    <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                                        <Star size={12} className="fill-yellow-900" />
                                        Destaque
                                    </div>
                                )}

                                {/* Badge de Categoria */}
                                {(service as any).category && (
                                    <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        {(service as any).category}
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{service.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                                        <MapPin size={14} />
                                        <span>Localizado em Naviraí</span>
                                    </div>
                                    <p className="text-slate-500 text-sm mt-3 line-clamp-2 leading-relaxed break-all">
                                        {service.about?.desc?.[0] || "Sem descrição disponível."}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 mt-6">
                                    {canEdit && (
                                        <Link
                                            to={`editar/${service._id}`}
                                            className="flex-1 bg-(--color-primary) text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-(--color-primary)/80 transition-colors border border-(--color-primary) cursor-pointer"
                                        >
                                            <Edit3 size={16} />
                                            Editar
                                        </Link>
                                    )}
                                    {canDelete && (
                                        <button
                                            onClick={() => confirmDelete(service._id!)}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-100 text-red-500 hover:bg-red-200 transition-colors border border-red-100 cursor-pointer"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Briefcase size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Nenhum serviço encontrado</h3>
                    <p className="text-slate-500 mt-2">Tente ajustar sua busca ou cadastre um novo serviço.</p>
                </div>
            )}

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
                            Esta ação é irreversível. O serviço será excluído permanentemente do sistema.
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

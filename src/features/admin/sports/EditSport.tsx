import { toast } from '@/utils/toast';
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Save, Upload, Star, ImagePlus, X, Clock, ShieldAlert } from "lucide-react";
import MapPicker from "@/components/shared/MapPicker";
import SocialsInput from "@/components/shared/SocialsInput";
import { API_BASE_URL, apiFetch } from "@/config/api";

function getCategoryLabel(category: string): string {
    return `Sobre o Local Esportivo (${category})`;
}

const API_BASE = API_BASE_URL;

export default function EditSport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
    const [highlightRenewMonths, setHighlightRenewMonths] = useState<number>(0);

    // Novas Imagens (opcional)
    const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
    const [newCourtFile, setNewCourtFile] = useState<File | null>(null);
    const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

    // Drag states
    const [dragStates, setDragStates] = useState<Record<string, boolean>>({ banner: false, court: false, gallery: false });

    // Refs
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const courtInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<any>({
        name: "", image: "", category: "Futebol", highlight: false, distance: "Naviraí - MS", latitude: 0, longitude: 0,
        features: [""],
        about: { title: "Sobre o Local", subtitle: "Complexo Esportivo Local", desc: [""] },
        courts: { title: "Campos e Quadras", image: "", imageCaption: "Foto Principal", desc: [""], type: "Futebol Society" },
        rules: [],
        infrastructure: { title: "Infraestrutura e Comodidades", cards: [] },
        gallery: [],
        cta: { title: "Deseja agendar um horário ou obter mais informações?", desc: "Entre em contato com a gerência do complexo esportivo ou secretaria de esportes." }
    });

    useEffect(() => {
        const fetchSportData = async () => {
            if (!id) return;
            try {
                const res = await apiFetch(`${API_BASE}/api/sports/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        ...data,
                        socials: {
                            whatsapp: data.socials?.whatsapp || "",
                            instagram: data.socials?.instagram || "",
                            facebook: data.socials?.facebook || "",
                            website: data.socials?.website || "",
                        }
                    });
                } else {
                    navigate("/admin/esportes");
                }
            } catch (error) {
                console.error("Error fetching sport data", error);
            } finally {
                setFetching(false);
            }
        };
        fetchSportData();
    }, [id, navigate]);

    // --- Drag & Drop Handlers ---
    const handleDragOver = (e: React.DragEvent, zone: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDragStates(prev => ({ ...prev, [zone]: true }));
    };

    const handleDragLeave = (e: React.DragEvent, zone: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDragStates(prev => ({ ...prev, [zone]: false }));
    };

    const handleDrop = (e: React.DragEvent, zone: string) => {
        e.preventDefault();
        e.stopPropagation();
        setDragStates(prev => ({ ...prev, [zone]: false }));

        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length === 0) return;

        if (zone === 'banner') {
            setNewBannerFile(files[0]);
        } else if (zone === 'court') {
            setNewCourtFile(files[0]);
        } else if (zone === 'gallery') {
            setNewGalleryFiles(prev => [...prev, ...files]);
        }
    };

    // --- Presets ---
    const RULE_PRESETS = [
        { label: "08h-22h", title: "Horário de Funcionamento", desc: "Disponível para reservas e jogos das 08h às 22h" },
        { label: "Chuteira", title: "Calçado Adequado", desc: "É obrigatório o uso de chuteira society ou tênis de futsal apropriado" },
        { label: "Reserva", title: "Agendamento Prévio", desc: "Necessário realizar agendamento e pagamento de taxa com antecedência" }
    ];

    const handleAddRulePreset = (preset?: typeof RULE_PRESETS[0]) => {
        const newItem = preset
            ? { label: preset.label, title: preset.title, desc: preset.desc }
            : { label: "", title: "", desc: "" };
        setFormData({ ...formData, rules: [...(formData.rules || []), newItem] });
    };

    const handleRemoveRule = (index: number) => {
        const nr = [...(formData.rules || [])];
        nr.splice(index, 1);
        setFormData({ ...formData, rules: nr });
        
        const newErrors = { ...validationErrors };
        delete newErrors[`rule_${index}_label`];
        delete newErrors[`rule_${index}_title`];
        delete newErrors[`rule_${index}_desc`];
        setValidationErrors(newErrors);
    };

    const handleAddInfrastructureCard = () => {
        const currentCards = formData.infrastructure?.cards || [];
        setFormData({ 
            ...formData, 
            infrastructure: { 
                ...formData.infrastructure, 
                cards: [...currentCards, { icon: "Activity", title: "Vestiários", desc: "Vestiários masculinos e femininos com chuveiros" }] 
            } 
        });
    };

    const handleRemoveInfrastructureCard = (index: number) => {
        const nc = [...(formData.infrastructure?.cards || [])];
        nc.splice(index, 1);
        setFormData({ ...formData, infrastructure: { ...formData.infrastructure, cards: nc } });
    };

    const handleRemoveExistingGalleryImage = (imageUrl: string) => {
        setFormData({ ...formData, gallery: formData.gallery.filter((url: string) => url !== imageUrl) });
    };

    const handleRemoveNewGalleryFile = (index: number) => {
        setNewGalleryFiles(prev => prev.filter((_, i) => i !== index));
    };

    // --- Upload Helpers ---
    async function uploadSingleFile(file: File, category: string, name: string): Promise<string> {
        const fd = new FormData();
        fd.append("category", category);
        fd.append("name", name);
        fd.append("file", file);
        const res = await apiFetch(`${API_BASE}/api/imgs/upload`, { method: "POST", body: fd });
        if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Erro no upload"); }
        return (await res.json()).url;
    }

    async function uploadMultipleFiles(files: File[], category: string, name: string): Promise<string[]> {
        const fd = new FormData();
        fd.append("category", category);
        fd.append("name", name);
        files.forEach(f => fd.append("files", f));
        const res = await apiFetch(`${API_BASE}/api/imgs/upload-multiple`, { method: "POST", body: fd });
        if (!res.ok) { const err = await res.json(); throw new Error(err.message || "Erro no upload múltiplo"); }
        return (await res.json()).urls;
    }

    // --- Validation ---
    const validateRules = (): boolean => {
        const errors: Record<string, boolean> = {};
        let hasError = false;

        (formData.rules || []).forEach((rule: any, idx: number) => {
            if (!rule.label || !rule.label.trim()) {
                errors[`rule_${idx}_label`] = true;
                hasError = true;
            }
            if (!rule.title || !rule.title.trim()) {
                errors[`rule_${idx}_title`] = true;
                hasError = true;
            }
            if (!rule.desc || !rule.desc.trim()) {
                errors[`rule_${idx}_desc`] = true;
                hasError = true;
            }
        });

        setValidationErrors(errors);
        return !hasError;
    };

    // --- Submit ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateRules()) {
            toast.info("⚠️ Preencha todos os campos das Regras antes de salvar.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const { category, name } = formData;

            const uploadPromises: Promise<any>[] = [];
            
            if (newBannerFile) {
                uploadPromises.push(uploadSingleFile(newBannerFile, category, name));
            } else {
                uploadPromises.push(Promise.resolve(formData.image));
            }

            if (newCourtFile) {
                uploadPromises.push(uploadSingleFile(newCourtFile, category, name));
            } else {
                uploadPromises.push(Promise.resolve(formData.courts?.image || formData.image));
            }

            if (newGalleryFiles.length > 0) {
                uploadPromises.push(uploadMultipleFiles(newGalleryFiles, category, name));
            } else {
                uploadPromises.push(Promise.resolve([]));
            }

            const [bannerUrl, courtUrl, galleryUrls] = await Promise.all(uploadPromises);

            const calculateExpiration = (months: number) => {
                const d = new Date();
                d.setMonth(d.getMonth() + months);
                return d.toISOString();
            };

            let finalExpiration = formData.highlightExpiration;
            if (formData.highlight && highlightRenewMonths > 0) {
                finalExpiration = calculateExpiration(highlightRenewMonths);
            } else if (!formData.highlight) {
                finalExpiration = null;
            }

            const payload = {
                ...formData,
                highlightExpiration: finalExpiration,
                image: bannerUrl,
                about: { ...formData.about, title: getCategoryLabel(category) },
                courts: { ...formData.courts, image: courtUrl },
                gallery: [...formData.gallery, ...(galleryUrls || [])],
            };

            const response = await apiFetch(`${API_BASE}/api/sports/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("Local esportivo atualizado com sucesso!");
                navigate("/admin/esportes");
            } else {
                const err = await response.json();
                toast.error(err.message || "Erro ao atualizar o cadastro.");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Ocorreu um erro inesperado ao salvar os dados.");
        } finally {
            setLoading(false);
        }
    };

    const getInputClasses = (key: string) => {
        const base = "w-full p-3 bg-white dark:bg-[#1a1208] border text-[#241a06] dark:text-[#f0e6d6] border-[#ede0d8] dark:border-[#3a2e1a] rounded-xl outline-none focus:ring-2 focus:ring-(--color-primary) transition-all";
        return validationErrors[key]
            ? `${base} border-red-400 ring-2 ring-red-200 dark:ring-red-900/40 bg-red-50/50 dark:bg-red-950/20`
            : `${base} border-[#ede0d8] dark:border-[#3a2e1a]`;
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <button onClick={() => navigate("/admin/esportes")} className="flex items-center gap-2 text-[#8a7968] dark:text-[#c5b49e] hover:text-[#241a06] dark:hover:text-white transition-colors font-medium cursor-pointer">
                <ArrowLeft size={20} /> Voltar para a lista
            </button>

            <div className="bg-white dark:bg-[#241a06] rounded-3xl p-6 md:p-10 shadow-sm border border-[#ede0d8] dark:border-[#3a2e1a]">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-(--color-primary)/10 text-(--color-primary) rounded-2xl flex items-center justify-center">
                        <Save size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-[#241a06] dark:text-[#f0e6d6]">
                            Editar Local Esportivo
                        </h2>
                        <p className="text-[#8a7968] dark:text-[#c5b49e]">Atualize os detalhes do local de esporte e lazer.</p>
                    </div>
                </div>

                <div className="h-px bg-[#ede0d8] dark:bg-[#2e2310] w-full my-8"></div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* ═══ BLOCO 1: Infos Básicas ═══ */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-black">1</span>
                                Informações Básicas
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-sm text-[#5a4d3e] dark:text-[#f0e6d6] flex items-center gap-1.5">
                                    <Star size={16} className={formData.highlight ? "text-yellow-400 fill-yellow-400" : "text-[#8a7968] dark:text-[#8a7968]"} />
                                    Destaque
                                </span>
                                <button type="button" onClick={() => setFormData({ ...formData, highlight: !formData.highlight })}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer shrink-0 ${formData.highlight ? 'bg-(--color-primary)' : 'bg-[#ede0d8] dark:bg-[#3a2e1a]'}`}>
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${formData.highlight ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                {formData.highlight && (
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={16} className="text-[#8a7968] dark:text-[#c5b49e] ml-2" />
                                        <select 
                                            value={highlightRenewMonths} 
                                            onChange={(e) => setHighlightRenewMonths(Number(e.target.value))}
                                            className="px-3 py-1 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] rounded-lg text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] outline-none w-44 cursor-pointer"
                                        >
                                            <option value={0}>Manter Vencimento</option>
                                            <option value={1}>Renovar +1 Mês</option>
                                            <option value={2}>Renovar +2 Meses</option>
                                            <option value={3}>Renovar +3 Meses</option>
                                            <option value={6}>Renovar +6 Meses</option>
                                            <option value={12}>Renovar +1 Ano</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {formData.highlightExpiration && formData.highlight && (
                            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-100 dark:border-yellow-900/50 rounded-2xl flex items-center gap-3 text-yellow-800 dark:text-yellow-300 text-sm">
                                <ShieldAlert size={20} className="shrink-0 text-yellow-600 dark:text-yellow-400" />
                                <span>
                                    Este local está em destaque. Expiração configurada para: <strong>{new Date(formData.highlightExpiration).toLocaleDateString()}</strong>
                                </span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Nome do Local</label>
                                <input type="text" required className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Categoria de Esporte</label>
                                <select className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs appearance-none font-medium cursor-pointer"
                                    value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="Futebol">Futebol</option>
                                    <option value="Basket">Basquete</option>
                                    <option value="Vôlei">Vôlei</option>
                                    <option value="Beisebol">Beisebol</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Distância (ex: '2km do centro')</label>
                                <input type="text" required className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Recursos / Destaques Rápidos (separados por vírgula)</label>
                                <input type="text" className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] placeholder:text-[#8a7968] dark:placeholder:text-[#c5b49e]/50 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    placeholder="Grama Sintética, Vestiário, Iluminação LED"
                                    value={formData.features ? formData.features.join(", ") : ""} 
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value.split(",").map(val => val.trim()).filter(Boolean) })} />
                            </div>
                        </div>

                        <div className="mt-6">
                            <SocialsInput
                                socials={formData.socials}
                                onChange={(socials) => setFormData({ ...formData, socials })}
                            />
                        </div>
                    </section>

                    {/* ═══ BLOCO 1.5: Localização ═══ */}
                    <section>
                        <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center text-sm font-black">●</span>
                            Localização no Mapa
                        </h3>
                        <MapPicker latitude={formData.latitude} longitude={formData.longitude}
                            onLocationChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })} />
                    </section>

                    {/* ═══ BLOCO 2: Imagens com Drag & Drop ═══ */}
                    <section>
                        <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-sm font-black">2</span>
                            Imagens
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Banner - Drag & Drop */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Imagem do Banner Principal</label>
                                <div className="w-full h-32 rounded-2xl overflow-hidden border border-[#ede0d8] dark:border-[#3a2e1a] mb-2 relative group">
                                    <img src={newBannerFile ? URL.createObjectURL(newBannerFile) : (formData.image ? `${API_BASE}${formData.image}` : "https://placehold.co/600x400")} alt="Banner" className="w-full h-full object-cover" />
                                    {newBannerFile && (
                                        <button type="button" onClick={() => setNewBannerFile(null)}
                                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                <div
                                    onDragOver={(e) => handleDragOver(e, 'banner')}
                                    onDragLeave={(e) => handleDragLeave(e, 'banner')}
                                    onDrop={(e) => handleDrop(e, 'banner')}
                                    onClick={() => bannerInputRef.current?.click()}
                                    className={`w-full flex flex-col items-center gap-2 px-5 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                                        dragStates.banner
                                            ? 'border-(--color-primary) bg-(--color-primary)/10 scale-[1.02]'
                                            : 'border-[#ede0d8] dark:border-[#3a2e1a] bg-[#faf5f0] dark:bg-[#1a1208]/40 hover:border-(--color-primary)'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                        dragStates.banner ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-[#ede0d8] dark:bg-[#2e2310] text-[#8a7968] dark:text-[#c5b49e]'
                                    }`}>
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-[#8a7968] dark:text-[#c5b49e] text-sm font-medium text-center">
                                        {dragStates.banner ? '📸 Solte a imagem aqui!' : (newBannerFile ? newBannerFile.name : 'Clique/Arraste para alterar a imagem de capa')}
                                    </span>
                                    <input ref={bannerInputRef} type="file" accept="image/*" className="hidden"
                                        onChange={(e) => { if (e.target.files?.[0]) setNewBannerFile(e.target.files[0]); }} />
                                </div>
                            </div>

                            {/* Foto da Quadra - Drag & Drop */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Imagem de Detalhe da Quadra/Campo</label>
                                <div className="w-full h-32 rounded-2xl overflow-hidden border border-[#ede0d8] dark:border-[#3a2e1a] mb-2 relative group">
                                    <img src={newCourtFile ? URL.createObjectURL(newCourtFile) : (formData.courts?.image ? `${API_BASE}${formData.courts.image}` : (formData.image ? `${API_BASE}${formData.image}` : "https://placehold.co/600x400"))} alt="Court" className="w-full h-full object-cover" />
                                    {newCourtFile && (
                                        <button type="button" onClick={() => setNewCourtFile(null)}
                                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                <div
                                    onDragOver={(e) => handleDragOver(e, 'court')}
                                    onDragLeave={(e) => handleDragLeave(e, 'court')}
                                    onDrop={(e) => handleDrop(e, 'court')}
                                    onClick={() => courtInputRef.current?.click()}
                                    className={`w-full flex flex-col items-center gap-2 px-5 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                                        dragStates.court
                                            ? 'border-(--color-primary) bg-(--color-primary)/10 scale-[1.02]'
                                            : 'border-[#ede0d8] dark:border-[#3a2e1a] bg-[#faf5f0] dark:bg-[#1a1208]/40 hover:border-(--color-primary)'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                        dragStates.court ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-[#ede0d8] dark:bg-[#2e2310] text-[#8a7968] dark:text-[#c5b49e]'
                                    }`}>
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-[#8a7968] dark:text-[#c5b49e] text-sm font-medium text-center">
                                        {dragStates.court ? '📸 Solte a imagem aqui!' : (newCourtFile ? newCourtFile.name : 'Clique/Arraste para alterar a foto complementar')}
                                    </span>
                                    <input ref={courtInputRef} type="file" accept="image/*" className="hidden"
                                        onChange={(e) => { if (e.target.files?.[0]) setNewCourtFile(e.target.files[0]); }} />
                                </div>
                            </div>
                        </div>

                        {/* Galeria de Fotos */}
                        <div className="space-y-2 mt-6">
                            <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Galeria de Fotos</label>
                            
                            {/* Imagens Existentes da Galeria */}
                            {formData.gallery && formData.gallery.length > 0 && (
                                <div className="space-y-1 mb-3">
                                    <div className="text-xs font-bold text-[#8a7968] dark:text-[#c5b49e]">Imagens Atuais (Clique para remover):</div>
                                    <div className="flex flex-wrap gap-3 p-4 bg-[#faf5f0] dark:bg-[#1a1208]/60 border border-[#ede0d8] dark:border-[#3a2e1a] rounded-2xl">
                                        {formData.gallery.map((url: string, idx: number) => (
                                            <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden relative group border border-[#ede0d8] dark:border-[#3a2e1a]">
                                                <img src={`${API_BASE}${url}`} alt="gallery-item" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => handleRemoveExistingGalleryImage(url)}
                                                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Novas Imagens Selecionadas */}
                            {newGalleryFiles.length > 0 && (
                                <div className="space-y-1 mb-3">
                                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Novas fotos a serem enviadas:</div>
                                    <div className="flex flex-wrap gap-3 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl">
                                        {newGalleryFiles.map((file, idx) => (
                                            <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden relative group border border-[#ede0d8] dark:border-[#3a2e1a]">
                                                <img src={URL.createObjectURL(file)} alt="gallery-preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => handleRemoveNewGalleryFile(idx)}
                                                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div
                                onDragOver={(e) => handleDragOver(e, 'gallery')}
                                onDragLeave={(e) => handleDragLeave(e, 'gallery')}
                                onDrop={(e) => handleDrop(e, 'gallery')}
                                onClick={() => galleryInputRef.current?.click()}
                                className={`w-full flex flex-col items-center gap-2 px-5 py-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                                    dragStates.gallery
                                        ? 'border-(--color-primary) bg-(--color-primary)/10 scale-[1.02]'
                                        : 'border-[#ede0d8] dark:border-[#3a2e1a] bg-[#faf5f0] dark:bg-[#1a1208]/40 hover:border-(--color-primary)'
                                }`}
                            >
                                <div className="w-12 h-12 rounded-full bg-[#ede0d8] dark:bg-[#2e2310] flex items-center justify-center text-[#8a7968] dark:text-[#f0e6d6] group-hover:text-(--color-primary) transition-colors">
                                    <ImagePlus size={24} />
                                </div>
                                <span className="text-[#8a7968] dark:text-[#c5b49e] text-sm font-medium text-center">
                                    Arraste e solte novas fotos ou clique para adicionar à galeria
                                </span>
                                <input ref={galleryInputRef} type="file" multiple accept="image/*" className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            const files = Array.from(e.target.files);
                                            setNewGalleryFiles(prev => [...prev, ...files]);
                                        }
                                    }} />
                            </div>
                        </div>
                    </section>

                    {/* ═══ BLOCO 3: Sobre o Local ═══ */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2 border-b border-[#ede0d8] dark:border-[#3a2e1a] pb-3">
                            <span className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center text-sm font-black">3</span>
                            Apresentação (Sobre o Local)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Subtítulo de Apresentação</label>
                                <input type="text" className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.about?.subtitle || ""} onChange={(e) => setFormData({ ...formData, about: { ...formData.about, subtitle: e.target.value } })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Descrição Detalhada (parágrafos)</label>
                            {(formData.about?.desc || [""]).map((p: string, idx: number) => (
                                <div key={idx} className="flex gap-2">
                                    <textarea className="w-full p-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs min-h-24"
                                        value={p} onChange={(e) => {
                                            const nd = [...(formData.about?.desc || [""])];
                                            nd[idx] = e.target.value;
                                            setFormData({ ...formData, about: { ...formData.about, desc: nd } });
                                        }} />
                                    {(formData.about?.desc || []).length > 1 && (
                                        <button type="button" onClick={() => {
                                            const nd = formData.about.desc.filter((_: any, i: number) => i !== idx);
                                            setFormData({ ...formData, about: { ...formData.about, desc: nd } });
                                        }} className="self-start mt-2 p-3 bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 cursor-pointer">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => setFormData({ ...formData, about: { ...formData.about, desc: [...(formData.about?.desc || [""]), ""] } })}
                                className="flex items-center gap-1.5 text-sm font-bold text-(--color-primary) mt-2 hover:underline cursor-pointer">
                                <Plus size={16} /> Adicionar Parágrafo
                            </button>
                        </div>
                    </section>

                    {/* ═══ BLOCO 4: Quadras e Campos ═══ */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2 border-b border-[#ede0d8] dark:border-[#3a2e1a] pb-3">
                            <span className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-black">4</span>
                            Estrutura Esportiva (Quadras e Campos)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Título da Seção de Quadras</label>
                                <input type="text" className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.courts?.title || ""} onChange={(e) => setFormData({ ...formData, courts: { ...formData.courts, title: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Tipo de Quadra (ex: Futebol Society, Quadra Coberta)</label>
                                <input type="text" className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.courts?.type || ""} onChange={(e) => setFormData({ ...formData, courts: { ...formData.courts, type: e.target.value } })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Detalhes e Dimensões (parágrafos)</label>
                            {(formData.courts?.desc || [""]).map((p: string, idx: number) => (
                                <div key={idx} className="flex gap-2">
                                    <textarea className="w-full p-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs min-h-24"
                                        value={p} onChange={(e) => {
                                            const nd = [...(formData.courts?.desc || [""])];
                                            nd[idx] = e.target.value;
                                            setFormData({ ...formData, courts: { ...formData.courts, desc: nd } });
                                        }} />
                                    {(formData.courts?.desc || []).length > 1 && (
                                        <button type="button" onClick={() => {
                                            const nd = formData.courts.desc.filter((_: any, i: number) => i !== idx);
                                            setFormData({ ...formData, courts: { ...formData.courts, desc: nd } });
                                        }} className="self-start mt-2 p-3 bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 cursor-pointer">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => setFormData({ ...formData, courts: { ...formData.courts, desc: [...(formData.courts?.desc || [""]), ""] } })}
                                className="flex items-center gap-1.5 text-sm font-bold text-(--color-primary) mt-2 hover:underline cursor-pointer">
                                <Plus size={16} /> Adicionar Parágrafo
                            </button>
                        </div>
                    </section>

                    {/* ═══ BLOCO 5: Regras e Horários ═══ */}
                    <section className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ede0d8] dark:border-[#3a2e1a] pb-3">
                            <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm font-black">5</span>
                                Regras e Recomendações
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {RULE_PRESETS.map((p, i) => (
                                    <button key={i} type="button" onClick={() => handleAddRulePreset(p)}
                                        className="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors font-bold cursor-pointer">
                                        + {p.title}
                                    </button>
                                ))}
                                <button type="button" onClick={() => handleAddRulePreset()}
                                    className="text-xs bg-[#ede0d8] dark:bg-[#2e2310] hover:bg-[#ede0d8] dark:hover:bg-[#3a2e1a] text-[#5a4d3e] dark:text-[#f0e6d6] px-3 py-1.5 rounded-lg transition-colors font-bold cursor-pointer">
                                    + Personalizado
                                </button>
                            </div>
                        </div>

                        {(formData.rules || []).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {formData.rules.map((rule: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-[#faf5f0] dark:bg-[#1a1208]/60 border border-[#ede0d8] dark:border-[#3a2e1a] rounded-3xl space-y-4 relative group">
                                        <button type="button" onClick={() => handleRemoveRule(idx)}
                                            className="absolute top-4 right-4 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 p-2 rounded-xl transition-colors cursor-pointer">
                                            <Trash2 size={18} />
                                        </button>

                                        <div className="space-y-2 pr-10">
                                            <label className="block text-xs font-bold text-[#8a7968] dark:text-[#c5b49e] uppercase tracking-wider">Etiqueta/Ícone (ex: '08h-22h' ou '📋')</label>
                                            <input type="text" className={getInputClasses(`rule_${idx}_label`)}
                                                value={rule.label} onChange={(e) => {
                                                    const nr = [...formData.rules];
                                                    nr[idx].label = e.target.value;
                                                    setFormData({ ...formData, rules: nr });
                                                }} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-[#8a7968] dark:text-[#c5b49e] uppercase tracking-wider">Título do Item</label>
                                            <input type="text" className={getInputClasses(`rule_${idx}_title`)}
                                                value={rule.title} onChange={(e) => {
                                                    const nr = [...formData.rules];
                                                    nr[idx].title = e.target.value;
                                                    setFormData({ ...formData, rules: nr });
                                                }} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-[#8a7968] dark:text-[#c5b49e] uppercase tracking-wider">Descrição / Detalhe</label>
                                            <textarea className={getInputClasses(`rule_${idx}_desc`)}
                                                value={rule.desc} onChange={(e) => {
                                                    const nr = [...formData.rules];
                                                    nr[idx].desc = e.target.value;
                                                    setFormData({ ...formData, rules: nr });
                                                }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#faf5f0] dark:bg-[#1a1208]/30 border border-[#ede0d8] dark:border-[#3a2e1a] border-dashed rounded-3xl p-8 text-center text-[#8a7968] dark:text-[#c5b49e]">
                                Nenhum horário ou regra cadastrado. Clique nos botões acima para adicionar.
                            </div>
                        )}
                    </section>

                    {/* ═══ BLOCO 6: Infraestrutura ═══ */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-[#ede0d8] dark:border-[#3a2e1a] pb-3">
                            <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center text-sm font-black">6</span>
                                Comodidades e Infraestrutura do Local
                            </h3>
                            <button type="button" onClick={handleAddInfrastructureCard}
                                className="text-xs bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors font-bold flex items-center gap-1 cursor-pointer">
                                <Plus size={14} /> Novo Recurso
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Título Geral da Seção</label>
                            <input type="text" className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                value={formData.infrastructure?.title || ""} onChange={(e) => setFormData({ ...formData, infrastructure: { ...formData.infrastructure, title: e.target.value } })} />
                        </div>

                        {formData.infrastructure?.cards && formData.infrastructure.cards.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {formData.infrastructure.cards.map((card: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-[#faf5f0] dark:bg-[#1a1208]/60 border border-[#ede0d8] dark:border-[#3a2e1a] rounded-3xl space-y-4 relative">
                                        <button type="button" onClick={() => handleRemoveInfrastructureCard(idx)}
                                            className="absolute top-4 right-4 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 p-2 rounded-xl transition-colors cursor-pointer">
                                            <Trash2 size={18} />
                                        </button>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-[#8a7968] dark:text-[#c5b49e] uppercase tracking-wider">Ícone (ex: Activity, Shower, Car)</label>
                                            <input type="text" className="w-full p-2.5 bg-white dark:bg-[#241a06] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-xl outline-none"
                                                value={card.icon} onChange={(e) => {
                                                    const nc = [...formData.infrastructure.cards];
                                                    nc[idx].icon = e.target.value;
                                                    setFormData({ ...formData, infrastructure: { ...formData.infrastructure, cards: nc } });
                                                }} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-[#8a7968] dark:text-[#c5b49e] uppercase tracking-wider">Título</label>
                                            <input type="text" className="w-full p-2.5 bg-white dark:bg-[#241a06] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-xl outline-none"
                                                value={card.title} onChange={(e) => {
                                                    const nc = [...formData.infrastructure.cards];
                                                    nc[idx].title = e.target.value;
                                                    setFormData({ ...formData, infrastructure: { ...formData.infrastructure, cards: nc } });
                                                }} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-[#8a7968] dark:text-[#c5b49e] uppercase tracking-wider">Descrição</label>
                                            <textarea className="w-full p-2.5 bg-white dark:bg-[#241a06] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-xl outline-none min-h-16 text-sm"
                                                value={card.desc} onChange={(e) => {
                                                    const nc = [...formData.infrastructure.cards];
                                                    nc[idx].desc = e.target.value;
                                                    setFormData({ ...formData, infrastructure: { ...formData.infrastructure, cards: nc } });
                                                }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#faf5f0] dark:bg-[#1a1208]/30 border border-[#ede0d8] dark:border-[#3a2e1a] border-dashed rounded-3xl p-8 text-center text-[#8a7968] dark:text-[#c5b49e]">
                                Nenhuma infraestrutura cadastrada. Clique em "Novo Recurso" para adicionar.
                            </div>
                        )}
                    </section>

                    {/* ═══ BLOCO 7: CTA ═══ */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2 border-b border-[#ede0d8] dark:border-[#3a2e1a] pb-3">
                            <span className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center text-sm font-black">7</span>
                            Chamado para Ação (CTA)
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Título do CTA</label>
                                <input type="text" className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.cta?.title || ""} onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, title: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Texto do CTA</label>
                                <textarea className="w-full p-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs min-h-20"
                                    value={formData.cta?.desc || ""} onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, desc: e.target.value } })} />
                            </div>
                        </div>
                    </section>

                    {/* ═══ SUBMIT BUTTON ═══ */}
                    <div className="flex gap-4 pt-4 border-t border-[#ede0d8] dark:border-[#3a2e1a]">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-(--color-primary) text-white py-4 rounded-2xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-(--color-primary)/20 disabled:bg-[#ede0d8] dark:disabled:bg-[#2e2310] disabled:shadow-none flex items-center justify-center cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : "Atualizar Local Esportivo"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/esportes")}
                            className="px-8 py-4 bg-[#ede0d8] dark:bg-[#2e2310] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl font-bold text-lg hover:bg-[#ede0d8] dark:hover:bg-[#3a2e1a] transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

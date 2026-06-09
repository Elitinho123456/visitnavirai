import { toast } from '@/utils/toast';
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Upload, Star, ImagePlus, X, Clock, ShieldAlert } from "lucide-react";
import MapPicker from "@/components/shared/MapPicker";
import { API_BASE_URL, apiFetch } from "@/config/api";

function getCategoryLabel(category: string): string {
    return `Sobre o Local Esportivo (${category})`;
}

const API_BASE = API_BASE_URL;

export default function CadSport() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
    const [highlightMonths, setHighlightMonths] = useState(1);

    // Imagens
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [courtFile, setCourtFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

    // Drag states
    const [dragStates, setDragStates] = useState<Record<string, boolean>>({ banner: false, court: false, gallery: false });

    // Refs for file inputs
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
            setBannerFile(files[0]);
        } else if (zone === 'court') {
            setCourtFile(files[0]);
        } else if (zone === 'gallery') {
            setGalleryFiles(prev => [...prev, ...files]);
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
        setFormData({ ...formData, rules: [...formData.rules, newItem] });
    };

    const handleRemoveRule = (index: number) => {
        const nr = [...formData.rules];
        nr.splice(index, 1);
        setFormData({ ...formData, rules: nr });
        
        const newErrors = { ...validationErrors };
        delete newErrors[`rule_${index}_label`];
        delete newErrors[`rule_${index}_title`];
        delete newErrors[`rule_${index}_desc`];
        setValidationErrors(newErrors);
    };

    const handleAddInfrastructureCard = () => {
        setFormData({ 
            ...formData, 
            infrastructure: { 
                ...formData.infrastructure, 
                cards: [...formData.infrastructure.cards, { icon: "Activity", title: "Vestiários", desc: "Vestiários masculinos e femininos com chuveiros" }] 
            } 
        });
    };

    const handleRemoveInfrastructureCard = (index: number) => {
        const nc = [...formData.infrastructure.cards];
        nc.splice(index, 1);
        setFormData({ ...formData, infrastructure: { ...formData.infrastructure, cards: nc } });
    };

    const handleRemoveGalleryFile = (index: number) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
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

        formData.rules.forEach((rule: any, idx: number) => {
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
            toast.info("⚠️ Preencha todos os campos das Regras e Recomendações antes de salvar.");
            return;
        }

        setLoading(true);

        try {
            if (!bannerFile) {
                toast.info("Por favor, selecione uma imagem para o Banner principal.");
                setLoading(false);
                return;
            }

            const token = localStorage.getItem("token");
            const { category, name } = formData;

            const uploadPromises: Promise<any>[] = [];
            uploadPromises.push(uploadSingleFile(bannerFile, category, name));
            if (courtFile) {
                uploadPromises.push(uploadSingleFile(courtFile, category, name));
            } else {
                uploadPromises.push(Promise.resolve(null));
            }
            if (galleryFiles.length > 0) {
                uploadPromises.push(uploadMultipleFiles(galleryFiles, category, name));
            } else {
                uploadPromises.push(Promise.resolve([]));
            }

            const [bannerUrl, courtUrl, galleryUrls] = await Promise.all(uploadPromises);

            const calculateExpiration = (months: number) => {
                const d = new Date();
                d.setMonth(d.getMonth() + months);
                return d.toISOString();
            };

            const payload = {
                ...formData,
                highlightExpiration: formData.highlight ? calculateExpiration(highlightMonths) : null,
                image: bannerUrl,
                about: { ...formData.about, title: getCategoryLabel(category) },
                courts: { ...formData.courts, image: courtUrl || bannerUrl },
                gallery: galleryUrls || [],
            };

            const response = await apiFetch(`${API_BASE}/api/sports`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("Local esportivo cadastrado com sucesso!");
                navigate("/admin/esportes");
            } else {
                const err = await response.json();
                toast.error(err.message || "Erro ao realizar o cadastro.");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Ocorreu um erro inesperado ao salvar os dados.");
        } finally {
            setLoading(false);
        }
    };

    const getInputClasses = (key: string) => {
        const base = "w-full p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-(--color-primary) transition-all";
        return validationErrors[key]
            ? `${base} border-red-400 ring-2 ring-red-200 bg-red-50/50`
            : `${base} border-slate-100`;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <button onClick={() => navigate("/admin/esportes")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium cursor-pointer">
                <ArrowLeft size={20} /> Voltar para a lista
            </button>

            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-(--color-primary)/10 text-(--color-primary) rounded-2xl flex items-center justify-center">
                        <Upload size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800">
                            Novo Local Esportivo
                        </h2>
                        <p className="text-slate-500">Cadastre os detalhes do complexo esportivo, quadra ou campo.</p>
                    </div>
                </div>

                <div className="h-px bg-slate-100 w-full my-8"></div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* ═══ BLOCO 1: Infos Básicas ═══ */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-black">1</span>
                                Informações Básicas
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-sm text-slate-600 flex items-center gap-1.5">
                                    <Star size={16} className={formData.highlight ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />
                                    Destaque
                                </span>
                                <button type="button" onClick={() => setFormData({ ...formData, highlight: !formData.highlight })}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer shrink-0 ${formData.highlight ? 'bg-(--color-primary)' : 'bg-slate-300'}`}>
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${formData.highlight ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                {formData.highlight && (
                                    <select 
                                        value={highlightMonths} 
                                        onChange={(e) => setHighlightMonths(Number(e.target.value))}
                                        className="ml-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none w-32 cursor-pointer"
                                    >
                                        <option value={1}>1 Mês</option>
                                        <option value={2}>2 Meses</option>
                                        <option value={3}>3 Meses</option>
                                        <option value={6}>6 Meses</option>
                                        <option value={12}>1 Ano</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Nome do Local</label>
                                <input type="text" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Categoria de Esporte</label>
                                <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs appearance-none font-medium cursor-pointer"
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
                                <label className="block text-sm font-bold text-slate-700 ml-1">Distância (ex: '2km do centro')</label>
                                <input type="text" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Recursos / Destaques Rápidos (separados por vírgula)</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    placeholder="Grama Sintética, Vestiário, Iluminação LED"
                                    value={formData.features.join(", ")} 
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value.split(",").map(val => val.trim()).filter(Boolean) })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">WhatsApp</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.socials?.whatsapp || ""} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, whatsapp: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Instagram</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.socials?.instagram || ""} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Facebook</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.socials?.facebook || ""} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Website</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.socials?.website || ""} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, website: e.target.value } })} />
                            </div>
                        </div>
                    </section>

                    {/* ═══ BLOCO 1.5: Localização ═══ */}
                    <section>
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-sm font-black">●</span>
                            Localização no Mapa
                        </h3>
                        <MapPicker latitude={formData.latitude} longitude={formData.longitude}
                            onLocationChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })} />
                    </section>

                    {/* ═══ BLOCO 2: Imagens com Drag & Drop ═══ */}
                    <section>
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center text-sm font-black">2</span>
                            Imagens
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Banner - Drag & Drop */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Imagem do Banner Principal</label>
                                {bannerFile && (
                                    <div className="w-full h-32 rounded-2xl overflow-hidden border border-slate-200 mb-2 relative group">
                                        <img src={URL.createObjectURL(bannerFile)} alt="Preview banner" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setBannerFile(null)}
                                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                <div
                                    onDragOver={(e) => handleDragOver(e, 'banner')}
                                    onDragLeave={(e) => handleDragLeave(e, 'banner')}
                                    onDrop={(e) => handleDrop(e, 'banner')}
                                    onClick={() => bannerInputRef.current?.click()}
                                    className={`w-full flex flex-col items-center gap-2 px-5 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                                        dragStates.banner
                                            ? 'border-(--color-primary) bg-(--color-primary)/10 scale-[1.02]'
                                            : 'border-slate-300 bg-slate-50 hover:border-(--color-primary)'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                        dragStates.banner ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-slate-200 text-slate-500'
                                    }`}>
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-slate-500 text-sm font-medium text-center">
                                        {dragStates.banner ? '📸 Solte a imagem aqui!' : (bannerFile ? bannerFile.name : 'Clique ou arraste a imagem de capa')}
                                    </span>
                                    <input ref={bannerInputRef} type="file" required={!bannerFile} accept="image/*" className="hidden"
                                        onChange={(e) => { if (e.target.files?.[0]) setBannerFile(e.target.files[0]); }} />
                                </div>
                            </div>

                            {/* Foto da Quadra - Drag & Drop */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Imagem de Detalhe da Quadra/Campo</label>
                                {courtFile && (
                                    <div className="w-full h-32 rounded-2xl overflow-hidden border border-slate-200 mb-2 relative group">
                                        <img src={URL.createObjectURL(courtFile)} alt="Preview court" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setCourtFile(null)}
                                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                <div
                                    onDragOver={(e) => handleDragOver(e, 'court')}
                                    onDragLeave={(e) => handleDragLeave(e, 'court')}
                                    onDrop={(e) => handleDrop(e, 'court')}
                                    onClick={() => courtInputRef.current?.click()}
                                    className={`w-full flex flex-col items-center gap-2 px-5 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                                        dragStates.court
                                            ? 'border-(--color-primary) bg-(--color-primary)/10 scale-[1.02]'
                                            : 'border-slate-300 bg-slate-50 hover:border-(--color-primary)'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                        dragStates.court ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-slate-200 text-slate-500'
                                    }`}>
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-slate-500 text-sm font-medium text-center">
                                        {dragStates.court ? '📸 Solte a imagem aqui!' : (courtFile ? courtFile.name : 'Clique ou arraste a foto complementar')}
                                    </span>
                                    <input ref={courtInputRef} type="file" accept="image/*" className="hidden"
                                        onChange={(e) => { if (e.target.files?.[0]) setCourtFile(e.target.files[0]); }} />
                                </div>
                            </div>
                        </div>

                        {/* Galeria de Fotos */}
                        <div className="space-y-2 mt-6">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Galeria de Fotos (Arraste múltiplas fotos)</label>
                            
                            {galleryFiles.length > 0 && (
                                <div className="flex flex-wrap gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-2">
                                    {galleryFiles.map((file, idx) => (
                                        <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden relative group border border-slate-200">
                                            <img src={URL.createObjectURL(file)} alt="gallery-preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => handleRemoveGalleryFile(idx)}
                                                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
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
                                        : 'border-slate-300 bg-slate-50 hover:border-(--color-primary)'
                                }`}
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-(--color-primary) transition-colors">
                                    <ImagePlus size={24} />
                                </div>
                                <span className="text-slate-500 text-sm font-medium text-center">
                                    Arraste e solte fotos da galeria ou clique para selecionar
                                </span>
                                <input ref={galleryInputRef} type="file" multiple accept="image/*" className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            const files = Array.from(e.target.files);
                                            setGalleryFiles(prev => [...prev, ...files]);
                                        }
                                    }} />
                            </div>
                        </div>
                    </section>

                    {/* ═══ BLOCO 3: Sobre o Local ═══ */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-sm font-black">3</span>
                            Apresentação (Sobre o Local)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Subtítulo de Apresentação</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.about.subtitle} onChange={(e) => setFormData({ ...formData, about: { ...formData.about, subtitle: e.target.value } })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Descrição Detalhada (parágrafos)</label>
                            {formData.about.desc.map((p: string, idx: number) => (
                                <div key={idx} className="flex gap-2">
                                    <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs min-h-24"
                                        value={p} onChange={(e) => {
                                            const nd = [...formData.about.desc];
                                            nd[idx] = e.target.value;
                                            setFormData({ ...formData, about: { ...formData.about, desc: nd } });
                                        }} />
                                    {formData.about.desc.length > 1 && (
                                        <button type="button" onClick={() => {
                                            const nd = formData.about.desc.filter((_: any, i: number) => i !== idx);
                                            setFormData({ ...formData, about: { ...formData.about, desc: nd } });
                                        }} className="self-start mt-2 p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 cursor-pointer">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => setFormData({ ...formData, about: { ...formData.about, desc: [...formData.about.desc, ""] } })}
                                className="flex items-center gap-1.5 text-sm font-bold text-(--color-primary) mt-2 hover:underline cursor-pointer">
                                <Plus size={16} /> Adicionar Parágrafo
                            </button>
                        </div>
                    </section>

                    {/* ═══ BLOCO 4: Quadras e Campos ═══ */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-sm font-black">4</span>
                            Estrutura Esportiva (Quadras e Campos)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Título da Seção de Quadras</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.courts.title} onChange={(e) => setFormData({ ...formData, courts: { ...formData.courts, title: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Tipo de Quadra (ex: Futebol Society, Quadra Coberta)</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.courts.type} onChange={(e) => setFormData({ ...formData, courts: { ...formData.courts, type: e.target.value } })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Detalhes e Dimensões (parágrafos)</label>
                            {formData.courts.desc.map((p: string, idx: number) => (
                                <div key={idx} className="flex gap-2">
                                    <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs min-h-24"
                                        value={p} onChange={(e) => {
                                            const nd = [...formData.courts.desc];
                                            nd[idx] = e.target.value;
                                            setFormData({ ...formData, courts: { ...formData.courts, desc: nd } });
                                        }} />
                                    {formData.courts.desc.length > 1 && (
                                        <button type="button" onClick={() => {
                                            const nd = formData.courts.desc.filter((_: any, i: number) => i !== idx);
                                            setFormData({ ...formData, courts: { ...formData.courts, desc: nd } });
                                        }} className="self-start mt-2 p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 cursor-pointer">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => setFormData({ ...formData, courts: { ...formData.courts, desc: [...formData.courts.desc, ""] } })}
                                className="flex items-center gap-1.5 text-sm font-bold text-(--color-primary) mt-2 hover:underline cursor-pointer">
                                <Plus size={16} /> Adicionar Parágrafo
                            </button>
                        </div>
                    </section>

                    {/* ═══ BLOCO 5: Regras e Horários ═══ */}
                    <section className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-black">5</span>
                                Regras e Recomendações
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {RULE_PRESETS.map((p, i) => (
                                    <button key={i} type="button" onClick={() => handleAddRulePreset(p)}
                                        className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors font-bold cursor-pointer">
                                        + {p.title}
                                    </button>
                                ))}
                                <button type="button" onClick={() => handleAddRulePreset()}
                                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors font-bold cursor-pointer">
                                    + Personalizado
                                </button>
                            </div>
                        </div>

                        {formData.rules.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {formData.rules.map((rule: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 relative group">
                                        <button type="button" onClick={() => handleRemoveRule(idx)}
                                            className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors cursor-pointer">
                                            <Trash2 size={18} />
                                        </button>

                                        <div className="space-y-2 pr-10">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Etiqueta/Ícone (ex: '08h-22h' ou '📋')</label>
                                            <input type="text" className={getInputClasses(`rule_${idx}_label`)}
                                                value={rule.label} onChange={(e) => {
                                                    const nr = [...formData.rules];
                                                    nr[idx].label = e.target.value;
                                                    setFormData({ ...formData, rules: nr });
                                                }} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Título do Item</label>
                                            <input type="text" className={getInputClasses(`rule_${idx}_title`)}
                                                value={rule.title} onChange={(e) => {
                                                    const nr = [...formData.rules];
                                                    nr[idx].title = e.target.value;
                                                    setFormData({ ...formData, rules: nr });
                                                }} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição / Detalhe</label>
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
                            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-8 text-center text-slate-400">
                                Nenhum horário ou regra cadastrado. Clique nos botões acima para adicionar.
                            </div>
                        )}
                    </section>

                    {/* ═══ BLOCO 6: Infraestrutura ═══ */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm font-black">6</span>
                                Comodidades e Infraestrutura do Local
                            </h3>
                            <button type="button" onClick={handleAddInfrastructureCard}
                                className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100 hover:bg-green-100 transition-colors font-bold flex items-center gap-1 cursor-pointer">
                                <Plus size={14} /> Novo Recurso
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1">Título Geral da Seção</label>
                            <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                value={formData.infrastructure.title} onChange={(e) => setFormData({ ...formData, infrastructure: { ...formData.infrastructure, title: e.target.value } })} />
                        </div>

                        {formData.infrastructure.cards.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {formData.infrastructure.cards.map((card: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 relative">
                                        <button type="button" onClick={() => handleRemoveInfrastructureCard(idx)}
                                            className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors cursor-pointer">
                                            <Trash2 size={18} />
                                        </button>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ícone (ex: Activity, Shower, Car)</label>
                                            <input type="text" className="w-full p-2.5 bg-white border border-slate-100 rounded-xl outline-none"
                                                value={card.icon} onChange={(e) => {
                                                    const nc = [...formData.infrastructure.cards];
                                                    nc[idx].icon = e.target.value;
                                                    setFormData({ ...formData, infrastructure: { ...formData.infrastructure, cards: nc } });
                                                }} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Título</label>
                                            <input type="text" className="w-full p-2.5 bg-white border border-slate-100 rounded-xl outline-none"
                                                value={card.title} onChange={(e) => {
                                                    const nc = [...formData.infrastructure.cards];
                                                    nc[idx].title = e.target.value;
                                                    setFormData({ ...formData, infrastructure: { ...formData.infrastructure, cards: nc } });
                                                }} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição</label>
                                            <textarea className="w-full p-2.5 bg-white border border-slate-100 rounded-xl outline-none min-h-16 text-sm"
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
                            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-8 text-center text-slate-400">
                                Nenhuma infraestrutura cadastrada. Clique em "Novo Recurso" para adicionar.
                            </div>
                        )}
                    </section>

                    {/* ═══ BLOCO 7: CTA ═══ */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-black">7</span>
                            Chamado para Ação (CTA)
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Título do CTA</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.cta.title} onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, title: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Texto do CTA</label>
                                <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs min-h-20"
                                    value={formData.cta.desc} onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, desc: e.target.value } })} />
                            </div>
                        </div>
                    </section>

                    {/* ═══ SUBMIT BUTTON ═══ */}
                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-(--color-primary) text-white py-4 rounded-2xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-(--color-primary)/20 disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : "Salvar Local Esportivo"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/esportes")}
                            className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

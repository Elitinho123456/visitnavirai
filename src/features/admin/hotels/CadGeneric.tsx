import { toast } from '@/utils/toast';
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Upload, Star, ImagePlus, X, Clock, ShieldAlert } from "lucide-react";
import MapPicker from "@/components/shared/MapPicker";
import SocialsInput from "@/components/shared/SocialsInput";
import { API_BASE_URL, apiFetch } from "@/config/api";

function getCategoryLabel(category: string): string {
    const map: Record<string, string> = {
        "Hotel": "Sobre o Hotel",
        "Pousada": "Sobre a Pousada",
        "Flat": "Sobre o Flat",
        "Área de Camping": "Sobre o Camping",
    };
    return map[category] || "Sobre o Estabelecimento";
}

const API_BASE = API_BASE_URL;

export default function CadGeneric() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
    const [highlightMonths, setHighlightMonths] = useState(1);

    // Imagens separadas
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [accommodationFile, setAccommodationFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

    // Drag states
    const [dragStates, setDragStates] = useState<Record<string, boolean>>({ banner: false, accommodation: false, gallery: false });

    // Refs for file inputs
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const accommodationInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<any>({
        name: "", image: "", category: "Hotel", highlight: false, distance: "", latitude: 0, longitude: 0,
        socials: { whatsapp: "", instagram: "", facebook: "", website: "" },
        features: [""],
        about: { title: "", subtitle: "Conforto e Qualidade", desc: [""] },
        accommodation: { title: "Acomodações", image: "", imageCaption: "Vista do Quarto", desc: [""] },
        policies: [],
        amenities: { title: "Comodidades Principais", cards: [] },
        gallery: [],
        cta: { title: "Pronto para reservar?", desc: "Entre em contato conosco." }
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
        } else if (zone === 'accommodation') {
            setAccommodationFile(files[0]);
        } else if (zone === 'gallery') {
            setGalleryFiles(prev => [...prev, ...files]);
        }
    };

    // --- Presets ---
    const SCHEDULE_PRESETS = [
        { label: "14h", title: "Check-in", desc: "A partir das 14h" },
        { label: "12h", title: "Check-out", desc: "Até às 12h" },
        { label: "07h", title: "Café da Manhã", desc: "Das 07h às 10h" },
        { label: "12h", title: "Almoço", desc: "Das 12h às 14h" },
        { label: "19h", title: "Jantar", desc: "Das 19h às 22h" },
    ];

    const handleAddSchedule = (preset?: typeof SCHEDULE_PRESETS[0]) => {
        const newItem = preset
            ? { type: "horario", label: preset.label, title: preset.title, desc: preset.desc }
            : { type: "horario", label: "", title: "", desc: "" };
        setFormData({ ...formData, policies: [...formData.policies, newItem] });
    };
    const handleAddRule = () => {
        setFormData({ ...formData, policies: [...formData.policies, { type: "regra", label: "📋", title: "", desc: "" }] });
    };
    const handleRemovePolicy = (index: number) => {
        const np = [...formData.policies];
        np.splice(index, 1);
        setFormData({ ...formData, policies: np });
        // Clear validation errors for removed policy
        const newErrors = { ...validationErrors };
        delete newErrors[`policy_${index}_label`];
        delete newErrors[`policy_${index}_title`];
        delete newErrors[`policy_${index}_desc`];
        setValidationErrors(newErrors);
    };
    const handleAddAmenity = () => {
        setFormData({ ...formData, amenities: { ...formData.amenities, cards: [...formData.amenities.cards, { title: "Wi-Fi", desc: "Internet de alta velocidade grátis" }] } });
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
    const validatePolicies = (): boolean => {
        const errors: Record<string, boolean> = {};
        let hasError = false;

        formData.policies.forEach((pol: any, idx: number) => {
            const isSchedule = pol.type === 'horario';

            if (isSchedule && (!pol.label || !pol.label.trim())) {
                errors[`policy_${idx}_label`] = true;
                hasError = true;
            }
            if (!pol.title || !pol.title.trim()) {
                errors[`policy_${idx}_title`] = true;
                hasError = true;
            }
            if (!pol.desc || !pol.desc.trim()) {
                errors[`policy_${idx}_desc`] = true;
                hasError = true;
            }
        });

        setValidationErrors(errors);
        return !hasError;
    };

    // --- Submit ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate policies
        if (!validatePolicies()) {
            toast.info("⚠️ Preencha todos os campos de Horários e Regras antes de salvar.\n\nOs campos com erro estão destacados em vermelho.");
            return;
        }

        setLoading(true);

        try {
            if (!bannerFile) {
                toast.info("Por favor, selecione uma imagem para o Banner.");
                setLoading(false);
                return;
            }

            const token = localStorage.getItem("token");
            const { category, name } = formData;

            const uploadPromises: Promise<any>[] = [];
            uploadPromises.push(uploadSingleFile(bannerFile, category, name));
            if (accommodationFile) {
                uploadPromises.push(uploadSingleFile(accommodationFile, category, name));
            } else {
                uploadPromises.push(Promise.resolve(null));
            }
            if (galleryFiles.length > 0) {
                uploadPromises.push(uploadMultipleFiles(galleryFiles, category, name));
            } else {
                uploadPromises.push(Promise.resolve([]));
            }

            const [bannerUrl, accommodationUrl, galleryUrls] = await Promise.all(uploadPromises);

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
                accommodation: { ...formData.accommodation, image: accommodationUrl || bannerUrl },
                gallery: galleryUrls || [],
            };

            const response = await apiFetch(`${API_BASE}/api/inns`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("Cadastro concluído com sucesso!");
                navigate("/admin/hoteis");
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
        const base = "w-full p-3 bg-white dark:bg-[#1a1208] border text-[#241a06] dark:text-[#f0e6d6] border-[#ede0d8] dark:border-[#3a2e1a] rounded-xl outline-none focus:ring-2 focus:ring-(--color-primary) transition-all";
        return validationErrors[key]
            ? `${base} border-red-400 ring-2 ring-red-200 dark:ring-red-900/40 bg-red-50/50 dark:bg-red-950/20`
            : `${base} border-[#ede0d8] dark:border-[#3a2e1a]`;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <button onClick={() => navigate("/admin/hoteis")} className="flex items-center gap-2 text-[#8a7968] dark:text-[#c5b49e] hover:text-[#241a06] dark:hover:text-white transition-colors font-medium cursor-pointer">
                <ArrowLeft size={20} /> Voltar para a lista
            </button>

            <div className="bg-white dark:bg-[#241a06] rounded-3xl p-6 md:p-10 shadow-sm border border-[#ede0d8] dark:border-[#3a2e1a]">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-(--color-primary)/10 text-(--color-primary) rounded-2xl flex items-center justify-center">
                        <Upload size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-[#241a06] dark:text-[#f0e6d6]">
                            Novo {formData.category === "Área de Camping" ? "Camping" : formData.category}
                        </h2>
                        <p className="text-[#8a7968] dark:text-[#c5b49e]">Preencha os dados completos para publicar no portal.</p>
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
                                    <select 
                                        value={highlightMonths} 
                                        onChange={(e) => setHighlightMonths(Number(e.target.value))}
                                        className="ml-2 px-3 py-1 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] rounded-lg text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] outline-none w-32 cursor-pointer"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Nome do Estabelecimento</label>
                                <input type="text" required className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] placeholder:text-[#8a7968] dark:placeholder:text-[#c5b49e]/50 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Tipo de Acomodação</label>
                                <select className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs appearance-none font-medium cursor-pointer"
                                    value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="Hotel">Hotel</option>
                                    <option value="Pousada">Pousada</option>
                                    <option value="Flat">Flat</option>
                                    <option value="Área de Camping">Área de Camping</option>
                                </select>
                            </div>
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

                    {/* ═══ BLOCO REDES SOCIAIS E CONTATO ═══ */}
                    <section>
                        <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-black">●</span>
                            Redes Sociais e Contato
                        </h3>
                        <SocialsInput
                            socials={formData.socials}
                            onChange={(socials) => setFormData({ ...formData, socials })}
                        />
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
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Imagem do Banner (Principal)</label>
                                {bannerFile && (
                                    <div className="w-full h-32 rounded-2xl overflow-hidden border border-[#ede0d8] dark:border-[#3a2e1a] mb-2 relative group">
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
                                            : 'border-[#ede0d8] dark:border-[#3a2e1a] bg-[#faf5f0] dark:bg-[#1a1208]/40 hover:border-(--color-primary)'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                        dragStates.banner ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-[#ede0d8] dark:bg-[#2e2310] text-[#8a7968] dark:text-[#c5b49e]'
                                    }`}>
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-[#8a7968] dark:text-[#c5b49e] text-sm font-medium text-center">
                                        {dragStates.banner ? '📸 Solte a imagem aqui!' : (bannerFile ? bannerFile.name : 'Clique ou arraste a imagem de capa')}
                                    </span>
                                    <input ref={bannerInputRef} type="file" required={!bannerFile} accept="image/*" className="hidden"
                                        onChange={(e) => { if (e.target.files?.[0]) setBannerFile(e.target.files[0]); }} />
                                </div>
                            </div>

                            {/* Acomodação - Drag & Drop */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Imagem das Acomodações (Quarto)</label>
                                {accommodationFile && (
                                    <div className="w-full h-32 rounded-2xl overflow-hidden border border-[#ede0d8] dark:border-[#3a2e1a] mb-2 relative group">
                                        <img src={URL.createObjectURL(accommodationFile)} alt="Preview acomodação" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setAccommodationFile(null)}
                                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                <div
                                    onDragOver={(e) => handleDragOver(e, 'accommodation')}
                                    onDragLeave={(e) => handleDragLeave(e, 'accommodation')}
                                    onDrop={(e) => handleDrop(e, 'accommodation')}
                                    onClick={() => accommodationInputRef.current?.click()}
                                    className={`w-full flex flex-col items-center gap-2 px-5 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                                        dragStates.accommodation
                                            ? 'border-(--color-primary) bg-(--color-primary)/10 scale-[1.02]'
                                            : 'border-[#ede0d8] dark:border-[#3a2e1a] bg-[#faf5f0] dark:bg-[#1a1208]/40 hover:border-(--color-primary)'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                        dragStates.accommodation ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-[#ede0d8] dark:bg-[#2e2310] text-[#8a7968] dark:text-[#c5b49e]'
                                    }`}>
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-[#8a7968] dark:text-[#c5b49e] text-sm font-medium text-center">
                                        {dragStates.accommodation ? '📸 Solte a imagem aqui!' : (accommodationFile ? accommodationFile.name : 'Clique ou arraste a foto do quarto')}
                                    </span>
                                    <input ref={accommodationInputRef} type="file" accept="image/*" className="hidden"
                                        onChange={(e) => { if (e.target.files?.[0]) setAccommodationFile(e.target.files[0]); }} />
                                </div>
                            </div>

                            {/* Galeria - Drag & Drop */}
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-[#241a06] dark:text-[#f0e6d6] ml-1">Imagens Extras (Galeria)</label>
                                <div
                                    onDragOver={(e) => handleDragOver(e, 'gallery')}
                                    onDragLeave={(e) => handleDragLeave(e, 'gallery')}
                                    onDrop={(e) => handleDrop(e, 'gallery')}
                                    onClick={() => galleryInputRef.current?.click()}
                                    className={`w-full flex flex-col items-center gap-2 px-5 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                                        dragStates.gallery
                                            ? 'border-(--color-primary) bg-(--color-primary)/10 scale-[1.02]'
                                            : 'border-[#ede0d8] dark:border-[#3a2e1a] bg-[#faf5f0] dark:bg-[#1a1208]/40 hover:border-(--color-primary)'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                        dragStates.gallery ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-[#ede0d8] dark:bg-[#2e2310] text-[#8a7968] dark:text-[#c5b49e]'
                                    }`}>
                                        <ImagePlus size={18} />
                                    </div>
                                    <span className="text-[#8a7968] dark:text-[#c5b49e] text-sm font-medium text-center">
                                        {dragStates.gallery
                                            ? '📸 Solte as imagens aqui!'
                                            : (galleryFiles.length > 0 ? `${galleryFiles.length} arquivo(s) — clique ou arraste para adicionar mais` : 'Clique ou arraste múltiplas imagens')}
                                    </span>
                                    <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden"
                                        onChange={(e) => { if (e.target.files) setGalleryFiles(prev => [...prev, ...Array.from(e.target.files!)]); }} />
                                </div>

                                {galleryFiles.length > 0 && (
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        {galleryFiles.map((file, idx) => (
                                            <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-[#ede0d8] dark:border-[#3a2e1a] group">
                                                <img src={URL.createObjectURL(file)} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => handleRemoveGalleryFile(idx)}
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <X size={18} className="text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ═══ BLOCO 3: Textos ═══ */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-black">3</span>
                                {getCategoryLabel(formData.category)}
                            </h3>
                            <textarea required rows={6} className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] placeholder:text-[#8a7968] dark:placeholder:text-[#c5b49e]/50 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs resize-none"
                                placeholder="Descrição que aparece no primeiro bloco..."
                                value={formData.about?.desc[0] || ""}
                                onChange={(e) => setFormData({ ...formData, about: { ...formData.about, desc: [e.target.value] } })} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm font-black">4</span>
                                Texto "Acomodações"
                            </h3>
                            <textarea required rows={6} className="w-full px-5 py-4 bg-[#faf5f0] dark:bg-[#1a1208] border border-[#ede0d8] dark:border-[#3a2e1a] text-[#241a06] dark:text-[#f0e6d6] placeholder:text-[#8a7968] dark:placeholder:text-[#c5b49e]/50 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs resize-none"
                                placeholder="Descrição dos quartos..."
                                value={formData.accommodation?.desc[0] || ""}
                                onChange={(e) => setFormData({ ...formData, accommodation: { ...formData.accommodation, desc: [e.target.value] } })} />
                        </div>
                    </section>

                    {/* ═══ BLOCO 4: Horários & Regras com Validação ═══ */}
                    <section>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                            <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-black">5</span>
                                Horários e Regras
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                                {SCHEDULE_PRESETS.map((preset) => {
                                    const alreadyAdded = formData.policies.some((p: any) => p.title === preset.title && p.type === 'horario');
                                    return (
                                        <button key={preset.title} type="button" disabled={alreadyAdded}
                                            onClick={() => handleAddSchedule(preset)}
                                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all border cursor-pointer ${alreadyAdded
                                                ? 'bg-[#ede0d8] dark:bg-[#2e2310] text-[#8a7968] dark:text-[#8a7968] border-[#ede0d8] dark:border-[#3a2e1a] cursor-not-allowed'
                                                : 'text-(--color-primary) bg-(--color-primary)/10 border-(--color-primary)/20 hover:bg-(--color-primary)/20'
                                            }`}>
                                            <Clock size={14} /> {preset.title}
                                        </button>
                                    );
                                })}
                                <button type="button" onClick={handleAddRule}
                                    className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all border border-amber-200 dark:border-amber-800 cursor-pointer">
                                    <ShieldAlert size={14} /> + Regra
                                </button>
                            </div>
                        </div>

                        {formData.policies.length === 0 && (
                            <div className="p-8 border-2 border-dashed border-[#ede0d8] dark:border-[#3a2e1a] rounded-3xl text-center text-[#8a7968] dark:text-[#c5b49e]">
                                Clique nos botões acima para adicionar horários ou regras.
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {formData.policies.map((pol: any, idx: number) => {
                                const isSchedule = pol.type === 'horario';
                                return (
                                    <div key={idx} className={`border p-6 rounded-2xl relative group transition-all hover:shadow-md ${isSchedule ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 hover:bg-white dark:hover:bg-[#2e2310]/50' : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 hover:bg-white dark:hover:bg-[#2e2310]/50'}`}>
                                        <div className="flex items-center justify-center mb-3">
                                            <span className={`text-[10px] font-black uppercase flex items-center justify-center gap-1 tracking-wider px-2 py-0.5 rounded-full ${isSchedule ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'}`}>
                                                {isSchedule ? <Clock size={32} /> : <ShieldAlert size={32} />}
                                            </span>
                                            <button type="button" onClick={() => handleRemovePolicy(idx)} className="text-[#8a7968] bg-red-200 dark:bg-red-950/60 dark:text-red-400 rounded-full p-2 hover:text-red-500 hover:bg-red-300 dark:hover:bg-red-900/60 transition-colors cursor-pointer absolute inset-e-6">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {isSchedule && (
                                                <input type="text" placeholder="Horário (ex: 14h)"
                                                    className={`${getInputClasses(`policy_${idx}_label`)} text-center font-black text-(--color-primary)`}
                                                    value={pol.label}
                                                    onChange={(e) => {
                                                        const np = [...formData.policies]; np[idx].label = e.target.value;
                                                        setFormData({ ...formData, policies: np });
                                                        if (e.target.value.trim()) setValidationErrors(prev => { const n = {...prev}; delete n[`policy_${idx}_label`]; return n; });
                                                    }} />
                                            )}
                                            <input type="text" placeholder={isSchedule ? 'Título (ex: Check-in)' : 'Título da Regra (ex: Pets)'}
                                                className={`${getInputClasses(`policy_${idx}_title`)} font-bold text-[#241a06] dark:text-[#f0e6d6]`}
                                                value={pol.title}
                                                onChange={(e) => {
                                                    const np = [...formData.policies]; np[idx].title = e.target.value;
                                                    setFormData({ ...formData, policies: np });
                                                    if (e.target.value.trim()) setValidationErrors(prev => { const n = {...prev}; delete n[`policy_${idx}_title`]; return n; });
                                                }} />
                                            <textarea placeholder={isSchedule ? 'Descrição (ex: A partir das 14h)' : 'Descrição (ex: Não permitidos)'}
                                                className={`${getInputClasses(`policy_${idx}_desc`)} text-sm text-[#8a7968] dark:text-[#c5b49e] resize-none`}
                                                value={pol.desc}
                                                onChange={(e) => {
                                                    const np = [...formData.policies]; np[idx].desc = e.target.value;
                                                    setFormData({ ...formData, policies: np });
                                                    if (e.target.value.trim()) setValidationErrors(prev => { const n = {...prev}; delete n[`policy_${idx}_desc`]; return n; });
                                                }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* ═══ BLOCO 5: Comodidades ═══ */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center text-sm font-black">6</span>
                                Comodidades (Cards)
                            </h3>
                            <button type="button" onClick={handleAddAmenity} className="flex items-center gap-2 text-sm font-bold text-(--color-primary) bg-(--color-primary)/10 px-4 py-2 rounded-xl hover:bg-(--color-primary)/20 transition-all border border-(--color-primary)/20 cursor-pointer">
                                <Plus size={18} /> Adicionar Comodidade
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formData.amenities.cards.map((card: any, idx: number) => (
                                <div key={idx} className="bg-[#faf5f0] dark:bg-[#1a1208]/60 border border-[#ede0d8] dark:border-[#3a2e1a] p-6 rounded-2xl flex gap-6 items-start relative group hover:bg-white dark:hover:bg-[#241a06] hover:shadow-md transition-all">
                                    <div className="flex-1 space-y-3">
                                        <input type="text" placeholder="Título (ex: Piscina)" className="w-full p-3 bg-white dark:bg-[#241a06] border border-[#ede0d8] dark:border-[#3a2e1a] rounded-xl font-bold text-[#241a06] dark:text-[#f0e6d6] outline-none focus:ring-2 focus:ring-(--color-primary)" value={card.title} onChange={(e) => { const nc = [...formData.amenities.cards]; nc[idx].title = e.target.value; setFormData({ ...formData, amenities: { ...formData.amenities, cards: nc } }) }} />
                                        <textarea placeholder="Breve descrição" className="w-full p-3 bg-white dark:bg-[#241a06] border border-[#ede0d8] dark:border-[#3a2e1a] rounded-xl text-sm text-[#8a7968] dark:text-[#c5b49e] resize-none outline-none focus:ring-2 focus:ring-(--color-primary)" value={card.desc} onChange={(e) => { const nc = [...formData.amenities.cards]; nc[idx].desc = e.target.value; setFormData({ ...formData, amenities: { ...formData.amenities, cards: nc } }) }} />
                                    </div>
                                    <button type="button" onClick={() => { const nc = [...formData.amenities.cards]; nc.splice(idx, 1); setFormData({ ...formData, amenities: { ...formData.amenities, cards: nc } }); }} className="text-[#8a7968] bg-red-200 dark:bg-red-950/60 dark:text-red-400 rounded-full p-2 hover:text-red-500 hover:bg-red-300 dark:hover:bg-red-900/60 transition-all cursor-pointer">
                                        <Trash2 size={22} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Submit */}
                    <div className="pb-10">
                        <button type="submit" disabled={loading} className="w-full bg-(--color-primary) hover:bg-opacity-90 text-white font-black py-5 px-12 rounded-2xl transition-all shadow-xl shadow-(--color-primary)/20 disabled:opacity-50 text-xl flex items-center justify-center gap-3 cursor-pointer">
                            {loading ? (
                                <>
                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Enviando Imagens e Salvando...
                                </>
                            ) : (
                                <>
                                    <Plus size={24} />
                                    Publicar {formData.category === "Área de Camping" ? "Camping" : formData.category}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
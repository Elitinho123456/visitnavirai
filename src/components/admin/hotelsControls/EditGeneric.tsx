import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, ArrowLeft, Save, Upload, Star, ImagePlus, X, Clock, ShieldAlert } from "lucide-react";
import MapPicker from "../../shared/MapPicker";

function getCategoryLabel(category: string): string {
    const map: Record<string, string> = {
        "Hotel": "Sobre o Hotel",
        "Pousada": "Sobre a Pousada",
        "Flat": "Sobre o Flat",
        "Área de Camping": "Sobre o Camping",
    };
    return map[category] || "Sobre o Estabelecimento";
}

const API_BASE = `http://localhost:${import.meta.env.VITE_API_PORT}`;

export default function EditHotel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

    // Imagens para trocar (opcional)
    const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
    const [newAccommodationFile, setNewAccommodationFile] = useState<File | null>(null);
    const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

    // Drag states
    const [dragStates, setDragStates] = useState<Record<string, boolean>>({ banner: false, accommodation: false, gallery: false });

    // Refs
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const accommodationInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<any>({
        name: "", image: "", category: "Hotel", highlight: false, distance: "", latitude: 0, longitude: 0,
        features: [""],
        about: { title: "Sobre o Estabelecimento", subtitle: "Conforto e Qualidade", desc: [""] },
        accommodation: { title: "Acomodações", image: "", imageCaption: "Vista do Quarto", desc: [""] },
        policies: [],
        amenities: { title: "Comodidades Principais", cards: [] },
        gallery: [],
        cta: { title: "Pronto para reservar?", desc: "Entre em contato conosco." }
    });

    useEffect(() => {
        const fetchHotelData = async () => {
            if (!id) return;
            try {
                const res = await fetch(`${API_BASE}/api/hotels/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData(data);
                } else {
                    navigate("/admin/hoteis");
                }
            } catch (error) {
                console.error("Error fetching hotel", error);
            } finally {
                setFetching(false);
            }
        };
        fetchHotelData();
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
        } else if (zone === 'accommodation') {
            setNewAccommodationFile(files[0]);
        } else if (zone === 'gallery') {
            setNewGalleryFiles(prev => [...prev, ...files]);
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
        const newErrors = { ...validationErrors };
        delete newErrors[`policy_${index}_label`];
        delete newErrors[`policy_${index}_title`];
        delete newErrors[`policy_${index}_desc`];
        setValidationErrors(newErrors);
    };
    const handleAddAmenity = () => {
        setFormData({ ...formData, amenities: { ...formData.amenities, cards: [...(formData.amenities?.cards || []), { title: "Wi-Fi", desc: "Internet de alta velocidade grátis" }] } });
    };
    const handleRemoveGalleryFile = (index: number) => {
        setNewGalleryFiles(prev => prev.filter((_, i) => i !== index));
    };
    const handleRemoveExistingGallery = (index: number) => {
        const ng = [...(formData.gallery || [])];
        ng.splice(index, 1);
        setFormData({ ...formData, gallery: ng });
    };

    // --- Upload helpers ---
    async function uploadSingleFile(file: File, category: string, name: string): Promise<string> {
        const fd = new FormData();
        fd.append("category", category);
        fd.append("name", name);
        fd.append("file", file);
        const res = await fetch(`${API_BASE}/api/teste/upload`, { method: "POST", body: fd });
        if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
        return (await res.json()).url;
    }
    async function uploadMultipleFiles(files: File[], category: string, name: string): Promise<string[]> {
        const fd = new FormData();
        fd.append("category", category);
        fd.append("name", name);
        files.forEach(f => fd.append("files", f));
        const res = await fetch(`${API_BASE}/api/teste/upload-multiple`, { method: "POST", body: fd });
        if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
        return (await res.json()).urls;
    }

    // --- Validation ---
    const validatePolicies = (): boolean => {
        const errors: Record<string, boolean> = {};
        let hasError = false;

        formData.policies.forEach((pol: any, idx: number) => {
            const isSchedule = pol.type === 'horario';
            if (isSchedule && (!pol.label || !pol.label.trim())) { errors[`policy_${idx}_label`] = true; hasError = true; }
            if (!pol.title || !pol.title.trim()) { errors[`policy_${idx}_title`] = true; hasError = true; }
            if (!pol.desc || !pol.desc.trim()) { errors[`policy_${idx}_desc`] = true; hasError = true; }
        });

        setValidationErrors(errors);
        return !hasError;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePolicies()) {
            alert("⚠️ Preencha todos os campos de Horários e Regras antes de salvar.\n\nOs campos com erro estão destacados em vermelho.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { category, name } = formData;
            let bannerUrl = formData.image;
            let accommodationUrl = formData.accommodation?.image || "";
            let galleryUrls = [...(formData.gallery || [])];

            const uploads: Promise<any>[] = [];
            if (newBannerFile) uploads.push(uploadSingleFile(newBannerFile, category, name).then(url => { bannerUrl = url; }));
            if (newAccommodationFile) uploads.push(uploadSingleFile(newAccommodationFile, category, name).then(url => { accommodationUrl = url; }));
            if (newGalleryFiles.length > 0) uploads.push(uploadMultipleFiles(newGalleryFiles, category, name).then(urls => { galleryUrls = [...galleryUrls, ...urls]; }));
            if (uploads.length > 0) await Promise.all(uploads);

            const payload = {
                ...formData,
                image: bannerUrl,
                about: { ...formData.about, title: getCategoryLabel(category) },
                accommodation: { ...formData.accommodation, image: accommodationUrl || bannerUrl },
                gallery: galleryUrls,
            };

            const response = await fetch(`${API_BASE}/api/hotels/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Atualizado com sucesso!");
                navigate("/admin/hoteis");
            } else {
                const err = await response.json();
                alert(`Erro: ${err.message}`);
            }
        } catch (error: any) {
            console.error(error);
            alert(`Erro: ${error.message}`);
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

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <button onClick={() => navigate("/admin/hoteis")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium cursor-pointer">
                <ArrowLeft size={20} /> Voltar para a lista
            </button>

            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-(--color-primary)/10 text-(--color-primary) rounded-2xl flex items-center justify-center">
                        <Save size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800">
                            Editar {formData.category === "Área de Camping" ? "Camping" : formData.category}
                        </h2>
                        <p className="text-slate-500">Atualizando "{formData.name}".</p>
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
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${formData.highlight ? 'bg-(--color-primary)' : 'bg-slate-300'}`}>
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${formData.highlight ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Nome</label>
                                <input type="text" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Tipo de Acomodação</label>
                                <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs appearance-none font-medium cursor-pointer"
                                    value={formData.category || "Hotel"} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="Hotel">Hotel</option>
                                    <option value="Pousada">Pousada</option>
                                    <option value="Flat">Flat</option>
                                    <option value="Área de Camping">Área de Camping</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* ═══ BLOCO Localização ═══ */}
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
                            {/* Banner */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Banner Principal</label>
                                {formData.image && !newBannerFile && (
                                    <div className="w-full h-32 rounded-2xl overflow-hidden border border-slate-200 mb-2">
                                        <img src={formData.image} alt="Banner atual" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                {newBannerFile && (
                                    <div className="w-full h-32 rounded-2xl overflow-hidden border border-green-300 mb-2 relative group">
                                        <img src={URL.createObjectURL(newBannerFile)} alt="Novo banner" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setNewBannerFile(null)}
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
                                        dragStates.banner ? 'border-(--color-primary) bg-(--color-primary)/10 scale-[1.02]' : 'border-slate-300 bg-slate-50 hover:border-(--color-primary)'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${dragStates.banner ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-slate-200 text-slate-500'}`}>
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-slate-500 text-sm font-medium text-center">
                                        {dragStates.banner ? '📸 Solte aqui!' : (newBannerFile ? newBannerFile.name : "Clique ou arraste para trocar banner")}
                                    </span>
                                    <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setNewBannerFile(e.target.files[0]); }} />
                                </div>
                            </div>

                            {/* Acomodação */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Imagem Acomodações</label>
                                {formData.accommodation?.image && !newAccommodationFile && (
                                    <div className="w-full h-32 rounded-2xl overflow-hidden border border-slate-200 mb-2">
                                        <img src={formData.accommodation.image} alt="Acomodação atual" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                {newAccommodationFile && (
                                    <div className="w-full h-32 rounded-2xl overflow-hidden border border-green-300 mb-2 relative group">
                                        <img src={URL.createObjectURL(newAccommodationFile)} alt="Nova acomodação" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setNewAccommodationFile(null)}
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
                                        dragStates.accommodation ? 'border-(--color-primary) bg-(--color-primary)/10 scale-[1.02]' : 'border-slate-300 bg-slate-50 hover:border-(--color-primary)'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${dragStates.accommodation ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-slate-200 text-slate-500'}`}>
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-slate-500 text-sm font-medium text-center">
                                        {dragStates.accommodation ? '📸 Solte aqui!' : (newAccommodationFile ? newAccommodationFile.name : "Clique ou arraste para trocar foto do quarto")}
                                    </span>
                                    <input ref={accommodationInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setNewAccommodationFile(e.target.files[0]); }} />
                                </div>
                            </div>

                            {/* Galeria */}
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">Galeria de Imagens</label>

                                {formData.gallery && formData.gallery.length > 0 && (
                                    <div className="flex flex-wrap gap-3 mb-3">
                                        {formData.gallery.map((url: string, idx: number) => (
                                            <div key={`existing-${idx}`} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200 group">
                                                <img src={url} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => handleRemoveExistingGallery(idx)}
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <X size={18} className="text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {newGalleryFiles.length > 0 && (
                                    <div className="flex flex-wrap gap-3 mb-3">
                                        {newGalleryFiles.map((file, idx) => (
                                            <div key={`new-${idx}`} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-green-300 group">
                                                <img src={URL.createObjectURL(file)} alt={`new-${idx}`} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => handleRemoveGalleryFile(idx)}
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <X size={18} className="text-white" />
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
                                    className={`w-full flex flex-col items-center gap-2 px-5 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                                        dragStates.gallery ? 'border-(--color-primary) bg-(--color-primary)/10 scale-[1.02]' : 'border-slate-300 bg-slate-50 hover:border-(--color-primary)'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${dragStates.gallery ? 'bg-(--color-primary)/20 text-(--color-primary)' : 'bg-slate-200 text-slate-500'}`}>
                                        <ImagePlus size={18} />
                                    </div>
                                    <span className="text-slate-500 text-sm font-medium text-center">
                                        {dragStates.gallery ? '📸 Solte as imagens aqui!' : "Clique ou arraste para adicionar mais imagens"}
                                    </span>
                                    <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) setNewGalleryFiles(prev => [...prev, ...Array.from(e.target.files!)]); }} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ═══ BLOCO 3: Textos ═══ */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black">3</span>
                                {getCategoryLabel(formData.category || "Hotel")}
                            </h3>
                            <textarea required rows={6} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs resize-none"
                                placeholder="Descrição que aparece no primeiro bloco..."
                                value={formData.about?.desc?.[0] || ""}
                                onChange={(e) => setFormData({ ...formData, about: { ...formData.about, desc: [e.target.value] } })} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-black">4</span>
                                Texto "Acomodações"
                            </h3>
                            <textarea required rows={6} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-(--color-primary) outline-none transition-all shadow-xs resize-none"
                                placeholder="Descrição dos quartos..."
                                value={formData.accommodation?.desc?.[0] || ""}
                                onChange={(e) => setFormData({ ...formData, accommodation: { ...formData.accommodation, desc: [e.target.value] } })} />
                        </div>
                    </section>

                    {/* ═══ BLOCO 4: Horários & Regras com Validação ═══ */}
                    <section>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-black">5</span>
                                Horários e Regras
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                                {SCHEDULE_PRESETS.map((preset) => {
                                    const alreadyAdded = formData.policies?.some((p: any) => p.title === preset.title && p.type === 'horario');
                                    return (
                                        <button key={preset.title} type="button" disabled={alreadyAdded}
                                            onClick={() => handleAddSchedule(preset)}
                                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all border cursor-pointer ${alreadyAdded
                                                    ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                                                    : 'text-(--color-primary) bg-(--color-primary)/10 border-(--color-primary)/20 hover:bg-(--color-primary)/20'
                                                }`}>
                                            <Clock size={14} /> {preset.title}
                                        </button>
                                    );
                                })}
                                <button type="button" onClick={handleAddRule}
                                    className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl hover:bg-amber-100 transition-all border border-amber-200 cursor-pointer">
                                    <ShieldAlert size={14} /> + Regra
                                </button>
                            </div>
                        </div>

                        {(!formData.policies || formData.policies.length === 0) && (
                            <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center text-slate-400">
                                Clique nos botões acima para adicionar horários ou regras.
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {formData.policies?.map((pol: any, idx: number) => {
                                const isSchedule = pol.type === 'horario' || (!pol.type && pol.label);
                                return (
                                    <div key={idx} className={`border p-6 rounded-2xl relative group transition-all hover:shadow-md ${isSchedule ? 'bg-blue-50/50 border-blue-200 hover:bg-white' : 'bg-amber-50/50 border-amber-200 hover:bg-white'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isSchedule ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {isSchedule ? '⏰ Horário' : '📋 Regra'}
                                            </span>
                                            <button type="button" onClick={() => handleRemovePolicy(idx)} className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer">
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
                                                className={`${getInputClasses(`policy_${idx}_title`)} font-bold text-slate-800`}
                                                value={pol.title}
                                                onChange={(e) => {
                                                    const np = [...formData.policies]; np[idx].title = e.target.value;
                                                    setFormData({ ...formData, policies: np });
                                                    if (e.target.value.trim()) setValidationErrors(prev => { const n = {...prev}; delete n[`policy_${idx}_title`]; return n; });
                                                }} />
                                            <textarea placeholder={isSchedule ? 'Descrição (ex: A partir das 14h)' : 'Descrição (ex: Não permitidos)'}
                                                className={`${getInputClasses(`policy_${idx}_desc`)} text-sm text-slate-500 resize-none`}
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
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-sm font-black">6</span>
                                Comodidades (Cards)
                            </h3>
                            <button type="button" onClick={handleAddAmenity} className="flex items-center gap-2 text-sm font-bold text-(--color-primary) bg-(--color-primary)/10 px-4 py-2 rounded-xl hover:bg-(--color-primary)/20 transition-all border border-(--color-primary)/20 cursor-pointer">
                                <Plus size={18} /> Adicionar Comodidade
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formData.amenities?.cards?.map((card: any, idx: number) => (
                                <div key={idx} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex gap-6 items-start relative group hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex-1 space-y-3">
                                        <input type="text" placeholder="Título (ex: Piscina)" className="w-full p-3 bg-white border border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-(--color-primary)" value={card.title} onChange={(e) => { const nc = [...formData.amenities.cards]; nc[idx].title = e.target.value; setFormData({ ...formData, amenities: { ...formData.amenities, cards: nc } }) }} />
                                        <textarea placeholder="Breve descrição" className="w-full p-3 bg-white border border-slate-100 rounded-xl text-sm text-slate-500 resize-none outline-none focus:ring-2 focus:ring-(--color-primary)" value={card.desc} onChange={(e) => { const nc = [...formData.amenities.cards]; nc[idx].desc = e.target.value; setFormData({ ...formData, amenities: { ...formData.amenities, cards: nc } }) }} />
                                    </div>
                                    <button type="button" onClick={() => { const nc = [...formData.amenities.cards]; nc.splice(idx, 1); setFormData({ ...formData, amenities: { ...formData.amenities, cards: nc } }); }} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
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
                                    Salvando Alterações...
                                </>
                            ) : (
                                <>
                                    <Save size={24} />
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
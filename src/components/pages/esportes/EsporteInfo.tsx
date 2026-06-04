import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Venue } from "../../../types/interfacesTypes";
import { ChevronLeft, ChevronRight, AlertCircle, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL, apiFetch } from "@/config/api";

export default function SportInfo() {
    const { id: venueId } = useParams();
    const navigate = useNavigate();
    const [venueData, setVenueData] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);

    // Gallery state
    const [galleryIndex, setGalleryIndex] = useState(0);

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        if (!venueId) {
            navigate("/esportes");
            return;
        }

        const fetchVenueData = async () => {
            try {
                // Ajuste a rota da API conforme o seu backend para esportes/arenas
                const res = await apiFetch(`${API_BASE_URL}/api/venues/${venueId}`);
                if (res.ok) {
                    const data = await res.json();
                    setVenueData(data);
                } else {
                    console.error("Failed to load venue data");
                }
            } catch (error) {
                console.error("Error fetching venue", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVenueData();
    }, [venueId, navigate]);

    // All gallery images (assumindo que Venue também pode ter uma propriedade gallery opcional)
    const allGalleryImages: string[] = [];
    if (venueData?.gallery && venueData.gallery.length > 0) allGalleryImages.push(...venueData.gallery);

    // Lightbox keyboard nav
    const handleLightboxKey = useCallback((e: KeyboardEvent) => {
        if (!lightboxOpen) return;
        if (e.key === "Escape") setLightboxOpen(false);
        if (e.key === "ArrowRight") setLightboxIndex(prev => (prev + 1) % allGalleryImages.length);
        if (e.key === "ArrowLeft") setLightboxIndex(prev => prev === 0 ? allGalleryImages.length - 1 : prev - 1);
    }, [lightboxOpen, allGalleryImages.length]);

    useEffect(() => {
        window.addEventListener("keydown", handleLightboxKey);
        return () => window.removeEventListener("keydown", handleLightboxKey);
    }, [handleLightboxKey]);

    // Prevent scroll when lightbox is open
    useEffect(() => {
        if (lightboxOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [lightboxOpen]);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-(--color-background) items-center justify-center">
                <div className="w-16 h-16 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!venueData) {
        return (
            <div className="flex flex-col min-h-screen bg-(--color-background) items-center justify-center">
                <h2 className="text-2xl font-bold text-(--color-secondary)">Local esportivo não encontrado</h2>
                <button onClick={() => navigate("/esportes")} className="mt-4 px-6 py-2 bg-(--color-primary) text-white rounded-lg cursor-pointer">Voltar</button>
            </div>
        );
    }

    const { about, courts, rules, infrastructure, cta } = venueData;

    return (
        <div className="flex flex-col min-h-screen bg-(--color-background)">

            <main className="grow">
                {/* --- Hero Section (Banner) --- */}
                <section className="relative h-[60vh] min-h-100 md:h-125 lg:h-150 w-full">
                    <img
                        src={venueData.image || "https://placehold.co/1800x720"}
                        alt={venueData.name}
                        className="w-full h-full object-cover object-center"
                    />

                    <button
                        onClick={() => navigate("/esportes")}
                        className="absolute top-24 left-4 md:left-8 z-20 flex items-center gap-2 bg-black/40 hover:bg-black/70 text-white px-4 py-2 rounded-xl backdrop-blur-md transition-all cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Voltar para Esportes
                    </button>

                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4 sm:px-6">
                        <span className="bg-(--color-primary) text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 tracking-wider uppercase">
                            {venueData.category}
                        </span>
                        <h1 className="text-(--color-neutral-white) text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-3 md:mb-4 drop-shadow-lg">
                            {venueData.name}
                        </h1>
                        <p className="text-(--color-neutral-light) text-base sm:text-lg md:text-xl max-w-xl md:max-w-2xl font-light leading-relaxed">
                            {venueData.distance}
                        </p>
                    </div>
                </section>

                {/* --- Conteúdo Principal --- */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-(--spacing-xl)">

                    {/* Bloco 1: Introdução */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-24 items-start">
                        <div className="md:col-span-4 h-full flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-(--color-secondary) pb-6 mb-2 md:mb-0 md:pr-8">
                            <h2 className="text-(--color-primary) text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                                {about?.title || "Sobre o Local"}
                            </h2>
                            <div className="w-20 md:w-30 h-1 bg-(--color-accent-gold) mt-4 mb-4 md:mb-6"></div>
                        </div>
                        <div className="md:col-span-8 space-y-4 md:space-y-6 text-(--color-text-body) text-base sm:text-lg leading-relaxed text-justify wrap-break-word whitespace-pre-wrap">
                            {about?.desc ? about.desc.map((p: string, i: number) => <p key={i} className="text-justify">{p}</p>) : <p>Informações detalhadas sobre este local serão adicionadas em breve.</p>}
                        </div>
                    </div>

                    {/* Bloco 2: Quadras / Estrutura Esportiva */}
                    {courts && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mb-16 md:mb-24 items-center">
                            <div className="order-2 md:order-1 relative group rounded-2xl overflow-hidden shadow-xl h-64 sm:h-80 md:h-auto bg-gray-100 flex items-center justify-center">
                                {/* Usando a imagem principal como fallback, ou uma genérica de esporte */}
                                <img
                                    src={venueData.image || "https://placehold.co/600x400?text=Estrutura"}
                                    alt={courts.title || "Quadras"}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="order-1 md:order-2">
                                <h3 className="text-(--color-text-header) text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                                    {courts.title}
                                </h3>
                                <p className="text-(--color-secondary) font-medium text-sm md:text-base uppercase tracking-wider mb-4 md:mb-6">
                                    {courts.type}
                                </p>
                                <div className="space-y-4 text-(--color-text-body) text-base sm:text-lg leading-relaxed text-justify wrap-break-word whitespace-pre-wrap">
                                    {courts.desc?.map((p: string, i: number) => <p key={i}>{p}</p>)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bloco 3: Galeria de Imagens com Lightbox */}
                    {allGalleryImages.length > 0 && (
                        <div className="mb-16 md:mb-24">
                            <h3 className="text-(--color-text-header) text-2xl sm:text-3xl font-bold mb-6 md:mb-8 border-l-4 border-(--color-secondary) pl-4">
                                Galeria de Fotos
                            </h3>

                            <div
                                className="relative rounded-2xl overflow-hidden shadow-xl h-64 sm:h-80 md:h-112.5 mb-4 group cursor-pointer"
                                onClick={() => openLightbox(galleryIndex)}
                            >
                                <img
                                    src={allGalleryImages[galleryIndex]}
                                    alt={`Foto ${galleryIndex + 1}`}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-4">
                                        <ZoomIn size={32} className="text-white drop-shadow-lg" />
                                    </div>
                                </div>

                                {allGalleryImages.length > 1 && (
                                    <>
                                        <button onClick={(e) => { e.stopPropagation(); setGalleryIndex(prev => prev === 0 ? allGalleryImages.length - 1 : prev - 1); }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer">
                                            <ChevronLeft size={22} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); setGalleryIndex(prev => prev === allGalleryImages.length - 1 ? 0 : prev + 1); }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer">
                                            <ChevronRight size={22} />
                                        </button>
                                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                            {galleryIndex + 1} / {allGalleryImages.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {allGalleryImages.map((url, idx) => (
                                    <button key={idx} onClick={() => setGalleryIndex(idx)}
                                        className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${idx === galleryIndex ? 'border-(--color-primary) ring-2 ring-(--color-primary)/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                                            }`}>
                                        <img src={url} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bloco 4: Regras do Local */}
                    {rules && rules.length > 0 && (
                        <div className="bg-(--color-neutral-white) rounded-(--border-radius-lg) p-6 sm:p-8 md:p-12 shadow-lg border-t-4 border-amber-500 mb-16 md:mb-24">
                            <h3 className="text-center text-amber-700 text-2xl sm:text-3xl font-bold mb-8 md:mb-10 flex items-center justify-center gap-2">
                                <AlertCircle size={32} /> Regras e Recomendações
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {rules.map((item: any, index: number) => (
                                    <div key={index} className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm mb-3 shadow-md">
                                            {item.label}
                                        </div>
                                        <h4 className="text-amber-800 font-bold text-lg mb-2">{item.title}</h4>
                                        <p className="text-sm text-amber-700/90 leading-relaxed wrap-break-word whitespace-pre-wrap">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bloco 5: Infraestrutura */}
                    {infrastructure && infrastructure.cards && infrastructure.cards.length > 0 && (
                        <div className="mb-16 md:mb-24">
                            <h3 className="text-(--color-text-header) text-2xl sm:text-3xl font-bold mb-6 md:mb-8 border-l-4 border-(--color-secondary) pl-4">
                                {infrastructure.title || "Infraestrutura"}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                                {infrastructure.cards.map((card: any, idx: number) => (
                                    <div key={idx} className="bg-(--color-neutral-white) p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-(--color-neutral-light)">
                                        <div className="text-(--color-primary) mb-4">
                                            {/* Ícone Genérico - você pode mapear os ícones que vêm da API aqui se desejar */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-bold text-lg mb-2">{card.title}</h4>
                                        <p className="text-sm text-(--color-text-body) leading-relaxed wrap-break-word whitespace-pre-wrap">
                                            {card.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bloco CTA */}
                    {cta && (
                        <div className="bg-(--color-primary) text-white p-6 sm:p-10 md:p-14 rounded-(--border-radius-lg) text-center shadow-xl">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">{cta.title}</h3>
                            <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed opacity-90 wrap-break-word whitespace-pre-wrap mb-8">
                                {cta.desc}
                            </p>
                            {/* Exemplo de botão de contato se quiser adicionar futuramente */}
                            {venueData.socials?.whatsapp && (
                                <a 
                                    href={`https://wa.me/${venueData.socials.whatsapp}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-block bg-white text-(--color-primary) font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    Agendar Horário
                                </a>
                            )}
                        </div>
                    )}

                </div>
            </main>

            {/* ===== LIGHTBOX MODAL (IGUAL AO DO HOTEL) ===== */}
            <AnimatePresence>
                {lightboxOpen && allGalleryImages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-9999 bg-black/95 flex items-center justify-center"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
                        >
                            <X size={24} />
                        </button>

                        <div className="absolute top-6 left-6 z-50 bg-white/10 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full">
                            {lightboxIndex + 1} / {allGalleryImages.length}
                        </div>

                        <motion.div
                            key={lightboxIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={allGalleryImages[lightboxIndex]}
                                alt={`Foto ${lightboxIndex + 1}`}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
                                draggable={false}
                            />
                        </motion.div>

                        {allGalleryImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => prev === 0 ? allGalleryImages.length - 1 : prev - 1); }}
                                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
                                >
                                    <ChevronLeft size={28} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => prev === allGalleryImages.length - 1 ? 0 : prev + 1); }}
                                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
                                >
                                    <ChevronRight size={28} />
                                </button>
                            </>
                        )}

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2 px-4">
                            {allGalleryImages.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${idx === lightboxIndex ? 'border-white ring-2 ring-white/40 opacity-100' : 'border-white/20 opacity-50 hover:opacity-80'}`}
                                >
                                    <img src={url} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
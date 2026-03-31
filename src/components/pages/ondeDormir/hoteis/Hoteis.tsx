import { useEffect, useState, useMemo } from 'react';
import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, ChevronRight, X, Building2, Home, Tent, Building } from 'lucide-react';
import { translateFeature, hotelsData } from '../../../../config/const';
import { API_BASE_URL } from '../../../../config/api';
import type { Hotel } from '../../../../types/interfacesTypes';
import Header from '../../../layout/Header';
import Footer from '../../../layout/Footer';

const API_BASE = API_BASE_URL;

// Configuração por tipo de acomodação
const categoryConfig: Record<string, { title: string; subtitle: string; icon: React.ReactNode; heroImage: string }> = {
    'Hotel': {
        title: 'Hotéis em Naviraí',
        subtitle: 'Conforto e praticidade para sua estadia na Capital do Conesul.',
        icon: <Building2 size={20} />,
        heroImage: '/navirai_noite.png',
    },
    'Pousada': {
        title: 'Pousadas em Naviraí',
        subtitle: 'Charme e aconchego para quem busca uma experiência única.',
        icon: <Home size={20} />,
        heroImage: '/parque_cumandai.png',
    },
    'Flat': {
        title: 'Flats em Naviraí',
        subtitle: 'Independência e praticidade com todo o conforto de um lar.',
        icon: <Building size={20} />,
        heroImage: '/praca_central.png',
    },
    'Área de Camping': {
        title: 'Áreas de Camping em Naviraí',
        subtitle: 'Conecte-se com a natureza e viva uma aventura inesquecível.',
        icon: <Tent size={20} />,
        heroImage: '/rio_amambai.png',
    },
};

const allCategories = ['Hotel', 'Pousada', 'Flat', 'Área de Camping'];

function HotelCard({ hotel, onQuickView }: { hotel: Hotel; onQuickView: (h: Hotel) => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onClick={() => onQuickView(hotel)}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
        >
            {/* Imagem */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={hotel.image || 'https://placehold.co/400x300/e2e8f0/94a3b8?text=Sem+Foto'}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                {hotel.highlight && (
                    <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Star size={12} className="fill-amber-900" /> Destaque
                    </div>
                )}

                {(hotel as any).category && (
                    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {(hotel as any).category}
                    </div>
                )}

                <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg drop-shadow-lg truncate">{hotel.name}</h3>
                    <p className="text-white/80 text-xs flex items-center gap-1 mt-1">
                        <MapPin size={12} /> {hotel.distance}
                    </p>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="p-5">
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {hotel.features?.slice(0, 3).map((feature, i) => (
                        <span key={i} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                            {translateFeature(feature)}
                        </span>
                    ))}
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50">
                    <Link
                        to={`/acomodacoes/${hotel._id || hotel.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-(--color-primary) hover:bg-(--color-primary-dark) text-white text-sm font-bold py-2.5 rounded-xl text-center transition-all flex items-center justify-center gap-1.5"
                    >
                        Ver Detalhes <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

function QuickViewModal({ hotel, onClose }: { hotel: Hotel; onClose: () => void }) {
    const allImages = [hotel.image, ...(hotel.gallery || [])].filter(Boolean) as string[];
    const [activeImage, setActiveImage] = useState<string>(allImages[0] || 'https://placehold.co/400x300');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Imagem Principal */}
                <div className="relative h-56 bg-slate-100">
                    <img
                        src={activeImage}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-2xl font-bold drop-shadow-lg leading-tight">{hotel.name}</h3>
                        <p className="text-white/90 text-sm flex items-center gap-1 mt-1 font-medium">
                            <MapPin size={14} /> {hotel.distance}
                        </p>
                    </div>
                </div>

                {/* Thumbnails da Galeria */}
                {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto p-4 bg-slate-50 border-b border-slate-100 custom-scrollbar">
                        {allImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${
                                    activeImage === img ? 'border-(--color-primary) scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                            >
                                <img src={img} alt={`${hotel.name} ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Info */}
                <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.features?.slice(0, 4).map((f, i) => (
                            <span key={i} className="text-[11px] font-bold bg-(--color-primary)/10 text-(--color-primary) px-3 py-1.5 rounded-full uppercase tracking-wide">
                                {translateFeature(f)}
                            </span>
                        ))}
                    </div>

                    {hotel.about?.desc?.[0] && (
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">{hotel.about.desc[0]}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Link
                            to={`/acomodacoes/${hotel._id || hotel.id}`}
                            onClick={onClose}
                            className="flex-1 bg-(--color-primary) hover:bg-(--color-primary-dark) text-white font-bold py-3.5 rounded-xl text-center transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            Ver Página Completa <ChevronRight size={18} />
                        </Link>
                        <button
                            onClick={onClose}
                            className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all cursor-pointer"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function Acomodacoes() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const isDetailPage = /\/acomodacoes\/.+/.test(location.pathname);

    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [quickViewHotel, setQuickViewHotel] = useState<Hotel | null>(null);

    // Tipo de acomodação vindo da URL
    const activeCategory = searchParams.get('tipo') || '';

    const setCategory = (cat: string) => {
        if (cat === activeCategory) {
            searchParams.delete('tipo');
        } else {
            searchParams.set('tipo', cat);
        }
        setSearchParams(searchParams);
    };

    // Fetch hotels
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/hotels`);
                if (res.ok) {
                    const data = await res.json();
                    setHotels(data);
                } else {
                    setHotels(hotelsData);
                }
            } catch {
                setHotels(hotelsData);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    // Filtrar hotéis
    const filteredHotels = useMemo(() => {
        return hotels.filter(h => {
            const matchesCategory = !activeCategory || (h as any).category === activeCategory;
            const matchesSearch = !searchQuery || h.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [hotels, activeCategory, searchQuery]);

    // Split e Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 50;

    const { highlightedHotels, regularHotels } = useMemo(() => {
        const highlighted: Hotel[] = [];
        const regular: Hotel[] = [];
        filteredHotels.forEach(h => {
            if (h.highlight) highlighted.push(h);
            else regular.push(h);
        });
        return { highlightedHotels: highlighted, regularHotels: regular };
    }, [filteredHotels]);

    const totalPages = Math.ceil(regularHotels.length / ITEMS_PER_PAGE);
    const paginatedRegularHotels = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return regularHotels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [regularHotels, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeCategory]);

    // Config dinâmica com base no tipo
    const currentConfig = activeCategory && categoryConfig[activeCategory]
        ? categoryConfig[activeCategory]
        : {
            title: 'Onde Dormir em Naviraí',
            subtitle: 'Encontre a acomodação ideal para sua estadia na Capital do Conesul.',
            icon: <Building2 size={20} />,
            heroImage: '/navirai_noite.png',
        };

    // Se está na página de detalhe, renderizar só o Outlet
    if (isDetailPage) {
        return (
            <div className="flex flex-col min-h-screen bg-(--color-background)">
                <Header />
                <Outlet />
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
            <Header />

            <main className="grow">
                {/* --- Hero Section Premium --- */}
                <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
                    <img
                        src={currentConfig.heroImage}
                        alt={currentConfig.title}
                        className="w-full h-full object-cover transform scale-105 animate-subtle-zoom"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/80" />

                    <div className="absolute inset-0 flex flex-col justify-end items-center text-center px-4 pb-20 md:pb-28">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-(--color-accent-gold) font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4"
                        >
                            Acomodações
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 drop-shadow-lg"
                        >
                            {currentConfig.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/80 text-lg md:text-xl max-w-2xl font-light"
                        >
                            {currentConfig.subtitle}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="w-24 h-1 bg-(--color-accent-gold) rounded-full mt-6"
                        />
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

                    {/* --- Barra de Filtros + Search --- */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                        {/* Tabs de categoria */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => { searchParams.delete('tipo'); setSearchParams(searchParams); }}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${!activeCategory
                                    ? 'bg-(--color-primary) text-white shadow-lg shadow-(--color-primary)/25'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                Todos
                            </button>
                            {allCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeCategory === cat
                                        ? 'bg-(--color-primary) text-white shadow-lg shadow-(--color-primary)/25'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                >
                                    {categoryConfig[cat]?.icon}
                                    {cat === 'Área de Camping' ? 'Camping' : cat === 'Hotel' ? 'Hotéis' : cat === 'Pousada' ? 'Pousadas' : cat + 's'}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-80">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar acomodação..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-(--color-primary)/30 focus:border-(--color-primary) outline-none transition-all shadow-sm text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Contagem de resultados */}
                    <p className="text-slate-500 text-sm mb-6">
                        {loading ? 'Carregando...' : `${filteredHotels.length} acomodação(ões) encontrada(s)`}
                    </p>

                    {/* --- Grid de Cards --- */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredHotels.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Building2 size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhuma acomodação encontrada</h3>
                            <p className="text-slate-500">Tente ajustar os filtros ou a busca.</p>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {/* Destaques */}
                            {highlightedHotels.length > 0 && (
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
                                        <Star className="text-yellow-500 fill-yellow-500" size={28} />
                                        Destaques
                                    </h2>
                                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <AnimatePresence>
                                            {highlightedHotels.map(hotel => (
                                                <HotelCard key={hotel._id || hotel.id} hotel={hotel} onQuickView={setQuickViewHotel} />
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                </div>
                            )}

                            {/* Alojamentos */}
                            {regularHotels.length > 0 && (
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 mb-6 border-b border-slate-200 pb-3">
                                        Alojamentos
                                    </h2>
                                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <AnimatePresence>
                                            {paginatedRegularHotels.map(hotel => (
                                                <HotelCard key={hotel._id || hotel.id} hotel={hotel} onQuickView={setQuickViewHotel} />
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Paginação */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-4 mt-12 bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 w-fit mx-auto">
                                            <button 
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 rounded-xl text-sm text-slate-500 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
                                            >
                                                &lt; Anterior
                                            </button>
                                            
                                            <div className="flex gap-1">
                                                {Array.from({ length: totalPages }).map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                                                            currentPage === i + 1 
                                                            ? 'bg-(--color-primary) text-white shadow-md' 
                                                            : 'text-slate-500 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                            </div>

                                            <button 
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="px-4 py-2 rounded-xl text-sm text-slate-500 font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
                                            >
                                                Próximo &gt;
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* --- QuickView Modal --- */}
            <AnimatePresence>
                {quickViewHotel && (
                    <QuickViewModal
                        hotel={quickViewHotel}
                        onClose={() => setQuickViewHotel(null)}
                    />
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
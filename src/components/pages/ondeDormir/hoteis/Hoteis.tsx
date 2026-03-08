import { useState, useMemo, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Header from "../../../layout/Header";
import Footer from "../../../layout/Footer";
import { hotelsData as fallbackHotelsData } from '../../../../config/const.ts';
import { type Hotel } from '../../../../types/interfacesTypes.ts';

// Componente de Card Reutilizável
const HotelCard = ({ hotel, onSelect, onQuickView, t }: { hotel: Hotel; onSelect: (h: Hotel) => void, onQuickView: (h: Hotel) => void, t: any }) => (
    <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group border border-gray-100 flex flex-col h-full cursor-pointer"
        onClick={() => onQuickView(hotel)}
    >
        <div className="relative h-56 overflow-hidden">
            <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60"></div>

            {hotel.highlight && (
                <span className="absolute top-4 right-4 bg-(--color-accent-gold) text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {t('hotels.badges.highlight')}
                </span>
            )}

            <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold leading-tight">{hotel.name}</h3>
                <div className="flex items-center text-xs mt-1 opacity-90">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    {hotel.distance}
                </div>
            </div>
        </div>

        <div className="p-5 flex flex-col grow">
            <div className="flex flex-wrap gap-2 mb-4">
                {hotel.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="text-[10px] uppercase font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {t(feature)}
                    </span>
                ))}
                {hotel.features.length > 3 && (
                    <span className="text-[10px] text-gray-400 px-2 py-1">+ {hotel.features.length - 3}</span>
                )}
            </div>

            <div className="mt-auto flex gap-3">
                <button
                    onClick={(e) => { e.stopPropagation(); onSelect(hotel); }}
                    className="flex-1 py-2 text-sm text-(--color-primary) font-bold border border-(--color-primary) rounded-lg hover:bg-(--color-primary) hover:text-white transition-colors"
                >
                    {t('hotels.map.view_on_map')}
                </button>
                <Link
                    to={`/hoteis/${hotel.id || hotel._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2 text-sm flex items-center justify-center bg-(--color-secondary) text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Detalhes
                </Link>
            </div>
        </div>
    </motion.div>
);

export default function Hoteis() {
    const { t } = useTranslation();
    const location = useLocation();

    // Check if we are currently viewing the child Outlet (HotelInfo) by comparing paths
    const isShowingDetails = location.pathname !== '/hoteis' && location.pathname !== '/hoteis/';

    const [searchTerm, setSearchTerm] = useState('');
    const [hotelsData, setHotelsData] = useState<Hotel[]>(fallbackHotelsData);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(hotelsData[0]);
    const [quickViewHotel, setQuickViewHotel] = useState<Hotel | null>(null);

    // Fetch hotels from DB
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await fetch(`http://localhost:${import.meta.env.VITE_API_PORT}/api/hotels`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setHotelsData(data);
                        // Update selected map hotel if one wasn't manually selected yet
                        if (!selectedHotel || selectedHotel.id === fallbackHotelsData[0].id) {
                            setSelectedHotel(data[0]);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch hotels from DB, using fallback data.");
            }
        };
        fetchHotels();
    }, []);

    const filteredHotels = useMemo(() => {
        if (!searchTerm) return hotelsData;
        return hotelsData.filter(hotel =>
            hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, hotelsData]);

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
            <Header />

            {/* If Outlet is active, show only Outlet. Otherwise show the main list */}
            {isShowingDetails ? (
                <Outlet />
            ) : (
                <main className="grow">
                    {/* --- Hero Minimalista --- */}
                    <section className="relative h-[300px] md:h-[900px] w-full flex items-center justify-center">
                        <img
                            src="/praca_central.png"
                            alt={t('hotels.hero.alt')}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" /> {/* Overlay azulado estilo Bonito */}
                        <div className="relative z-10 text-center px-4">
                            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
                                {t('hotels.hero.title')}
                            </h1>
                            <p className="text-gray-100 text-lg max-w-2xl mx-auto font-light">
                                {t('hotels.hero.subtitle')}
                            </p>

                            {/* Search Bar Floating */}
                            <div className="mt-8 max-w-xl mx-auto relative">
                                <input
                                    type="text"
                                    placeholder={t('hotels.search.placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full  bg-gray-100/80 px-6 py-4 rounded-full shadow-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-(--color-primary)/30"
                                />
                                <div className="absolute right-2 top-2 bg-(--color-primary) p-2 rounded-full text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="max-w-8xl mx-auto px-4 py-12">
                        <div className="flex flex-col-reverse lg:flex-row gap-8">

                            {/* --- Lista de Hotéis (Grid) --- */}
                            <div className="lg:w-2/3">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-(--color-secondary)">
                                        {t('hotels.accommodations_found', { count: filteredHotels.length })}
                                    </h2>
                                </div>

                                {filteredHotels.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {filteredHotels.map((hotel, index) => (
                                            <HotelCard
                                                key={hotel.id || index}
                                                hotel={hotel}
                                                onSelect={setSelectedHotel}
                                                onQuickView={setQuickViewHotel}
                                                t={t}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                                        <h3 className="text-xl text-gray-500">{t('hotels.search.no_results_title')}</h3>
                                    </div>
                                )}
                            </div>

                            {/* --- Mapa Sticky --- */}
                            <aside className="lg:w-1/3 relative">
                                <div className="sticky top-24">
                                    <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 mb-2">
                                            <h3 className="font-bold text-(--color-secondary) truncate">
                                                {selectedHotel ? selectedHotel.name : t('hotels.map.title')}
                                            </h3>
                                        </div>
                                        <div className="h-[400px] md:h-[600px] w-full rounded-xl overflow-hidden bg-gray-200 relative">
                                            {selectedHotel ? (
                                                <iframe
                                                    key={selectedHotel.id}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0 }}
                                                    loading="lazy"
                                                    allowFullScreen
                                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedHotel.longitude - 0.01}%2C${selectedHotel.latitude - 0.01}%2C${selectedHotel.longitude + 0.01}%2C${selectedHotel.latitude + 0.01}&layer=mapnik&marker=${selectedHotel.latitude}%2C${selectedHotel.longitude}`}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    Selecione um hotel
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>

                    {/* --- Quick View Modal --- */}
                    <AnimatePresence>
                        {quickViewHotel && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setQuickViewHotel(null)}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="bg-white rounded-2xl shadow-2xl z-10 w-full max-w-3xl overflow-hidden flex flex-col md:flex-row relative"
                                >
                                    <button
                                        onClick={() => setQuickViewHotel(null)}
                                        className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>

                                    <div className="md:w-1/2 h-64 md:h-auto relative">
                                        <img
                                            src={quickViewHotel.image}
                                            alt={quickViewHotel.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {quickViewHotel.gallery && quickViewHotel.gallery.length > 0 && (
                                            <div className="absolute bottom-4 left-4 flex gap-2">
                                                {quickViewHotel.gallery.slice(0, 3).map((imgUrl, i) => (
                                                    <div key={i} className="w-12 h-12 rounded-lg border-2 border-white overflow-hidden shadow-md">
                                                        <img src={imgUrl} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                                {quickViewHotel.gallery.length > 3 && (
                                                    <div className="w-12 h-12 rounded-lg bg-black/60 border-2 border-white flex items-center justify-center text-white text-xs font-bold backdrop-blur-sm">
                                                        +{quickViewHotel.gallery.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-8 md:w-1/2 flex flex-col">
                                        <h2 className="text-3xl font-bold text-(--color-secondary) mb-2">{quickViewHotel.name}</h2>
                                        <div className="flex items-center text-sm text-(--color-neutral-gray) mb-6">
                                            <svg className="w-4 h-4 mr-1 text-(--color-primary)" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                            {quickViewHotel.distance}
                                        </div>

                                        <div className="mb-6 grow">
                                            <h4 className="font-bold text-(--color-text-header) mb-3 border-b pb-2">Comodidades Prncipais</h4>
                                            <ul className="space-y-2">
                                                {quickViewHotel.features.slice(0, 5).map((feature, idx) => (
                                                    <li key={idx} className="flex items-center text-sm text-(--color-text-body)">
                                                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        {t(feature)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex gap-3 mt-auto">
                                            <button
                                                onClick={() => {
                                                    setSelectedHotel(quickViewHotel);
                                                    setQuickViewHotel(null);
                                                }}
                                                className="flex-1 py-3 text-sm text-(--color-primary) font-bold border-2 border-(--color-primary) rounded-xl hover:bg-(--color-primary)/5 transition-colors"
                                            >
                                                Ver no Mapa
                                            </button>
                                            <Link
                                                to={`/hoteis/${quickViewHotel.id || quickViewHotel._id}`}
                                                className="flex-1 py-3 text-sm flex items-center justify-center bg-(--color-secondary) text-white font-bold rounded-xl hover:bg-opacity-90 shadow-md transition-all"
                                            >
                                                Ver Detalhes
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </main>
            )}

            <Footer />
        </div>
    );
}
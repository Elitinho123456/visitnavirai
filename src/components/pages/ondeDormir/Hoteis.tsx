import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { hotelsData } from '../../../config/const.ts';
import { type Hotel } from '../../../types/interfacesTypes.ts';

// Componente de Card Reutilizável
const HotelCard = ({ hotel, onSelect, t }: { hotel: Hotel; onSelect: (h: Hotel) => void, t: any }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
        <div className="relative h-56 overflow-hidden">
            <img 
                src={hotel.image} 
                alt={hotel.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
            
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
                    onClick={() => onSelect(hotel)} 
                    className="flex-1 py-2 text-sm text-(--color-primary) font-bold border border-(--color-primary) rounded-lg hover:bg-(--color-primary) hover:text-white transition-colors"
                >
                    {t('hotels.map.view_on_map')}
                </button>
                <Link 
                    to="/hotelInfo" 
                    className="flex-1 py-2 text-sm text-center bg-(--color-secondary) text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Detalhes
                </Link>
            </div>
        </div>
    </div>
);

export default function Hoteis() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(hotelsData[0]);

  const filteredHotels = useMemo(() => {
    if (!searchTerm) return hotelsData;
    return hotelsData.filter(hotel =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Header />

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
                            {filteredHotels.map((hotel) => (
                                <HotelCard 
                                    key={hotel.id} 
                                    hotel={hotel} 
                                    onSelect={setSelectedHotel}
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
      </main>

      <Footer />
    </div>
  );
}
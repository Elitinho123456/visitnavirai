import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { hotelsData } from '../../../config/const.ts';
import { type Hotel } from '../../../types/interfacesTypes.ts';

// SVGs for social icons for simplicity
const WebsiteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 009-9H3a9 9 0 009 9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 4.03-9 9h18c0-4.97-4.03-9-9-9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.266.058 2.15.247 2.943.533.844.295 1.517.728 2.18 1.39s1.095 1.336 1.39 2.18c.286.793.475 1.677.533 2.943.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.058 1.266-.247 2.15-.533 2.943-.295.844-.728 1.517-1.39 2.18s-1.336 1.095-2.18 1.39c-.793.286-1.677.475-2.943.533-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.266-.058-2.15-.247-2.943-.533-.844-.295-1.517-.728-2.18-1.39s-1.095-1.336-1.39-2.18c-.286-.793-.475-1.677-.533-2.943-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.058-1.266.247-2.15.533-2.943.295-.844.728-1.517 1.39-2.18s1.336-1.095 2.18-1.39c.793-.286 1.677-.475 2.943-.533C8.416 2.175 8.796 2.163 12 2.163zm0 1.626c-3.14 0-3.505.012-4.73.068-1.18.053-1.92.23-2.527.465-.68.258-1.18.63-1.704 1.155s-.897 1.024-1.155 1.704c-.235.607-.412 1.347-.465 2.527C3.175 8.495 3.163 8.86 3.163 12s.012 3.505.068 4.73c.053 1.18.23 1.92.465 2.527.258.68.63 1.18 1.155 1.704s1.024.897 1.704 1.155c.607.235 1.347.412 2.527.465C8.495 20.825 8.86 20.837 12 20.837s3.505-.012 4.73-.068c1.18-.053 1.92-.23 2.527-.465.68-.258 1.18-.63 1.704-1.155s.897-1.024 1.155-1.704c.235-.607.412-1.347.465-2.527C20.825 15.505 20.837 15.14 20.837 12s-.012-3.505-.068-4.73c-.053-1.18-.23-1.92-.465-2.527-.258-.68-.63-1.18-1.155-1.704s-1.024-.897-1.704-1.155c-.607-.235-1.347-.412-2.527-.465C15.505 3.825 15.14 3.813 12 3.813zM12 9.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5zm0-1.625a4.375 4.375 0 110 8.75 4.375 4.375 0 010-8.75zM18.88 5.992a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" />
  </svg>
);


export default function Hoteis() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(hotelsData[0]);

  const filteredHotels = useMemo(() => {
    if (!searchTerm) {
      return hotelsData;
    }
    return hotelsData.filter(hotel =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelectHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f6f5]">
      <Header />

      <main className="grow">
        {/* --- Barra de Pesquisa Simplificada --- */}
        <section className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={t('hotels.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-10 py-3 bg-gray-100 border border-gray-200 rounded-lg shadow-sm text-gray-800 focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* --- Mapa --- */}
          <aside className="lg:col-span-1 lg:sticky top-24 self-start">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-2 px-2">{selectedHotel ? selectedHotel.name : t('hotels.map.title')}</h3>
              {selectedHotel ? (
                <iframe
                  key={selectedHotel.id} // Re-render iframe on hotel change
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedHotel.longitude - 0.01}%2C${selectedHotel.latitude - 0.01}%2C${selectedHotel.longitude + 0.01}%2C${selectedHotel.latitude + 0.01}&layer=mapnik&marker=${selectedHotel.latitude}%2C${selectedHotel.longitude}`}>
                </iframe>
              ) : (
                <div className="bg-gray-200 h-96 rounded flex items-center justify-center text-center p-4">
                  <p className="text-gray-600">{t('hotels.map.select_hotel')}</p>
                </div>
              )}
            </div>
          </aside>

          {/* --- Lista de Hotéis --- */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              {t('hotels.accommodations_found', { count: filteredHotels.length })}
            </h2>

            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 md:w-64 relative">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover min-h-[200px]" />
                    {hotel.highlight && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-(--color-secondary) text-white text-xs font-bold px-2 py-1 rounded shadow">
                          {t('hotels.badges.highlight')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-(--color-text-body) mb-1">
                        {hotel.name}
                      </h3>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {hotel.distance}
                        <button onClick={() => handleSelectHotel(hotel)} className="text-(--color-primary) font-semibold cursor-pointer hover:underline ml-1">
                          {t('hotels.map.view_on_map')}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {hotel.features.map((feature, idx) => (
                          <span key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                            {t(feature)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 text-gray-600">
                      {hotel.socials.website && (
                        <a href={hotel.socials.website} target="_blank" rel="noopener noreferrer" className="hover:text-(--color-primary)">
                          <WebsiteIcon />
                        </a>
                      )}
                      {hotel.socials.instagram && (
                        <a href={hotel.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-(--color-primary)">
                          <InstagramIcon />
                        </a>
                      )}
                      {hotel.socials.facebook && (
                        <a href={hotel.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-(--color-primary)">
                          <FacebookIcon />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-700">{t('hotels.search.no_results_title')}</h3>
                <p className="text-gray-500 mt-1">{t('hotels.search.no_results_subtitle')}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
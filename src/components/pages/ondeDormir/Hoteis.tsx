import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

import { hotelsData } from '../../../config/const.ts';

export default function Hoteis() {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState('relevance');

  // Função auxiliar para renderizar estrelas
  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
        className={`w-4 h-4 ${i < count ? 'text-(--color-accent-gold)' : 'text-gray-300'}`}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
      </svg>
    ));
  };

  // Função para obter texto da avaliação baseado na nota
  const getRatingText = (rating: number) => {
    if (rating >= 9) return t('hotels.ratings.excellent');
    if (rating >= 8) return t('hotels.ratings.very_good');
    if (rating >= 7) return t('hotels.ratings.good');
    return t('hotels.ratings.satisfactory');
  };

  const amenities = ['pool', 'wifi', 'parking', 'breakfast'];

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f6f5]">

      <Header />

      <main className="grow">
        {/* --- Barra de Pesquisa (Estilo Trivago) --- */}
        <section className="bg-(--color-neutral-white) shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">

              {/* Inputs simulados */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-2 bg-gray-100 p-1 rounded-lg">
                <button className="flex items-center gap-2 px-4 py-3 bg-white rounded shadow-sm text-left text-gray-700 hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-(--color-primary)">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <span className="truncate">Naviraí</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-white rounded shadow-sm text-left text-gray-700 hover:bg-gray-50 border-l border-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-(--color-primary)">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0h18M5.25 12h13.5h-13.5zm0 3.75h13.5h-13.5z" />
                  </svg>
                  <span className="truncate">{t('hotels.search.checkin_checkout')}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-white rounded shadow-sm text-left text-gray-700 hover:bg-gray-50 border-l border-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-(--color-primary)">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="truncate">{t('hotels.search.guests_rooms')}</span>
                </button>
              </div>

              <button className="w-full md:w-auto px-8 py-3 bg-(--color-button-background) text-(--color-button-text) font-bold rounded-lg shadow hover:bg-(--color-accent-gold)/90 transition-colors uppercase tracking-wide">
                {t('hotels.search.button')}
              </button>

            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-gray-200 h-32 rounded flex items-center justify-center relative overflow-hidden group cursor-pointer">
                <img src="https://placehold.co/300x150/png?text=Mapa+Naviraí" alt="Mapa" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <button className="relative z-10 bg-white px-4 py-2 rounded shadow text-sm font-bold text-(--color-primary) hover:bg-gray-50">
                  {t('hotels.map.view_on_map')}
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">{t('hotels.filters.title')}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">{t('hotels.filters.price_per_night')}</h4>
                  <input type="range" className="w-full accent-(--color-primary)" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>R$ 50</span>
                    <span>R$ 500+</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">{t('hotels.filters.rating')}</h4>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" className="rounded text-(--color-primary) focus:ring-(--color-primary)" />
                      <span>{t('hotels.filters.fantastic')} (9+)</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" className="rounded text-(--color-primary) focus:ring-(--color-primary)" defaultChecked />
                      <span>{t('hotels.filters.very_good')} (8+)</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">{t('hotels.filters.amenities')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded cursor-pointer hover:bg-gray-200">
                        {t(`hotels.amenities.${tag}`)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h2 className="text-xl font-bold text-gray-800">{t('hotels.accommodations_found', { count: hotelsData.length })}</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-(--color-primary) focus:border-(--color-primary) block p-2"
              >
                <option value="relevance">{t('hotels.sort.relevance')}</option>
                <option value="price_asc">{t('hotels.sort.price_asc')}</option>
                <option value="rating_desc">{t('hotels.sort.rating_desc')}</option>
              </select>
            </div>

            {hotelsData.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                <div className="sm:w-1/3 md:w-64 relative group">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover min-h-[200px]" />
                  {hotel.badges && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {hotel.badges.map(badge => (
                        <span key={badge} className="bg-(--color-secondary) text-white text-xs font-bold px-2 py-1 rounded shadow">
                          {t(badge)}
                        </span>
                      ))}
                    </div>
                  )}
                  <button className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-(--color-secondary) transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 p-4 flex flex-col justify-between border-r border-gray-100">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-bold text-(--color-text-body) group-hover:text-(--color-primary) cursor-pointer">
                        {hotel.name}
                      </h3>
                      <div className="flex">{renderStars(hotel.stars)}</div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {hotel.distance}
                      <span className="text-(--color-primary) font-semibold cursor-pointer hover:underline ml-1">
                        {t('hotels.map.view_on_map')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hotel.features.map((feature, idx) => (
                        <span key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          {t(feature)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <div className="bg-(--color-primary) text-white font-bold text-lg px-2 py-1 rounded">
                      {hotel.rating}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-(--color-text-body)">{getRatingText(hotel.rating)}</span>
                      <span className="text-xs text-gray-500">{t('hotels.reviews', { count: hotel.reviews })}</span>
                    </div>
                  </div>
                </div>

                <div className="sm:w-48 p-4 bg-gray-50 flex flex-col justify-end items-end border-t sm:border-t-0 sm:border-l border-gray-100">
                  <span className="text-xs text-gray-500 mb-1">{t('hotels.pricing.from')}</span>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    R$ {hotel.price}
                  </div>
                  <span className="text-xs text-green-600 mb-4 font-medium">{t('hotels.pricing.free_cancellation')}</span>
                  <button className="w-full bg-(--color-button-background) hover:bg-(--color-accent-gold) text-(--color-button-text) font-bold py-2 px-4 rounded shadow-sm transition-colors flex items-center justify-center gap-1">
                    {t('hotels.pricing.view_prices')}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                  <div className="mt-2 text-xs text-gray-400 text-center w-full">
                    {t('hotels.pricing.from_sites', { count: 5 })}
                  </div>
                </div>

              </div>
            ))}

          </div>
        </div>
      </main>

      <Footer />
      
    </div>
  );
}
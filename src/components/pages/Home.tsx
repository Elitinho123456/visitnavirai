import { register } from 'swiper/element/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from 'react-i18next';
import { navImages } from '../../config/const.ts';
import { Link } from 'react-router-dom';

// Components
import Header from '../layout/Header.tsx';
import Footer from '../layout/Footer.tsx';
import WeatherWidget from '../layout/WeatherComponent.tsx';
import EventsWidget from '../layout/Events.tsx';
// NOVO: Componente para a Coluna de Anúncios
import AdsColumn from '../layout/AdsColumn.tsx'; 

register();
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Home() {
    const { t } = useTranslation();

    // Ícones simplificados (pode usar uma lib como Lucide ou Heroicons)
    const quickLinks = [
        { icon: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3", title: t('nav.sub.hotels'), link: "/hoteis", color: "bg-blue-500" },
        { icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m-15.686 0A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253m0 0A11.959 11.959 0 0112 10.5c2.998 0 5.74-1.1 7.843-2.918", title: t('nav.sub.history'), link: "/historia", color: "bg-emerald-500" },
        { icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", title: t('nav.sub.shopping'), link: "/compras", color: "bg-purple-500" },
        { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: t('nav.sub.invest'), link: "/investir", color: "bg-amber-500" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-(--color-background)">
            {/* Header fixo e transparente inicialmente */}
            <Header /> 
            
            {/* ----------------------------------------------------- */}
            {/* INÍCIO: ESTRUTURA PRINCIPAL COM 3 COLUNAS */}
            {/* ----------------------------------------------------- */}
            <main className="grow">
                {/* --- Hero Section Imersivo (Full Width) --- */}
                <section className="relative w-full h-[85vh] md:h-[95vh] mb-16 md:mb-20"> {/* Ajustado para caber o menu flutuante */}
                    <Swiper
                        className='w-full h-full'
                        modules={[ ]} // Adicione EffectFade se tiver instalado
                        effect="fade"
                        slidesPerView={1}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        navigation={false} 
                        loop={true}
                        autoplay={{ delay: 6000, disableOnInteraction: false }}
                        speed={1500}
                    >
                        {navImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="w-full h-full relative">
                                    <img
                                        src={image.src}
                                        alt={t(image.tKey)}
                                        className="w-full h-full object-cover transform scale-105 animate-subtle-zoom" 
                                        loading={index === 0 ? "eager" : "lazy"}
                                    />
                                    {/* Gradiente estilo "Bonito" - Mais suave */}
                                    <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
                                    
                                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 mt-16">
                                        <span className="text-(--color-accent-gold) font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4 animate-fade-in-up">
                                            Bem-vindo a Naviraí
                                        </span>
                                        <h2 className="text-white text-4xl md:text-7xl font-bold max-w-4xl leading-tight drop-shadow-lg mb-6 animate-fade-in-up delay-100">
                                            {t(image.tKey)}
                                        </h2>
                                        <p className="text-white/90 text-lg md:text-xl max-w-2xl font-light mb-8 animate-fade-in-up delay-200 hidden md:block">
                                            Descubra o coração do Conesul e suas belezas naturais.
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* --- Menu Flutuante de Acesso Rápido (Estilo Bonito) --- */}
                    <div className="absolute -bottom-16 left-0 w-full z-20 px-4">
                        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {quickLinks.map((item, idx) => (
                                <Link 
                                    key={idx} 
                                    to={item.link} 
                                    className="flex flex-col items-center justify-center group hover:-translate-y-1 transition-transform duration-300"
                                >
                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${item.color} text-white flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                        </svg>
                                    </div>
                                    <span className="text-(--color-secondary) font-bold text-sm md:text-base group-hover:text-(--color-primary) transition-colors">
                                        {item.title}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Grid de 3 Colunas (Anúncio | Conteúdo Principal | Anúncio) --- */}
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-8 mt-16 md:mt-24">

                    {/* COLUNA 1: Anúncios Laterais Esquerda */}
                    <aside className="hidden lg:block">
                        <AdsColumn position="left" />
                    </aside>
                    
                    {/* COLUNA 2: Conteúdo Principal (Anteriormente Seção Explore) */}
                    <div className="min-w-0 mt-16"> {/* min-w-0 para evitar overflow em flex/grid */}
                        <section className="py-8 md:py-12 bg-(--color-background) -mt-16 md:-mt-24"> 
                            <div className="max-w-4xl mx-auto lg:mx-0"> {/* Centralizado em mobile, alinhado em desktop */}
                                <div className="text-center mb-16 lg:text-left">
                                    <h2 className="text-(--color-primary) text-lg font-bold uppercase tracking-wider mb-2">
                                        {t('home.capital_conesul')}
                                    </h2>
                                    <h3 className="text-4xl md:text-5xl font-bold text-(--color-secondary)">
                                        {t('home.explore_title')}
                                    </h3>
                                    <div className="w-24 h-1 bg-(--color-accent-gold) mx-auto mt-6 rounded-full lg:mx-0"></div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
                                    {/* Texto descritivo */}
                                    <div className="space-y-6 text-(--color-text-body) text-lg leading-relaxed text-justify">
                                        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-(--color-primary) first-letter:float-left first-letter:mr-3 first-letter:mt-2.5">
                                            {t('home.explore_p1')}
                                        </p>
                                        <p>
                                            {t('home.explore_p2')} <span className="font-bold text-(--color-primary)">{t('home.capital_conesul')}</span>.
                                        </p>
                                        <p>
                                            {t('home.explore_p3')}
                                        </p>
                                        <div className="pt-4">
                                            <Link to="/historia" className="inline-flex items-center text-(--color-primary) font-bold hover:underline">
                                                Conheça nossa história 
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Widgets Integrados Visualmente (Weather e Investir) */}
                                    <div className="grid grid-cols-1 gap-6 pt-8">
                                        <div className="transform hover:scale-[1.02] transition-transform duration-300">
                                            <WeatherWidget />
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-(--color-primary) flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-xl text-(--color-secondary)">Investir em Naviraí</h4>
                                                <p className="text-sm text-gray-500 mt-1">Oportunidades únicas no Conesul</p>
                                            </div>
                                            <Link to="/investir" className="bg-(--color-primary) text-white px-6 py-2 rounded-full font-bold shadow hover:bg-opacity-90 transition">
                                                Saiba Mais
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* COLUNA 3: Anúncios Laterais Direita */}
                    <aside className="hidden lg:block">
                        <AdsColumn position="right" />
                    </aside>
                </div>
                {/* ----------------------------------------------------- */}
                {/* FIM: ESTRUTURA PRINCIPAL COM 3 COLUNAS */}
                {/* ----------------------------------------------------- */}
                
                {/* --- Seção Full Width Parallax (Divisor de Eventos) --- */}
                <section className="relative py-24 bg-(--color-primary) text-white overflow-hidden mt-12 md:mt-24">
                     <div className="absolute inset-0 opacity-10 pattern-dots"></div> 
                     <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8">Descubra o que está acontecendo</h2>
                        <EventsWidget />
                     </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
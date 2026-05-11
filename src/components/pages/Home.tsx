import { register } from 'swiper/element/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { navImages } from '../../config/const';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import Header from '../layout/Header.tsx';
import Footer from '../layout/Footer.tsx';
import WeatherWidget from '../layout/WeatherComponent.tsx';
import EventsWidget from '../layout/Events.tsx';
import AdsColumn from '../layout/AdsColumn.tsx';

// Icons
import { Hotel, History, ShoppingBag, TrendingUp } from 'lucide-react';

register();
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Home() {
    const quickLinks = [
        { icon: <Hotel />, title: "Hotéis", link: "/acomodacoes?tipo=Hotel", color: "bg-emerald-600", hoverColor: "group-hover:text-sky-500" },
        { icon: <History />, title: "História", link: "/historia", color: "bg-emerald-600", hoverColor: "group-hover:text-emerald-500" },
        { icon: <ShoppingBag />, title: "Compras", link: "/compras", color: "bg-emerald-600", hoverColor: "group-hover:text-purple-500" },
        { icon: <TrendingUp />, title: "Investir", link: "/investir", color: "bg-emerald-600", hoverColor: "group-hover:text-amber-500" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-(--color-background)">
            <Header />

            <main className="grow">
                {/* --- Hero Section Imersivo (Full Width) --- */}
                <section className="relative w-full h-[85vh] md:h-[95vh] mb-16 md:mb-20">
                    <Swiper
                        className='w-full h-full'
                        fadeEffect={{ crossFade: true }}
                        slidesPerView={1}
                        pagination={{ clickable: true, type: "bullets", bulletClass: "swiper-pagination-bullet bg-white/80" }}
                        navigation={true}
                        loop={true}
                        autoplay={{ delay: 6000, disableOnInteraction: false }}
                        speed={1500}
                    >
                        {navImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="w-full h-full relative overflow-hidden">
                                    <img
                                        src={image.src}
                                        alt={image.label}
                                        className="w-full h-full object-cover transform scale-105 animate-subtle-zoom"
                                        loading={index === 0 ? "eager" : "lazy"}
                                    />
                                    <div className="absolute inset-0 bg-black/40 bg-linear-to-b from-black/60 via-black/10 to-black/80" />

                                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 mt-16 z-10">
                                        <span className="text-(--color-accent-gold) font-extrabold tracking-[0.3em] uppercase text-2xl md:text-3xl mb-1 animate-fade-in-up drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                            Bem-vindo a Naviraí
                                        </span>
                                        <h2 className="text-white text-5xl md:text-8xl font-black max-w-4xl leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-6 animate-fade-in-up delay-100">
                                            {image.label}
                                        </h2>
                                        <p className="text-white text-lg md:text-2xl max-w-2xl font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-8 animate-fade-in-up delay-200 hidden md:block">
                                            Descubra o coração do Conesul e suas belezas naturais.
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* --- Menu Flutuante de Acesso Rápido --- */}
                    <div className="absolute -bottom-16 left-0 w-full z-20 px-4">
                        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {quickLinks.map((item, idx) => (
                                <Link
                                    key={idx}
                                    to={item.link}
                                    className="flex flex-col items-center justify-center group hover:-translate-y-1 hover:drop-shadow-2xl transition-transform duration-300"
                                >
                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-(--border-radius-lg) ${item.color} text-white flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow [&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-7 md:[&>svg]:h-7`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-gray-700 font-bold text-sm md:text-base ${item.hoverColor} transition-colors`}>
                                        {item.title}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Grid de 3 Colunas --- */}
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-8 mt-16 md:mt-24">

                    <aside className="hidden lg:block">
                        <AdsColumn position="left" />
                    </aside>

                    <div className="min-w-0 mt-16">
                        <section className="py-8 md:py-12 bg-(--color-background) -mt-16 md:-mt-24">
                            <div className="max-w-4xl mx-auto lg:mx-0">
                                <div className="text-center mb-16 lg:text-left">
                                    <h2 className="text-(--color-primary) text-lg font-bold uppercase tracking-wider mb-2">
                                        Capital do Conesul
                                    </h2>
                                    <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                        Explore Naviraí
                                    </h3>
                                    <div className="w-24 h-1 bg-(--color-accent-gold) mx-auto mt-6 rounded-full lg:mx-0"></div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
                                    <div className="space-y-6 text-(--color-text-body) text-lg leading-relaxed text-justify">
                                        <p className="first-letter:text-7xl first-letter:font-bold first-letter:text-(--color-primary) first-letter:float-left first-letter:mr-3 first-letter:line-height-0">
                                            Descubra as belezas e atrações de Naviraí, uma cidade rica em cultura, natureza e hospitalidade. Desde parques exuberantes até eventos vibrantes, há algo para todos aproveitarem.
                                        </p>
                                        <p>
                                            Naviraí localiza-se na região sudeste do estado, sendo considerada um importante polo regional agroindustrial e de serviços, conhecida como a <span className="font-bold text-(--color-primary)">Capital do Conesul</span>.
                                        </p>
                                        <p>
                                            Fundada em 1952, a cidade possui uma infraestrutura moderna e é o ponto de partida ideal para explorar o potencial turístico da região.
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 pt-8">
                                        <WeatherWidget />

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="relative overflow-hidden bg-white/60 dark:bg-(--color-neutral-white)/80 backdrop-blur-md rounded-4xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/40 dark:border-white/10 flex flex-col justify-between group"
                                        >
                                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-(--color-primary)/20 rounded-full blur-3xl group-hover:bg-(--color-primary)/30 transition-colors pointer-events-none" />
                                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-(--color-secondary)/10 rounded-full blur-3xl group-hover:bg-(--color-secondary)/20 transition-colors pointer-events-none" />

                                            <div className="relative z-10">
                                                <div className="inline-flex items-center justify-center p-3 bg-(--color-primary)/10 text-(--color-primary) rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                                    <TrendingUp strokeWidth={2.5} size={28} />
                                                </div>
                                                <h4 className="font-black text-2xl text-gray-800 mb-2">Investir em Naviraí</h4>
                                                <p className="text-gray-600 mb-6 line-clamp-3">
                                                    Sua porta de entrada para oportunidades únicas no Conesul. Descubra vantagens competitivas, logística de ponta e uma cidade pronta para o futuro.
                                                </p>
                                            </div>

                                            <Link to="/investir" className="relative z-10 w-full md:w-auto inline-flex items-center justify-center gap-2 bg-(--color-primary) text-white px-6 py-3 rounded-xl font-bold hover:bg-(--color-primary-dark) hover:shadow-lg hover:shadow-(--color-primary)/30 transition-all cursor-pointer">
                                                Saiba Mais
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:translate-x-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                </svg>
                                            </Link>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="hidden lg:block">
                        <AdsColumn position="right" />
                    </aside>
                </div>

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
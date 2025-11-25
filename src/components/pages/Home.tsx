// Default Home Page Component
import { register } from 'swiper/element/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation, Trans } from 'react-i18next';
import { navImages } from '../../config/const.ts';

// Components
import Header from '../layout/Header.tsx';
import Footer from '../layout/Footer.tsx';
import WeatherWidget from '../layout/WeatherComponent.tsx';
import EventsWidget from '../layout/Events.tsx';

register();
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Home() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="grow">

                {/* Hero Section com Swiper */}
                <section className="w-full bg-(--color-neutral-white)">
                    <div className='max-w-7xl mx-auto pt-(--spacing-md) md:pt-(--spacing-xl) pb-(--spacing-md) px-4'>
                        <div className='shadow-2xl rounded-2xl overflow-hidden relative group'>
                            {/* Altura fixa para evitar CLS (Layout Shift) */}
                            <div className="h-[300px] sm:h-[400px] md:h-[600px] w-full">
                                <Swiper
                                    className='w-full h-full'
                                    slidesPerView={1}
                                    pagination={{ clickable: true }}
                                    navigation={true} // Habilitado navegação nativa
                                    loop={true}
                                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                                    speed={1000}
                                >
                                    {navImages.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="w-full h-full relative">
                                                <img
                                                    src={image.src}
                                                    alt={t(image.tKey)}
                                                    className="w-full h-full object-cover"
                                                    loading={index === 0 ? "eager" : "lazy"}
                                                />
                                                <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/70 to-transparent p-6 md:p-10">
                                                    <h2 className="text-white text-2xl md:text-4xl font-bold">{t(image.tKey)}</h2>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Seção de Conteúdo Principal */}
                <section className='flex justify-center py-(--spacing-lg) md:py-(--spacing-xl) px-4'>
                    <div className='max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8'>

                        {/* Coluna Principal (Texto) */}
                        <div className='lg:col-span-2'>
                            <div className='relative p-6 md:p-(--spacing-xl) bg-(--color-neutral-white) shadow-md rounded-(--border-radius-md)'>

                                {/* Detalhes Decorativos nos cantos */}
                                <div className='absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-l-4 border-t-4 border-(--color-accent-gold) rounded-tl-(--border-radius-md)' />
                                <div className='absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 border-r-4 border-b-4 border-(--color-accent-gold) rounded-br-(--border-radius-md)' />

                                <div className='flex flex-col md:flex-row gap-8 items-start'>
                                    <div className='w-full pt-4'>
                                        <h2 className='text-(--color-primary) text-3xl md:text-5xl font-bold mb-4 text-center md:text-left'>
                                            {t('home.explore_title')}
                                        </h2>
                                        <hr className='w-24 mx-auto md:mx-0 border-t-4 border-(--color-accent-gold) mb-6' />

                                        <div className='text-(--color-text-body) text-lg leading-relaxed space-y-4 text-justify'>
                                            <p>
                                                {t('home.explore_p1')}
                                            </p>
                                            <p>
                                                <Trans i18nKey="home.explore_p2_trans">
                                                    Naviraí is located in the southeast region of the state and is considered an important regional
                                                    agribusiness and service hub, known as the <span className="font-bold text-(--color-primary)">"Capital of the Conesul"</span>.
                                                </Trans>
                                            </p>
                                            <p>
                                                {t('home.explore_p3')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (Widget de Clima) */}
                        <div className='lg:col-span-1 flex flex-col gap-6'>
                            <div className="sticky top-24">
                                <WeatherWidget />
                            </div>
                        </div>

                        {/* Eventos */}
                        <div className='lg:col-span-3 flex justify-center py-(--spacing-lg)'>
                            <EventsWidget />
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
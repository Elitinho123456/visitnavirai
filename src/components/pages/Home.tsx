// Default Home page component
import { register } from 'swiper/element/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { navImages } from '../../config/const.ts';

// Importing layout components
import Header from '../layout/Header.tsx';
import Footer from '../layout/Footer.tsx';
import WeatherWidget from '../layout/WeatherComponent.tsx';

register();
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';




export default function Home() {
    return (
        <div>
            <Header />
            <main>

                <section>
                    <div className='max-w-7xl mx-auto mt-(--spacing-xl) mb-(--spacing-xl) flex justify-center items-center shadow-lg rounded-2xl overflow-hidden'>
                        <Swiper className='flex justify-center items-center'
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            navigation
                            loop={true}
                            autoplay={{ delay: 5000 }}
                            speed={1500}
                            onSlideChange={() => { }}
                            onSwiper={(swiper) => console.log(swiper)}
                        >
                            {
                                navImages.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={image.src} alt={image.name} />
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </section>



                <section className='flex justify-center bg-(--color-neutral-light) py-(--spacing-xl) px-(--spacing-lg)'>
                    <div className='max-w-12xl w-full'>

                        <div className='relative p-(--spacing-xl) bg-(--color-neutral-white) shadow-md rounded-(--border-radius-md) mx-auto max-w-5xl'>

                            <div className='
                            absolute top-0 left-0 
                            w-12 h-12 
                            border-l-4 border-t-4 
                            border-(--color-accent-gold) 
                            rounded-tl-(--border-radius-md)'
                            />

                            <div className='
                            absolute bottom-0 right-0 
                            w-12 h-12 
                            border-r-4 border-b-4 
                            border-(--color-accent-gold) 
                            rounded-br-(--border-radius-md)'
                            />

                            <div className='flex flex-col md:flex-row gap-(--spacing-xl) items-center justify-center'>

                                <div className='shrink-0 w-full md:w-1/3 pt-(--spacing-md)'>
                                    <h2 className='text-(--color-primary) text-5xl font-bold mb-(--spacing-md) text-center'>
                                        Explore Naviraí
                                    </h2>
                                    <hr className='w-full border-t-2 border-(--color-primary)' />
                                </div>

                                <div className='w-full md:w-2/3'>
                                    <p className='text-(--color-text-body) text-xl leading-relaxed'>
                                        Descubra as belezas e atrações de Naviraí, uma cidade rica em cultura, natureza e hospitalidade.
                                        Desde parques exuberantes até eventos vibrantes, há algo para todos aproveitarem.
                                        Planeje sua visita e mergulhe na experiência única que Naviraí tem a oferecer!
                                    </p>
                                    <p className='text-(--color-text-body) text-xl leading-relaxed mt-(--spacing-md)'>
                                        Naviraí localiza-se na região sudeste do estado, sendo considerada um importante polo regional
                                        agroindustrial e de serviços, conhecida como a "Capital do Conesul".
                                    </p>
                                    <p className='text-(--color-text-body) text-xl leading-relaxed mt-(--spacing-md)'>
                                        Fundada em 1952, a cidade possui uma infraestrutura moderna, com diversas opções de lazer,
                                        hospedagem e gastronomia, atendendo às necessidades dos visitantes mais exigentes.
                                        O município possui uma grande diversidade cultural e natural, sendo um ponto de partida ideal
                                        para explorar o potencial turístico e econômico da região.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <WeatherWidget />
            </main>

            <Footer />
        </div>
    );
}
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import hotelData from "../../../locales/hotelVillaVerde.json"; 

export default function HotelInfo() {
    const { hero, about, accommodation, policies, amenities, cta } = hotelData.hotel;

    return (
        <div className="flex flex-col min-h-screen bg-(--color-background)">
            <Header />

            <main className="grow">
                {/* --- Hero Section (Banner) --- */}
                {/* Ajuste: Altura dinâmica (min-h) para não ficar pequeno demais em mobile */}
                <section className="relative h-[60vh] min-h-[400px] md:h-[500px] lg:h-[600px] w-full">
                    <img 
                        src="https://placehold.co/1800x720" 
                        alt={hero.imageAlt}
                        // Ajuste: object-center para focar melhor no mobile
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4 sm:px-6">
                        {/* Ajuste: Tamanhos de fonte escalonados (text-3xl -> 4xl -> 5xl -> 6xl) */}
                        <h1 className="text-(--color-neutral-white) text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-3 md:mb-4 drop-shadow-lg">
                            {hero.title}
                        </h1>
                        <p className="text-(--color-neutral-light) text-base sm:text-lg md:text-xl max-w-xl md:max-w-2xl font-light leading-relaxed">
                            {hero.subtitle}
                        </p>
                    </div>
                </section>

                {/* --- Conteúdo Principal --- */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-(--spacing-xl)">
                    
                    {/* Bloco 1: Introdução (Sobre a Propriedade) */}
                    {/* Ajuste: Gap menor no mobile (8) e maior no desktop (12 ou 16) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-24 items-start">
                        {/* Ajuste: Borda em baixo no mobile (border-b) e na direita no desktop (border-r) */}
                        <div className="md:col-span-4 h-full flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-(--color-secondary) pb-6 mb-2 md:mb-0 md:pr-8">
                            <h2 className="text-(--color-primary) text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                                {about.title}
                            </h2>
                            <div className="w-20 md:w-30 h-1 bg-(--color-accent-gold) mt-4 mb-4 md:mb-6"></div>
                            <p className="text-(--color-neutral-gray) font-medium text-xs sm:text-sm uppercase tracking-widest">
                                {about.subtitle}
                            </p>
                        </div>
                        <div className="md:col-span-8 space-y-4 md:space-y-6 text-(--color-text-body) text-base sm:text-lg leading-relaxed text-justify">
                            <p>{about.p1}</p>
                            <p>{about.p2}</p>
                            <p>{about.p3}</p>
                        </div>
                    </div>

                    {/* Bloco 2: Acomodações e Imagem (Layout Invertido) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mb-16 md:mb-24 items-center">
                        <div className="order-2 md:order-1 relative group rounded-2xl overflow-hidden shadow-xl h-64 sm:h-80 md:h-auto">
                            <img 
                                src="https://placehold.co/600x400" 
                                alt={accommodation.imageAlt}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                                <p className="text-white text-xs sm:text-sm font-medium">{accommodation.caption}</p>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h3 className="text-(--color-text-header) text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
                                {accommodation.title}
                            </h3>
                            <div className="space-y-4 text-(--color-text-body) text-base sm:text-lg leading-relaxed text-justify">
                                <p>{accommodation.p1}</p>
                                <p>{accommodation.p2}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bloco 3: Políticas e Horários */}
                    <div className="bg-(--color-neutral-white) rounded-(--border-radius-lg) p-6 sm:p-8 md:p-12 shadow-lg border-t-4 border-(--color-accent-gold) mb-16 md:mb-24">
                        <h3 className="text-center text-(--color-primary) text-2xl sm:text-3xl font-bold mb-8 md:mb-10">
                            Informações Essenciais
                        </h3>
                        
                        {/* Ajuste: Adicionado sm:grid-cols-2 para criar um grid 2x2 em tablets antes de virar 4x1 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative">
                            {/* Linha conectora apenas no desktop */}
                            <div className="hidden md:block absolute top-[2rem] left-0 w-full h-0.5 bg-(--color-neutral-light) -z-10"></div>

                            {policies.map((item, index) => (
                                <div key={index} className="flex flex-col items-center text-center bg-(--color-neutral-white) p-2 md:p-4 rounded-lg">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold text-sm md:text-base mb-3 md:mb-4 shadow-lg ring-4 ring-(--color-neutral-light)">
                                        {item.label}
                                    </div>
                                    <h4 className="text-(--color-text-header) font-bold text-base md:text-lg">{item.title}</h4>
                                    <p className="text-sm text-(--color-neutral-gray) mt-2 leading-snug">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bloco 4: Comodidades (Cards) */}
                    <div className="mb-16 md:mb-24">
                        <h3 className="text-(--color-text-header) text-2xl sm:text-3xl font-bold mb-6 md:mb-8 border-l-4 border-(--color-secondary) pl-4">
                            {amenities.title}
                        </h3>
                        {/* Ajuste: sm:grid-cols-2 para tablets */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                            
                            {/* Card 1 */}
                            <div className="bg-(--color-neutral-white) p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-(--color-neutral-light)">
                                <div className="text-(--color-accent-gold) mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2">{amenities.card1.title}</h4>
                                <p className="text-sm text-(--color-text-body) leading-relaxed">
                                    {amenities.card1.desc}
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-(--color-neutral-white) p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-(--color-neutral-light)">
                                <div className="text-(--color-primary) mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2">{amenities.card2.title}</h4>
                                <p className="text-sm text-(--color-text-body) leading-relaxed">
                                    {amenities.card2.desc}
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-(--color-neutral-white) p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-(--color-neutral-light)">
                                <div className="text-(--color-secondary) mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> 
                                    </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2">{amenities.card3.title}</h4>
                                <p className="text-sm text-(--color-text-body) leading-relaxed">
                                    {amenities.card3.desc}
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="bg-(--color-primary) text-white p-6 sm:p-10 md:p-14 rounded-(--border-radius-lg) text-center shadow-xl">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">{cta.title}</h3>
                        <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed opacity-90">
                            {cta.desc}
                        </p>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
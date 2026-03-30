import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

export default function Historia() {
    const timelineItems = [
        { year: '1952', title: 'Fundação', desc: 'Início da colonização pela Vera Cruz Ltda.' },
        { year: '1958', title: 'Distrito', desc: 'Elevado a Distrito pela Lei nº 1.195.' },
        { year: '1963', title: 'Município', desc: 'Emancipação via Lei nº 1.944, por Weimar Torres.' },
        { year: '1965', title: 'Instalação', desc: 'Posse do 1º Prefeito, João Martins Cardoso.' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
            <Header />

            <main className="grow">
                {/* --- Hero Section Imersivo --- */}
                <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                    <img 
                        src="/navirai_noite.png" 
                        alt="História de Naviraí"
                        className="w-full h-full object-cover transform scale-105 animate-subtle-zoom"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-black/80 flex flex-col justify-end items-center text-center px-4 pb-20">
                        <span className="text-(--color-accent-gold) font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4 animate-fade-in-up">
                            De Povoado Planejado à Capital do Conesul
                        </span>
                        <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg animate-fade-in-up delay-100">
                            Nossa História
                        </h1>
                        <div className="w-24 h-1 bg-(--color-accent-gold) rounded-full animate-fade-in-up delay-200"></div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
                    
                    {/* Bloco 1: A Origem */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-(--color-primary)/10 rounded-full blur-3xl"></div>
                            <h2 className="text-(--color-secondary) text-4xl md:text-5xl font-bold leading-tight mb-8 relative z-10">
                                Naviraí
                                <span className="block text-(--color-primary) text-2xl md:text-3xl mt-2 font-light">
                                    A Marcha para o Oeste
                                </span>
                            </h2>
                            <div className="space-y-6 text-gray-600 text-lg leading-relaxed text-justify relative z-10">
                                <p className="border-l-4 border-(--color-accent-gold) pl-6 italic text-gray-800">
                                    A história de Naviraí é um estudo exemplar das políticas de interiorização conhecidas como "Marcha para o Oeste". Diferente de muitos assentamentos espontâneos, Naviraí não nasceu do acaso.
                                </p>
                                <p>O município foi concebido de forma planejada em 1952 pela Colonizadora Vera Cruz, com um traçado urbano peculiar em formato de "teia de aranha", refletindo um alto grau de organização e antecipação de crescimento.</p>
                                <p>Localizada estrategicamente na Bacia do Rio Paraná, a cidade nasceu isolada, dependendo do transporte fluvial pelo Rio Amambai, até a abertura das primeiras estradas que permitiram o escoamento da madeira e a chegada de colonos.</p>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-(--color-primary) rounded-2xl rotate-3 opacity-20 transition-transform group-hover:rotate-6"></div>
                            <img 
                                src="/colonizacao_1952.png"
                                alt="Mapa antigo" 
                                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>

                    {/* Bloco 2: Os Pioneiros */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                            <img 
                                src="/colonizacao_1952.png" 
                                alt="Colonização Antiga"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/90 to-transparent p-8">
                                <p className="text-white/90 font-medium border-l-2 border-(--color-accent-gold) pl-4">
                                    O início do extrativismo madeireiro na década de 50.
                                </p>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-6xl font-bold text-(--color-primary)/20">1952</span>
                                <div className="h-px bg-gray-300 flex-1"></div>
                            </div>
                            <h3 className="text-(--color-secondary) text-3xl md:text-4xl font-bold mb-6">
                                Os Anos Pioneiros (1952-1958)
                            </h3>
                            <div className="space-y-4 text-gray-600 text-lg leading-relaxed text-justify">
                                <p>O núcleo inicial, batizado de Povoado Vera Cruz, teve como motor econômico as serrarias instaladas em 1953. Figuras como Moryoshi Fukuda e Antônio Augusto dos Santos foram essenciais nessa fase.</p>
                                <p>Um marco cultural importante ocorreu em 1961, com a fundação da Colônia Japonesa, trazendo 25 famílias que introduziram técnicas agrícolas vitais para o futuro da região.</p>
                            </div>
                        </div>
                    </div>

                    {/* Bloco 3: Timeline */}
                    <div className="relative">
                        <div className="text-center mb-16">
                            <h3 className="text-(--color-secondary) text-3xl font-bold">Caminho para a Emancipação</h3>
                            <div className="w-20 h-1 bg-(--color-primary) mx-auto mt-4 rounded-full"></div>
                        </div>
                        
                        <div className="relative">
                            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>

                            <div className="space-y-12 md:space-y-24">
                                {timelineItems.map((item, index) => (
                                    <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                        <div className="md:w-1/2 p-4"></div>
                                        
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white border-4 border-(--color-primary) rounded-full z-10 flex items-center justify-center shadow-lg">
                                            <div className="w-3 h-3 bg-(--color-primary) rounded-full"></div>
                                        </div>

                                        <div className={`md:w-1/2 p-4 ${index % 2 === 0 ? 'text-center md:text-right' : 'text-center md:text-left'}`}>
                                            <span className="text-5xl font-bold text-(--color-primary)/10 absolute -mt-10 md:-mt-14 ml-4 md:ml-0 select-none">
                                                {item.year}
                                            </span>
                                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative z-0 hover:-translate-y-1 transition-transform duration-300">
                                                <h4 className="text-(--color-secondary) font-bold text-xl mb-2">{item.title}</h4>
                                                <p className="text-gray-600">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bloco 4: Ciclos Econômicos */}
                    <div className="bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-gray-100">
                        <h3 className="text-(--color-secondary) text-3xl font-bold mb-12 text-center">
                            Evolução Econômica
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Ciclo da Madeira', desc: 'Dominado pelo extrativismo e serrarias. Foi o período de fixação inicial e abertura das primeiras vias de transporte.', icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "text-amber-600" },
                                { title: 'Diversificação', desc: 'Décadas de 70 e 80. Expansão da pecuária e o auge do ciclo do algodão, modernizando a base agrícola.', icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-emerald-600" },
                                { title: 'Agroindústria', desc: 'Pós-1980 com o Proálcool, Usinas de Cana, e mais recentemente a alta tecnologia na Soja e Milho.', icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", color: "text-blue-600" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center group">
                                    <div className={`w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm ${item.color}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-xl mb-3 text-gray-800">{item.title}</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bloco 5: Hoje */}
                    <div className="relative rounded-3xl overflow-hidden bg-(--color-primary) text-white p-12 md:p-20 text-center">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h3 className="text-3xl md:text-5xl font-bold mb-8">Naviraí Hoje</h3>
                            <p className="text-lg md:text-xl leading-relaxed opacity-95 font-light">
                                Atualmente, Naviraí transcende o papel de polo agroindustrial. Com infraestrutura robusta, como a BR-163 e investimentos em educação e serviços, a cidade se consolidou como o centro de apoio regional, garantindo o desenvolvimento sustentável do Cone-Sul de Mato Grosso do Sul.
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
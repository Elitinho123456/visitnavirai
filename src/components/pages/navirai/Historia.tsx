import { useState } from "react";
import { motion } from "framer-motion";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

interface HistoricalPhoto {
    id: number;
    src: string;
    title: string;
    caption: string;
    year: string;
}

const HISTORICAL_PHOTOS: HistoricalPhoto[] = [
    {
        id: 1,
        src: '/colonizacao_1952.png',
        title: 'Traçado Urbanístico Radial',
        caption: 'Plano em teia de aranha projetado pela Colonizadora Vera Cruz em 1952.',
        year: '1952'
    },
    {
        id: 2,
        src: '/historia_hero.png',
        title: 'Pioneiros e Desbravadores',
        caption: 'Abertura das primeiras picadas e desbravamento da mata virgem.',
        year: '1953'
    },
    {
        id: 3,
        src: '/praca_central.png',
        title: 'Praça Central Euclides Fabris',
        caption: 'Convergência dos raios urbanos e ponto de encontro da comunidade.',
        year: '1960'
    },
    {
        id: 4,
        src: '/rio_amambai.png',
        title: 'Transporte no Rio Amambai',
        caption: 'Primeira via de escoamento e acesso antes das rodovias estaduais.',
        year: '1954'
    }
];

function InteractivePhotoDeck() {
    const [deck, setDeck] = useState<HistoricalPhoto[]>(HISTORICAL_PHOTOS);
    const [isShuffling, setIsShuffling] = useState(false);
    const [pullingCardId, setPullingCardId] = useState<number | null>(null);

    const pullBackToFront = () => {
        if (isShuffling) return;
        setIsShuffling(true);

        // The photo currently at the back is deck[deck.length - 1]
        const backCard = deck[deck.length - 1];
        setPullingCardId(backCard.id);

        setTimeout(() => {
            setDeck((prev) => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
            setPullingCardId(null);
            setIsShuffling(false);
        }, 450);
    };

    // Card offsets in the stack (organic photograph pile)
    const cardStackStyles = [
        { rotate: -2, x: 0, y: 0, scale: 1, zIndex: 30 },
        { rotate: 3, x: 8, y: 8, scale: 0.97, zIndex: 20 },
        { rotate: -4, x: -6, y: 14, scale: 0.94, zIndex: 10 },
        { rotate: 5, x: 10, y: 20, scale: 0.91, zIndex: 5 },
    ];

    const currentTop = deck[0];
    const currentIndex = HISTORICAL_PHOTOS.findIndex(p => p.id === currentTop.id);

    return (
        <div className="flex flex-col items-center select-none w-full">
            {/* Card Stack Container */}
            <div
                className="relative w-full max-w-[420px] h-[370px] sm:h-[410px] cursor-pointer group flex items-center justify-center"
                onClick={pullBackToFront}
                title="Clique para folhear as fotos históricas (trazendo a de trás para frente)"
            >
                {deck.map((photo, idx) => {
                    const isPulling = pullingCardId === photo.id;
                    const style = cardStackStyles[idx] || cardStackStyles[3];

                    return (
                        <motion.div
                            key={photo.id}
                            className="absolute w-[86%] sm:w-[90%] bg-white dark:bg-[#241a06] rounded-2xl p-3 pb-5 shadow-2xl border border-[#ede0d8] dark:border-[#3a2e1a] transition-shadow group-hover:shadow-[0_22px_50px_rgba(0,0,0,0.3)]"
                            style={{ originX: 0.5, originY: 0.5 }}
                            animate={
                                isPulling
                                    ? {
                                        x: [style.x, 150, 0],
                                        y: [style.y, -45, 0],
                                        rotate: [style.rotate, 18, -2],
                                        scale: [style.scale, 1.06, 1],
                                        zIndex: [style.zIndex, 50, 50],
                                        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                                    }
                                    : {
                                        x: style.x,
                                        y: style.y,
                                        rotate: style.rotate,
                                        scale: style.scale,
                                        zIndex: style.zIndex,
                                        transition: { type: "spring", stiffness: 260, damping: 22 }
                                    }
                            }
                            whileHover={idx === 0 ? { scale: 1.02 } : undefined}
                        >
                            {/* Realistic Photo Frame */}
                            <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-[#1a1208] border border-[#ede0d8]/50 dark:border-[#3a2e1a]">
                                <img
                                    src={photo.src}
                                    alt={photo.title}
                                    className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 transition-all duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                                    {photo.year}
                                </div>
                            </div>

                            {/* Polaroid-style caption area */}
                            <div className="pt-3 px-1">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-bold text-[#241a06] dark:text-[#f0e6d6] text-sm sm:text-base tracking-tight truncate">
                                        {photo.title}
                                    </h4>
                                    <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                                        Arquivo
                                    </span>
                                </div>
                                <p className="text-xs text-[#5a4d3e] dark:text-[#c5b49e] mt-1 leading-snug line-clamp-2">
                                    {photo.caption}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Interactive Control & Indicators */}
            <div className="mt-4 flex flex-col items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                    {HISTORICAL_PHOTOS.map((p, i) => (
                        <span
                            key={p.id}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-6 bg-emerald-600" : "w-1.5 bg-[#ede0d8] dark:bg-[#3a2e1a]"
                                }`}
                        />
                    ))}
                </div>
                <p className="text-[11px] text-[#8a7968] dark:text-[#c5b49e] font-medium">
                    Toque na foto para puxar a de trás e trazer para frente
                </p>
            </div>
        </div>
    );
}

export default function Historia() {
    const timelineItems = [
        { year: '1952', title: 'Fundação', desc: 'Início da colonização pela Vera Cruz Ltda.' },
        { year: '1958', title: 'Distrito', desc: 'Elevado a Distrito pela Lei nº 1.195.' },
        { year: '1963', title: 'Município', desc: 'Emancipação via Lei nº 1.944, por Weimar Torres.' },
        { year: '1965', title: 'Instalação', desc: 'Posse do 1º Prefeito, João Martins Cardoso.' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-(--color-background)">
            <Header />

            <main className="grow">
                {/* --- Hero Section Imersivo com título centralizado e bem posicionado --- */}
                <section className="relative h-[45vh] md:h-[52vh] w-full overflow-hidden">
                    <img
                        src="/navirai_noite.png"
                        alt="História de Naviraí"
                        className="w-full h-full object-cover transform scale-105 animate-subtle-zoom"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/60 flex flex-col justify-center items-center text-center px-4 pt-6">
                        <span className="text-amber-400 font-bold tracking-[0.25em] uppercase text-xs md:text-sm mb-3">
                            De Povoado Planejado à Capital do Conesul
                        </span>
                        <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-md">
                            Nossa História
                        </h1>
                        <div className="w-20 h-1 bg-amber-400 rounded-full"></div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-28 md:space-y-36">

                    {/* Bloco 1: A Origem com Stack Interativo de Fotos */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="relative">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                            <h2 className="text-[#241a06] dark:text-[#f0e6d6] text-3xl md:text-5xl font-black leading-tight mb-6 relative z-10">
                                Naviraí
                                <span className="block text-emerald-600 dark:text-emerald-400 text-xl md:text-3xl mt-2 font-medium">
                                    A Marcha para o Oeste
                                </span>
                            </h2>
                            <div className="space-y-5 text-[#5a4d3e] dark:text-[#c5b49e] text-base md:text-lg leading-relaxed text-justify relative z-10">
                                <p className="border-l-4 border-amber-400 pl-5 italic text-[#241a06] dark:text-[#f0e6d6] bg-amber-500/5 py-2 rounded-r-lg">
                                    A história de Naviraí é um estudo exemplar das políticas de interiorização conhecidas como "Marcha para o Oeste". Diferente de muitos assentamentos espontâneos, Naviraí não nasceu do acaso.
                                </p>
                                <p>
                                    O município foi concebido de forma planejada em 1952 pela Colonizadora Vera Cruz, com um traçado urbano peculiar em formato de "teia de aranha", refletindo um alto grau de organização e antecipação de crescimento.
                                </p>
                                <p>
                                    Localizada estrategicamente na Bacia do Rio Paraná, a cidade nasceu isolada, dependendo do transporte fluvial pelo Rio Amambai, até a abertura das primeiras estradas que permitiram o escoamento da madeira e a chegada de colonos.
                                </p>
                            </div>
                        </div>

                        {/* Deck de Fotos Interativo */}
                        <div className="flex justify-center lg:justify-end">
                            <InteractivePhotoDeck />
                        </div>
                    </div>

                    {/* Bloco 2: Os Pioneiros */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="order-2 lg:order-1 relative h-96 md:h-112 rounded-2xl overflow-hidden shadow-2xl group border border-[#ede0d8] dark:border-[#3a2e1a]">
                            <img
                                src="/colonizacao_1952.png"
                                alt="Colonização Antiga"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/90 via-black/50 to-transparent p-6 md:p-8">
                                <p className="text-white/95 font-medium border-l-2 border-amber-400 pl-4 text-sm md:text-base">
                                    O início do extrativismo madeireiro e a chegada das primeiras famílias na década de 50.
                                </p>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-5xl md:text-6xl font-black text-emerald-600/20">1952</span>
                                <div className="h-px bg-[#ede0d8] dark:bg-[#3a2e1a] flex-1"></div>
                            </div>
                            <h3 className="text-[#241a06] dark:text-[#f0e6d6] text-2xl md:text-4xl font-black mb-6">
                                Os Anos Pioneiros (1952-1958)
                            </h3>
                            <div className="space-y-4 text-[#5a4d3e] dark:text-[#c5b49e] text-base md:text-lg leading-relaxed text-justify">
                                <p>
                                    O núcleo inicial, batizado de Povoado Vera Cruz, teve como motor econômico as serrarias instaladas em 1953. Figuras como Moryoshi Fukuda e Antônio Augusto dos Santos foram essenciais nessa fase.
                                </p>
                                <p>
                                    Um marco cultural importante ocorreu em 1961, com a fundação da Colônia Japonesa, trazendo famílias pioneiras que introduziram técnicas agrícolas vitais para o futuro da região e a consolidação das lavouras.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bloco 3: Timeline */}
                    <div className="relative">
                        <div className="text-center mb-16">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs md:text-sm">Marcos Históricos</span>
                            <h3 className="text-[#241a06] dark:text-[#f0e6d6] text-3xl md:text-4xl font-black mt-2">Caminho para a Emancipação</h3>
                            <div className="w-20 h-1 bg-emerald-600 mx-auto mt-4 rounded-full"></div>
                        </div>

                        <div className="relative">
                            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#ede0d8] dark:bg-[#3a2e1a]"></div>

                            <div className="space-y-12 md:space-y-20">
                                {timelineItems.map((item, index) => (
                                    <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                        <div className="md:w-1/2 p-4"></div>

                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-[#241a06] border-4 border-emerald-600 rounded-full z-10 flex items-center justify-center shadow-lg">
                                            <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                                        </div>

                                        <div className={`md:w-1/2 p-4 ${index % 2 === 0 ? 'text-center md:text-right' : 'text-center md:text-left'}`}>
                                            <span className="text-5xl font-black text-emerald-600/10 absolute -mt-8 md:-mt-10 ml-4 md:ml-0 select-none">
                                                {item.year}
                                            </span>
                                            <div className="bg-white dark:bg-[#241a06] p-6 rounded-2xl shadow-lg border border-[#ede0d8] dark:border-[#3a2e1a] relative z-0 hover:-translate-y-1 transition-transform duration-300">
                                                <h4 className="text-[#241a06] dark:text-[#f0e6d6] font-bold text-xl mb-2">{item.title}</h4>
                                                <p className="text-[#5a4d3e] dark:text-[#c5b49e] text-sm md:text-base leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bloco 4: Ciclos Econômicos */}
                    <div className="bg-white dark:bg-[#241a06] rounded-3xl p-8 md:p-14 shadow-xl border border-[#ede0d8] dark:border-[#3a2e1a]">
                        <div className="text-center mb-12">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs md:text-sm">Desenvolvimento</span>
                            <h3 className="text-[#241a06] dark:text-[#f0e6d6] text-3xl md:text-4xl font-black mt-2">
                                Evolução Econômica de Naviraí
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Ciclo da Madeira', desc: 'Dominado pelo extrativismo e serrarias na década de 50. Foi o período de fixação inicial e abertura das primeiras vias de transporte.', icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "text-amber-600 bg-amber-500/10" },
                                { title: 'Diversificação e Algodão', desc: 'Décadas de 70 e 80. Expansão da pecuária e o auge da cultura do algodão, modernizando a base agrícola regional.', icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-emerald-600 bg-emerald-500/10" },
                                { title: 'Agroindústria de Ponta', desc: 'Pós-1980 com o Proálcool, usinas sucroalcooleiras e, atualmente, a biotecnologia aplicada à soja, milho e carnes.', icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", color: "text-amber-500 bg-amber-500/10" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center group p-4 rounded-2xl hover:bg-[#f5ede5]/60 dark:hover:bg-[#2e2310]/50 transition-colors">
                                    <div className={`w-18 h-18 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-xs ${item.color}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-lg mb-2 text-[#241a06] dark:text-[#f0e6d6]">{item.title}</h4>
                                    <p className="text-[#5a4d3e] dark:text-[#c5b49e] text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bloco 5: Hoje */}
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-10 md:p-16 text-center shadow-xl">
                        <div className="relative z-10 max-w-4xl mx-auto">
                            <span className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-3 block">Presente e Futuro</span>
                            <h3 className="text-3xl md:text-5xl font-black mb-6">Naviraí Hoje</h3>
                            <p className="text-base md:text-xl leading-relaxed text-emerald-100 font-light max-w-3xl mx-auto">
                                Atualmente, Naviraí transcende o papel de polo agroindustrial. Com infraestrutura robusta, conexão direta com a BR-163 e investimentos contínuos em educação, tecnologia e serviços, a cidade consolidou-se como o centro vital de apoio regional, garantindo desenvolvimento sustentável a todo o Conesul de Mato Grosso do Sul.
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
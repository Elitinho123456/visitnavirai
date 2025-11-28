import { useTranslation, Trans } from "react-i18next";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

export default function Historia() {
    const { t } = useTranslation();

    const timelineItems = [
        { year: '1952', title: t('history.timeline.item1.title'), desc: t('history.timeline.item1.desc') },
        { year: '1958', title: t('history.timeline.item2.title'), desc: t('history.timeline.item2.desc') },
        { year: '1963', title: t('history.timeline.item3.title'), desc: t('history.timeline.item3.desc') },
        { year: '1965', title: t('history.timeline.item4.title'), desc: t('history.timeline.item4.desc') }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-(--color-background)">
            <Header />

            <main className="grow">
                {/* --- Hero Section (Banner) --- */}
                <section className="relative h-[400px] md:h-[500px] w-full">
                    <img 
                        src="/historia_hero.png" 
                        alt={t('history.hero.alt')}
                        className="w-full h-full object-cover tras"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
                        <h1 className="text-(--color-neutral-white) text-4xl md:text-6xl font-bold tracking-wide mb-4">
                            {t('history.hero.title')}
                        </h1>
                        <p className="text-(--color-neutral-light) text-lg md:text-xl max-w-2xl font-light">
                            {t('history.hero.subtitle')}
                        </p>
                    </div>
                </section>

                {/* --- Conteúdo Principal --- */}
                <div className="max-w-5xl mx-auto px-4 py-(--spacing-xl)">
                    
                    {/* Bloco 1: Introdução e Gênese */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 items-start">
                        <div className="md:col-span-4 h-full flex flex-col justify-center border-r-4 border-(--color-secondary) pb-6 mb-6 md:mb-0">
                            <h2 className="text-(--color-primary) text-4xl md:text-5xl font-bold leading-tight">
                                {t('history.introduction.title')}
                            </h2>
                            <div className="w-30 h-1 bg-(--color-accent-gold) mt-4 mb-6"></div>
                            <p className="text-(--color-neutral-gray) font-medium text-sm uppercase tracking-widest">
                                {t('history.introduction.subtitle')}
                            </p>
                        </div>
                        <div className="md:col-span-8 space-y-6 text-(--color-text-body) text-lg leading-relaxed text-justify">
                            <p>{t('history.introduction.p1')}</p>
                            <p>
                                <Trans i18nKey="history.introduction.p2">
                                    O município foi concebido de forma planejada em 1952 pela <strong>Colonizadora Vera Cruz</strong>, 
                                    com um traçado urbano peculiar em formato de "teia de aranha", refletindo um alto grau de organização 
                                    e antecipação de crescimento.
                                </Trans>
                            </p>
                            <p>{t('history.introduction.p3')}</p>
                        </div>
                    </div>

                    {/* Bloco 2: Colonização e Imagem (Layout Invertido) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
                        <div className="order-2 md:order-1 relative group rounded-2xl overflow-hidden shadow-xl">
                            <img 
                                src="/colonizacao_1952.png" 
                                alt={t('history.pioneers.alt')}
                                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-black/60 p-4">
                                <p className="text-white text-sm">{t('history.pioneers.caption')}</p>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h3 className="text-(--color-text-header) text-3xl font-bold mb-6">
                                {t('history.pioneers.title')}
                            </h3>
                            <div className="space-y-4 text-(--color-text-body) leading-relaxed text-justify">
                                <p>
                                    <Trans i18nKey="history.pioneers.p1">
                                        O núcleo inicial, batizado de <strong>Povoado Vera Cruz</strong>, teve como motor econômico as serrarias instaladas em 1953. 
                                        Figuras como Moryoshi Fukuda e Antônio Augusto dos Santos foram essenciais nessa fase.
                                    </Trans>
                                </p>
                                <p>
                                    <Trans i18nKey="history.pioneers.p2">
                                        Um marco cultural importante ocorreu em 1961, com a fundação da <strong>Colônia Japonesa</strong>, 
                                        trazendo 25 famílias que introduziram técnicas agrícolas vitais para o futuro da região.
                                    </Trans>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bloco 3: Emancipação (Timeline Visual) */}
                    <div className="bg-(--color-neutral-white) rounded-(--border-radius-lg) p-8 md:p-12 shadow-md border-t-4 border-(--color-accent-gold) mb-20">
                        <h3 className="text-center text-(--color-primary) text-3xl font-bold mb-10">
                            {t('history.timeline.title')}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                            {/* Linha conectora (Desktop) */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-(--color-neutral-light) -z-10"></div>

                            {timelineItems.map((item, index) => (
                                <div key={index} className="flex flex-col items-center text-center bg-(--color-neutral-white) p-4">
                                    <div className="w-16 h-16 rounded-full bg-(--color-primary) text-white flex items-center justify-center font-bold text-xl mb-4 shadow-lg ring-4 ring-(--color-neutral-light)">
                                        {item.year}
                                    </div>
                                    <h4 className="text-(--color-text-header) font-bold text-lg">{item.title}</h4>
                                    <p className="text-sm text-(--color-neutral-gray) mt-2">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bloco 4: Ciclos Econômicos (Cards) */}
                    <div className="mb-20">
                        <h3 className="text-(--color-text-header) text-3xl font-bold mb-8 border-l-4 border-(--color-secondary) pl-4">
                            {t('history.economy.title')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            <div className="bg-(--color-neutral-white) p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-(--color-accent-gold) mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2">{t('history.economy.card1.title')}</h4>
                                <p className="text-sm text-(--color-text-body)">
                                    {t('history.economy.card1.desc')}
                                </p>
                            </div>

                            <div className="bg-(--color-neutral-white) p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-(--color-primary) mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2">{t('history.economy.card2.title')}</h4>
                                <p className="text-sm text-(--color-text-body)">
                                    {t('history.economy.card2.desc')}
                                </p>
                            </div>

                            <div className="bg-(--color-neutral-white) p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-(--color-secondary) mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2">{t('history.economy.card3.title')}</h4>
                                <p className="text-sm text-(--color-text-body)">
                                    {t('history.economy.card3.desc')}
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="bg-(--color-primary) text-white p-8 md:p-12 rounded-(--border-radius-lg) text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">{t('history.today.title')}</h3>
                        <p className="max-w-3xl mx-auto text-lg leading-relaxed opacity-90">
                            {t('history.today.desc')}
                        </p>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
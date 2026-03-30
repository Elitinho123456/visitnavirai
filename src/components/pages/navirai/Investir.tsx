import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

export default function Investir() {
    const advantages = [
        { title: 'Logística Privilegiada', desc: 'Acesso rápido a importantes rodovias (BR-163) e proximidade com mercados do Mercosul.', icon: 'location' },
        { title: 'Ecossistema em Crescimento', desc: 'Forte sinergia entre cooperativas, produtores e indústrias, fomentando inovação e desenvolvimento.', icon: 'growth' },
        { title: 'Apoio e Incentivos', desc: 'Políticas públicas de atração de investimentos e apoio ao empreendedor local.', icon: 'support' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-(--color-background)">
            <Header />

            <main className="grow">
                <section className="relative h-[400px] md:h-[900px] w-full">
                    <img src="/parque_cumandai.png" alt="Vista panorâmica de Naviraí" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4">
                        <h1 className="text-(--color-neutral-white) text-4xl md:text-6xl font-bold tracking-wide mb-4">
                            Invista em Naviraí
                        </h1>
                        <p className="text-(--color-neutral-light) text-lg md:text-xl max-w-2xl font-light">
                            Um hub de oportunidades no coração do Brasil.
                        </p>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto px-4 py-(--spacing-xl)">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 items-start">
                        <div className="md:col-span-4 h-full flex flex-col justify-center border-r-4 border-(--color-secondary) pb-6 mb-6 md:mb-0">
                            <h2 className="text-(--color-primary) text-4xl md:text-5xl font-bold leading-tight">
                                Por que Naviraí?
                            </h2>
                            <div className="w-30 h-1 bg-(--color-accent-gold) mt-4 mb-6"></div>
                            <p className="text-(--color-neutral-gray) font-medium text-sm uppercase tracking-widest">
                                Crescimento, Inovação e Qualidade de Vida.
                            </p>
                        </div>
                        <div className="md:col-span-8 space-y-6 text-(--color-text-body) text-lg leading-relaxed text-justify">
                            <p>Naviraí representa um centro de oportunidades para investidores que buscam um ambiente de negócios dinâmico, com infraestrutura em expansão e uma localização geográfica estratégica.</p>
                            <p>A cidade oferece uma combinação única de acesso a mercados, recursos naturais e uma comunidade trabalhadora, tornando-se um destino ideal para novos empreendimentos e expansão industrial.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
                        <div className="order-2 md:order-1 relative group rounded-2xl overflow-hidden shadow-xl">
                            <img src="/rio_amambai.png" alt="Maquinário agrícola em campo de soja" className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="order-1 md:order-2">
                            <h3 className="text-(--color-text-header) text-3xl font-bold mb-6">
                                Setores Estratégicos
                            </h3>
                            <div className="space-y-4 text-(--color-text-body) leading-relaxed text-justify">
                                <p>O agronegócio é a espinha dorsal da economia local, com destaque para a produção de soja, milho e cana-de-açúcar. A industrialização, focada na transformação de produtos agrícolas, e um setor de comércio e serviços em constante crescimento, complementam o cenário econômico.</p>
                                <p>Incentivos fiscais e um ambiente de negócios favorável estão disponíveis para empresas que desejam se estabelecer nos principais polos industriais da cidade.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-20">
                        <h3 className="text-(--color-text-header) text-3xl font-bold mb-8 border-l-4 border-(--color-secondary) pl-4">
                            Vantagens Competitivas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {advantages.map((adv, index) => (
                                <div key={index} className="bg-(--color-neutral-white) p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-(--color-primary) mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            {adv.icon === 'location' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />}
                                            {adv.icon === 'growth' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                                            {adv.icon === 'support' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">{adv.title}</h4>
                                    <p className="text-sm text-(--color-text-body)">{adv.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-(--color-primary) text-white p-8 md:p-12 rounded-(--border-radius-lg) text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Faça Parte do Futuro de Naviraí</h3>
                        <p className="max-w-3xl mx-auto text-lg leading-relaxed opacity-90">
                            Entre em contato com a prefeitura para conhecer os projetos de incentivo e descubra como seu negócio pode prosperar em uma das cidades que mais crescem no estado.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { Link } from 'react-router-dom';
import { 
    BarChart3, 
    Users, 
    Maximize, 
    SunMedium, 
    Mountain, 
    Trees, 
    Fish, 
    Calendar, 
    Building2, 
    Hotel, 
    Utensils, 
    Compass, 
    ArrowRight 
} from 'lucide-react';

export default function DadosTuristicos() {
    const indicators = [
        { label: 'População Estimada', value: '~56.000', detail: 'habitantes (IBGE)', icon: <Users size={24} />, color: 'text-amber-500 bg-amber-500/10' },
        { label: 'Área Territorial', value: '3.193,8', detail: 'km² de extensão', icon: <Maximize size={24} />, color: 'text-emerald-500 bg-emerald-500/10' },
        { label: 'Altitude Média', value: '362 m', detail: 'acima do nível do mar', icon: <Mountain size={24} />, color: 'text-amber-600 bg-amber-600/10' },
        { label: 'Clima Predominante', value: 'Subtropical', detail: 'temperatura média de 23°C', icon: <SunMedium size={24} />, color: 'text-orange-500 bg-orange-500/10' },
        { label: 'Bioma e Bacia', value: 'Cerrado / Mata', detail: 'Bacia do Rio Paraná', icon: <Trees size={24} />, color: 'text-teal-500 bg-teal-500/10' },
        { label: 'Rede Hoteleira', value: '+500 Leitos', detail: 'hotéis e pousadas', icon: <Hotel size={24} />, color: 'text-emerald-600 bg-emerald-600/10' },
    ];

    const pillars = [
        {
            title: 'Ecoturismo e Pesca Esportiva',
            desc: 'A presença do Rio Amambai e a proximidade com o Rio Paraná colocam Naviraí em posição de destaque para pescadores de todo o Brasil, com abundância de dourados, pintados, pacus e cacharas. O Parque Natural Municipal Cumandaí oferece trilhas em mata nativa e refúgio ecológico dentro do perímetro urbano.',
            badge: 'Natureza & Lazer',
            icon: <Fish size={24} />,
            image: '/rio_amambai.png'
        },
        {
            title: 'Grandes Eventos & Cultura Regional',
            desc: 'Naviraí sedia a tradicional FEJUNAVI (Festa Junina de Naviraí), um dos maiores festivais culturais do estado com gastronomia típica e shows com grandes nomes da música brasileira. A Exponavi reúne anualmente dezenas de milhares de visitantes no Parque de Exposições.',
            badge: 'Calendário Festivo',
            icon: <Calendar size={24} />,
            image: '/fejunavi.png'
        },
        {
            title: 'Turismo de Negócios e Agroindústria',
            desc: 'Como Capital do Conesul, a cidade atrai executivos, pesquisadores e investidores do agronegócio internacional. Com presença da Copasul, cooperativas de crédito e usinas de bioenergia, Naviraí é polo irradiador de inovação tecnológica no campo.',
            badge: 'Economia & Negócios',
            icon: <Building2 size={24} />,
            image: '/colonizacao_1952.png'
        },
        {
            title: 'Urbanismo Radial e Praça Central',
            desc: 'Concebida em traçado de teia de aranha planejado em 1952, a malha viária converge para a arborizada Praça Central Euclides Fabris e a Catedral Nossa Senhora de Fátima, proporcionando caminhabilidade e agradável convivência comunitária.',
            badge: 'Patrimônio Urbano',
            icon: <Compass size={24} />,
            image: '/praca_central.png'
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-(--color-background)">
            <Header />

            <main className="grow">
                {/* --- Hero Section Imersivo --- */}
                <section className="relative h-[45vh] md:h-[52vh] w-full overflow-hidden">
                    <img 
                        src="/parque_cumandai.png" 
                        alt="Parque Municipal de Naviraí" 
                        className="w-full h-full object-cover transform scale-105 animate-subtle-zoom"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#1a1208]/90 via-black/45 to-black/60 flex flex-col justify-center items-center text-center px-4 pt-6">
                        <span className="text-amber-400 font-bold tracking-[0.25em] uppercase text-xs md:text-sm mb-3 flex items-center gap-2">
                            <BarChart3 size={15} />
                            Perfil do Município
                        </span>
                        <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-md">
                            Dados Turísticos de Naviraí
                        </h1>
                        <p className="text-[#f0e6d6] text-sm md:text-lg max-w-2xl font-light leading-relaxed">
                            Indicadores geográficos, vocações ecológicas, pesca esportiva e o potencial da Capital do Conesul.
                        </p>
                        <div className="w-20 h-1 bg-amber-400 rounded-full mt-5"></div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

                    {/* Grade de Indicadores Rápidos */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 -mt-24 relative z-20">
                        {indicators.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="bg-white dark:bg-[#241a06] rounded-2xl p-5 shadow-xl border border-[#ede0d8] dark:border-[#3a2e1a] flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
                                    {item.icon}
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a7968] dark:text-[#c5b49e] mb-1">
                                    {item.label}
                                </span>
                                <span className="text-xl md:text-2xl font-black text-[#241a06] dark:text-[#f0e6d6]">
                                    {item.value}
                                </span>
                                <span className="text-[11px] text-[#8a7968] dark:text-[#c5b49e] mt-1">
                                    {item.detail}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Pilares do Turismo de Naviraí */}
                    <div className="space-y-10">
                        <div className="text-center md:text-left">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs md:text-sm">
                                Segmentos em Evidência
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-[#241a06] dark:text-[#f0e6d6] mt-1">
                                Os Pilares Turísticos da Cidade
                            </h2>
                            <p className="text-[#5a4d3e] dark:text-[#c5b49e] text-sm md:text-base max-w-3xl mt-2 leading-relaxed">
                                Naviraí combina a força do agronegócio de ponta com belezas fluviais exuberantes, rica culinária e um calendário de festividades que movimenta todo o sul de Mato Grosso do Sul.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {pillars.map((pillar, idx) => (
                                <div 
                                    key={idx} 
                                    className="bg-white dark:bg-[#241a06] rounded-3xl overflow-hidden shadow-lg border border-[#ede0d8] dark:border-[#3a2e1a] flex flex-col group hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <img 
                                            src={pillar.image} 
                                            alt={pillar.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-[#1a1208]/90 text-emerald-700 dark:text-emerald-400 backdrop-blur-xs border border-white/20">
                                                {pillar.icon}
                                                {pillar.badge}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-7 flex flex-col justify-between grow">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] mb-3">
                                                {pillar.title}
                                            </h3>
                                            <p className="text-sm text-[#5a4d3e] dark:text-[#c5b49e] leading-relaxed text-justify">
                                                {pillar.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Infraestrutura de Suporte ao Visitante */}
                    <div className="bg-[#241a06] dark:bg-[#110d04] text-[#f0e6d6] rounded-3xl p-8 md:p-12 shadow-xl border border-white/10">
                        <div className="max-w-3xl mx-auto text-center mb-10">
                            <span className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-2 block">
                                Hospitalidade e Serviços
                            </span>
                            <h3 className="text-2xl md:text-4xl font-black mb-4">
                                Infraestrutura Completa para Você
                            </h3>
                            <p className="text-[#d7cbbe] text-sm md:text-base leading-relaxed">
                                Estrutura pronta para acolher turistas a lazer, pescadores esportivos e profissionais corporativos.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-[#2e2310] p-6 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                                    <Hotel size={24} />
                                </div>
                                <h4 className="font-bold text-lg text-white mb-2">Hospedagem Qualificada</h4>
                                <p className="text-xs text-[#c5b49e] leading-relaxed">
                                    Mais de 500 leitos em hotéis executivos, pousadas acolhedoras e áreas de camping ao ar livre.
                                </p>
                                <Link to="/acomodacoes" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline mt-4">
                                    Ver Acomodações <ArrowRight size={13} />
                                </Link>
                            </div>

                            <div className="bg-[#2e2310] p-6 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                                    <Utensils size={24} />
                                </div>
                                <h4 className="font-bold text-lg text-white mb-2">Gastronomia Regional</h4>
                                <p className="text-xs text-[#c5b49e] leading-relaxed">
                                    Churrascarias típicas, peixarias na brasa, pizzarias tradicionais no centro e charmosas cafeterias.
                                </p>
                                <Link to="/restaurantes" className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline mt-4">
                                    Ver Onde Comer <ArrowRight size={13} />
                                </Link>
                            </div>

                            <div className="bg-[#2e2310] p-6 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                                    <Compass size={24} />
                                </div>
                                <h4 className="font-bold text-lg text-white mb-2">Pontos Turísticos</h4>
                                <p className="text-xs text-[#c5b49e] leading-relaxed">
                                    Monumentos históricos, artesanato local, praças urbanas, parques e pesqueiros em toda a extensão do município.
                                </p>
                                <Link to="/atracoes" className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:underline mt-4">
                                    Explorar Atrações <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

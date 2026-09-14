import { useState } from 'react';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { 
    Navigation, 
    Car, 
    Bus, 
    Plane, 
    MapPin, 
    Clock, 
    ExternalLink, 
    ShieldCheck, 
    Fuel, 
    ArrowRight,
    Compass
} from 'lucide-react';

interface DistanceItem {
    city: string;
    state: string;
    distance: string;
    time: string;
    route: string;
}

const DISTANCES: DistanceItem[] = [
    { city: 'Dourados', state: 'MS', distance: '130 km', time: '1h 45min', route: 'BR-163' },
    { city: 'Mundo Novo (Fronteira PY)', state: 'MS', distance: '120 km', time: '1h 30min', route: 'BR-163' },
    { city: 'Umuarama', state: 'PR', distance: '165 km', time: '2h 15min', route: 'BR-163 / MS-487' },
    { city: 'Cascavel', state: 'PR', distance: '245 km', time: '3h 15min', route: 'BR-163 / BR-272' },
    { city: 'Maringá', state: 'PR', distance: '250 km', time: '3h 30min', route: 'MS-141 / PR-323' },
    { city: 'Campo Grande (Capital)', state: 'MS', distance: '360 km', time: '4h 30min', route: 'BR-163' },
    { city: 'Foz do Iguaçu', state: 'PR', distance: '380 km', time: '5h 00min', route: 'BR-163 / BR-277' },
    { city: 'Curitiba', state: 'PR', distance: '650 km', time: '8h 30min', route: 'PR-323 / BR-376' },
    { city: 'São Paulo', state: 'SP', distance: '900 km', time: '11h 00min', route: 'MS-141 / SP-270' }
];

export default function ComoChegar() {
    const [searchCity, setSearchCity] = useState('');

    const filteredDistances = DISTANCES.filter(d => 
        d.city.toLowerCase().includes(searchCity.toLowerCase()) ||
        d.state.toLowerCase().includes(searchCity.toLowerCase()) ||
        d.route.toLowerCase().includes(searchCity.toLowerCase())
    );

    const openGoogleMaps = () => {
        window.open('https://www.google.com/maps/dir/?api=1&destination=Navirai+-+MS', '_blank');
    };

    const openWaze = () => {
        window.open('https://waze.com/ul?q=Navirai%20MS', '_blank');
    };

    return (
        <div className="flex flex-col min-h-screen bg-(--color-background)">
            <Header />

            <main className="grow">
                {/* --- Hero Section Imersivo --- */}
                <section className="relative h-[45vh] md:h-[52vh] w-full overflow-hidden">
                    <img 
                        src="/araras.png" 
                        alt="Portal de Entrada de Naviraí" 
                        className="w-full h-full object-cover transform scale-105 animate-subtle-zoom"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#1a1208]/90 via-black/45 to-black/60 flex flex-col justify-center items-center text-center px-4 pt-6">
                        <span className="text-amber-400 font-bold tracking-[0.25em] uppercase text-xs md:text-sm mb-3 flex items-center gap-2">
                            <Navigation size={15} />
                            Guia de Acesso e Mobilidade
                        </span>
                        <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-md">
                            Como Chegar a Naviraí
                        </h1>
                        <p className="text-[#f0e6d6] text-sm md:text-lg max-w-2xl font-light leading-relaxed">
                            Estrategicamente conectada pelo eixo da BR-163 e rodovias estaduais ao centro-sul do Brasil e ao Mercosul.
                        </p>
                        <div className="w-20 h-1 bg-amber-400 rounded-full mt-5"></div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
                    
                    {/* Botões Rápidos de Rota GPS */}
                    <div className="bg-white dark:bg-[#241a06] rounded-3xl p-6 md:p-8 shadow-xl border border-[#ede0d8] dark:border-[#3a2e1a] -mt-24 relative z-20 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                <Compass size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-[#241a06] dark:text-[#f0e6d6]">
                                    Iniciar Navegação GPS Direta
                                </h3>
                                <p className="text-xs md:text-sm text-[#8a7968] dark:text-[#c5b49e]">
                                    Traçar rota em tempo real a partir da sua localização atual
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={openGoogleMaps}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md hover:shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
                            >
                                <ExternalLink size={16} />
                                Google Maps
                            </button>
                            <button
                                onClick={openWaze}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md hover:shadow-sky-600/30 transition-all hover:scale-105 cursor-pointer"
                            >
                                <ExternalLink size={16} />
                                Waze
                            </button>
                        </div>
                    </div>

                    {/* Meios de Transporte: Carro, Ônibus e Avião */}
                    <div className="space-y-8">
                        <div className="text-center md:text-left">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs md:text-sm">
                                Principais Modalidades
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-[#241a06] dark:text-[#f0e6d6] mt-1">
                                Como Viajar para Naviraí
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            {/* De Carro */}
                            <div className="bg-white dark:bg-[#241a06] rounded-2xl p-7 shadow-lg border border-[#ede0d8] dark:border-[#3a2e1a] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                                <div>
                                    <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                                        <Car size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] mb-3">
                                        De Carro / Rodoviário
                                    </h3>
                                    <ul className="space-y-3 text-sm text-[#5a4d3e] dark:text-[#c5b49e] leading-relaxed">
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-emerald-600 shrink-0">•</span>
                                            <span><strong>BR-163:</strong> Rodovia federal pedagiada (CCR MSVia) com pista sinalizada, socorro 24h e postos de apoio.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-emerald-600 shrink-0">•</span>
                                            <span><strong>MS-141:</strong> Ligação direta a Ivinhema, Vale do Ivinhema e rota rápida para o estado de São Paulo.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-emerald-600 shrink-0">•</span>
                                            <span><strong>MS-180:</strong> Rota de conexão com Iguatemi e fronteira com o Paraná via Porto Camargo (MS-487).</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-6 pt-4 border-t border-[#ede0d8] dark:border-[#3a2e1a] text-xs text-[#8a7968] dark:text-[#c5b49e] flex items-center gap-1.5">
                                    <ShieldCheck size={14} className="text-emerald-500" />
                                    Posto da Polícia Rodoviária Federal no trecho da BR-163
                                </div>
                            </div>

                            {/* De Ônibus */}
                            <div className="bg-white dark:bg-[#241a06] rounded-2xl p-7 shadow-lg border border-[#ede0d8] dark:border-[#3a2e1a] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                                <div>
                                    <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                                        <Bus size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] mb-3">
                                        Terminal Rodoviário
                                    </h3>
                                    <p className="text-sm text-[#5a4d3e] dark:text-[#c5b49e] leading-relaxed mb-4">
                                        O Terminal Rodoviário de Naviraí recebe linhas interestaduais e intermunicipais diárias com partidas de Campo Grande, Dourados, Curitiba, Maringá, Cascavel e São Paulo.
                                    </p>
                                    <div className="bg-[#f5ede5] dark:bg-[#2e2310] p-3.5 rounded-xl border border-[#ede0d8] dark:border-[#3a2e1a] text-xs space-y-1 text-[#5a4d3e] dark:text-[#f0e6d6]">
                                        <p><strong>Principais Empresas:</strong> Viação Motta, Expresso Queiroz, Eucatur, Unesul, Cruzeiro do Sul.</p>
                                        <p><strong>Localização:</strong> Av. Dourados — com ponto de táxi e motoristas de aplicativo 24 horas.</p>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-[#ede0d8] dark:border-[#3a2e1a] text-xs text-[#8a7968] dark:text-[#c5b49e] flex items-center gap-1.5">
                                    <MapPin size={14} className="text-amber-500" />
                                    A 5 minutos do centro da cidade
                                </div>
                            </div>

                            {/* De Avião */}
                            <div className="bg-white dark:bg-[#241a06] rounded-2xl p-7 shadow-lg border border-[#ede0d8] dark:border-[#3a2e1a] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                                <div>
                                    <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                                        <Plane size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#241a06] dark:text-[#f0e6d6] mb-3">
                                        Aeroportos de Apoio
                                    </h3>
                                    <ul className="space-y-3 text-sm text-[#5a4d3e] dark:text-[#c5b49e] leading-relaxed">
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">•</span>
                                            <div>
                                                <strong>Aeroporto de Dourados (DOU):</strong>
                                                <p className="text-xs text-[#8a7968] dark:text-[#c5b49e]">~130 km de distância (voos regionais Azul / Gol).</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">•</span>
                                            <div>
                                                <strong>Aeroporto de Maringá (MGF):</strong>
                                                <p className="text-xs text-[#8a7968] dark:text-[#c5b49e]">~250 km de distância (voos frequentes para SP e Curitiba).</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">•</span>
                                            <div>
                                                <strong>Aeroporto de Campo Grande (CGR):</strong>
                                                <p className="text-xs text-[#8a7968] dark:text-[#c5b49e]">~360 km de distância (hub internacional e conexões para todo o país).</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-6 pt-4 border-t border-[#ede0d8] dark:border-[#3a2e1a] text-xs text-[#8a7968] dark:text-[#c5b49e] flex items-center gap-1.5">
                                    <Clock size={14} className="text-amber-500" />
                                    Locadoras de veículos disponíveis nos aeroportos
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Tabela de Distâncias Interativa */}
                    <div className="bg-white dark:bg-[#241a06] rounded-3xl p-6 md:p-10 shadow-xl border border-[#ede0d8] dark:border-[#3a2e1a]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs md:text-sm">
                                    Quadro Rodoviário
                                </span>
                                <h3 className="text-2xl md:text-3xl font-black text-[#241a06] dark:text-[#f0e6d6] mt-1">
                                    Distâncias de Naviraí a Outros Centros
                                </h3>
                            </div>
                            <div className="w-full md:w-72">
                                <input
                                    type="text"
                                    placeholder="Filtrar por cidade, estado ou rodovia..."
                                    value={searchCity}
                                    onChange={(e) => setSearchCity(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-[#ede0d8] dark:border-[#3a2e1a] bg-[#f5ede5] dark:bg-[#2e2310] text-[#241a06] dark:text-[#f0e6d6] text-sm focus:outline-hidden focus:border-emerald-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#ede0d8] dark:border-[#3a2e1a] text-xs uppercase tracking-wider text-[#8a7968] dark:text-[#c5b49e] font-bold bg-[#f5ede5]/60 dark:bg-[#2e2310]/60">
                                        <th className="py-3 px-4">Origem / Destino</th>
                                        <th className="py-3 px-4">Distância</th>
                                        <th className="py-3 px-4">Tempo Estimado</th>
                                        <th className="py-3 px-4">Rodovia Principal</th>
                                        <th className="py-3 px-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#ede0d8]/80 dark:divide-[#3a2e1a] text-sm">
                                    {filteredDistances.length > 0 ? (
                                        filteredDistances.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-[#f5ede5]/50 dark:hover:bg-[#2e2310]/50 transition-colors">
                                                <td className="py-3.5 px-4 font-semibold text-[#241a06] dark:text-[#f0e6d6]">
                                                    {item.city} - <span className="text-emerald-600 dark:text-emerald-400">{item.state}</span>
                                                </td>
                                                <td className="py-3.5 px-4 text-[#5a4d3e] dark:text-[#c5b49e] font-medium">
                                                    {item.distance}
                                                </td>
                                                <td className="py-3.5 px-4 text-[#5a4d3e] dark:text-[#c5b49e]">
                                                    {item.time}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f5ede5] dark:bg-[#2e2310] text-[#241a06] dark:text-[#f0e6d6]">
                                                        {item.route}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <a
                                                        href={`https://www.google.com/maps/dir/Navirai+-+MS/${encodeURIComponent(item.city + ' - ' + item.state)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                                                    >
                                                        Ver Rota
                                                        <ArrowRight size={13} />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-[#8a7968] dark:text-[#c5b49e]">
                                                Nenhum destino encontrado com o termo informado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Dicas para o Motorista */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-emerald-500/10 dark:bg-[#241a06] rounded-2xl p-7 border border-emerald-500/20 dark:border-[#3a2e1a]">
                            <h4 className="font-bold text-lg text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
                                <Fuel size={20} />
                                Postos e Abastecimento na BR-163
                            </h4>
                            <p className="text-sm text-[#5a4d3e] dark:text-[#c5b49e] leading-relaxed">
                                A rodovia BR-163 conta com ampla rede de postos de combustível de bandeira 24 horas, restaurantes, lojas de conveniência e oficinas mecânicas ao longo de todo o percurso entre Campo Grande, Dourados e Naviraí.
                            </p>
                        </div>

                        <div className="bg-amber-500/10 dark:bg-[#241a06] rounded-2xl p-7 border border-amber-500/20 dark:border-[#3a2e1a]">
                            <h4 className="font-bold text-lg text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                                <ShieldCheck size={20} />
                                Conexão Mercosul e Compras no Paraguai
                            </h4>
                            <p className="text-sm text-[#5a4d3e] dark:text-[#c5b49e] leading-relaxed">
                                Naviraí fica a apenas 140 km de Salto del Guairá (PY), famosa região de compras de importados e turismo comercial, sendo uma excelente opção de parada estratégica para viajantes que vêm do Paraná e São Paulo.
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

function GithubIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    );
}

function InstagramIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

const footerLinks = {
    naviraí: [
        { label: "Como Chegar", href: "/como-chegar" },
        { label: "História", href: "/historia" },
        { label: "Dados Turísticos", href: "/dados-turisticos" },
        { label: "Investir", href: "/investir" },
    ],
    ondeDormir: [
        { label: "Hotéis", href: "/acomodacoes?tipo=Hotel" },
        { label: "Pousadas", href: "/acomodacoes?tipo=Pousada" },
        { label: "Área de Camping", href: "/acomodacoes?tipo=Área de Camping" },
        { label: "Flat", href: "/acomodacoes?tipo=Flat" },
    ],
    maraVilhar: [
        { label: "Praças e Parques", href: "/atracoes?tipo=Praça e Parques" },
        { label: "Monumentos", href: "/atracoes?tipo=Monumentos" },
        { label: "Museus", href: "/atracoes?tipo=Museus" },
        { label: "Pesqueiros", href: "/atracoes?tipo=Pesqueiro" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-[#241a06] dark:bg-[#110d04] text-[#f0e6d6]/75">

            {/* Top band — newsletter teaser */}
            <div
                className="border-b"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h3
                            className="text-xl font-black text-white mb-1"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            Descubra Naviraí
                        </h3>
                        <p className="text-sm" style={{ color: 'rgba(240,230,214,0.55)' }}>
                            Fique por dentro de eventos, novidades e roteiros da Capital do Conesul.
                        </p>
                    </div>
                    <Link
                        to="/contato"
                        className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-[#241a06] transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #e29100, #febb06)' }}
                    >
                        Fale Conosco
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </div>

            {/* Main link grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10">

                {/* Brand column */}
                <div className="col-span-2 sm:col-span-2 md:col-span-1">
                    <Link to="/" className="inline-block mb-4">
                        <span
                            className="text-2xl font-black text-white"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            <span className="text-(--color-forest-green-600)">VISIT</span>Naviraí
                        </span>
                    </Link>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(240,230,214,0.55)' }}>
                        O guia oficial de turismo, cultura, investimento e serviços de Naviraí — Capital do Conesul.
                    </p>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} style={{ color: '#febb06' }} />
                        <span className="text-xs" style={{ color: 'rgba(240,230,214,0.45)' }}>
                            Naviraí, MS — Brasil
                        </span>
                    </div>

                    {/* Social icons */}
                    <div className="flex gap-3 mt-5">
                        <a
                            href="https://github.com/elitinho123456/visitnavirai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                            style={{ background: 'rgba(255,255,255,0.08)' }}
                            aria-label="GitHub"
                        >
                            <GithubIcon size={16} className="text-white/70" />
                        </a>
                        <a
                            href="#"
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                            style={{ background: 'rgba(255,255,255,0.08)' }}
                            aria-label="Instagram"
                        >
                            <InstagramIcon size={16} className="text-white/70" />
                        </a>
                    </div>
                </div>

                {/* Naviraí */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-white/50">Naviraí</h4>
                    <ul className="space-y-3">
                        {footerLinks.naviraí.map((l) => (
                            <li key={l.label}>
                                <Link
                                    to={l.href}
                                    className="text-sm transition-colors hover:text-white"
                                    style={{ color: 'rgba(240,230,214,0.60)' }}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Onde Dormir */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-white/50">Onde Dormir</h4>
                    <ul className="space-y-3">
                        {footerLinks.ondeDormir.map((l) => (
                            <li key={l.label}>
                                <Link
                                    to={l.href}
                                    className="text-sm transition-colors hover:text-white"
                                    style={{ color: 'rgba(240,230,214,0.60)' }}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* O Que Visitar */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-white/50">O Que Visitar</h4>
                    <ul className="space-y-3">
                        {footerLinks.maraVilhar.map((l) => (
                            <li key={l.label}>
                                <Link
                                    to={l.href}
                                    className="text-sm transition-colors hover:text-white"
                                    style={{ color: 'rgba(240,230,214,0.60)' }}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div
                className="border-t"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
                    style={{ color: 'rgba(240,230,214,0.35)' }}>
                    <p>© 2026 VISITNaviraí. Todos os direitos reservados.</p>
                    <p>
                        Desenvolvido por{' '}
                        <a href="https://github.com/elitinho123456" target="_blank" rel="noopener noreferrer"
                            className="font-semibold text-white/50 hover:text-white transition-colors">
                            Elitinho
                        </a>
                        {' '}&amp;{' '}
                        <a href="https://github.com/thiagomartins2611" target="_blank" rel="noopener noreferrer"
                            className="font-semibold text-white/50 hover:text-white transition-colors">
                            Thiago CM
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
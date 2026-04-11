import { Link } from "react-router-dom";
import { MapPin, Github, Instagram, ArrowRight } from "lucide-react";

const footerLinks = {
    naviraí: [
        { label: "Como Chegar", href: "#" },
        { label: "História", href: "/historia" },
        { label: "Dados Turísticos", href: "#" },
        { label: "Investir", href: "/investir" },
    ],
    ondeDormir: [
        { label: "Hotéis", href: "/acomodacoes?tipo=Hotel" },
        { label: "Pousadas", href: "/acomodacoes?tipo=Pousada" },
        { label: "Área de Camping", href: "/acomodacoes?tipo=Área de Camping" },
        { label: "Flat", href: "/acomodacoes?tipo=Flat" },
    ],
    maraVilhar: [
        { label: "Praças e Parques", href: "#" },
        { label: "Monumentos", href: "#" },
        { label: "Museus", href: "#" },
        { label: "Pesqueiros", href: "#" },
    ],
};

export default function Footer() {
    return (
        <footer style={{ background: 'var(--md-on-surface, #241a06)', color: 'rgba(240,230,214,0.75)' }}>

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
                            <Github size={16} className="text-white/70" />
                        </a>
                        <a
                            href="#"
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                            style={{ background: 'rgba(255,255,255,0.08)' }}
                            aria-label="Instagram"
                        >
                            <Instagram size={16} className="text-white/70" />
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
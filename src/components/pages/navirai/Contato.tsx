import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { toast } from "@/utils/toast";
import { 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    Send, 
    MessageSquare, 
    ChevronDown, 
    CheckCircle2, 
    ExternalLink,
    HelpCircle,
    Building2,
    Compass
} from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "Como cadastrar meu hotel, restaurante ou atração no Visit Naviraí?",
        answer: "O cadastro para empresas e pontos de interesse do município de Naviraí é gratuito. Você pode entrar em contato conosco pelo formulário abaixo ou diretamente com a Gerência de Turismo da SEDETUR com os dados do seu estabelecimento."
    },
    {
        question: "Como solicitar apoio ou divulgar um evento na agenda da cidade?",
        answer: "Para cadastrar eventos esportivos, culturais, gastronômicos ou feiras, envie as informações (data, local, programação e banner oficial) com pelo menos 15 dias de antecedência para turismo@navirai.ms.gov.br."
    },
    {
        question: "Onde posso obter mapas turísticos e guias impressos da cidade?",
        answer: "Você pode retirar o guia impresso oficial diretamente na sede da SEDETUR (Praça Prefeito Euclides Antonio Fabris) ou no Centro de Informações Turísticas durante os horários de expediente."
    },
    {
        question: "Como agendar visitas guiadas ou passeios em áreas de preservação?",
        answer: "Para passeios e roteiros pelo Parque Estadual das Várzeas do Rio Ivinhema, Rio Amambai ou Porto Caiuá, recomendamos o agendamento prévio com os condutores ambientais e operadores credenciados indicados na seção de Atrações."
    }
];

export default function Contato() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "Dúvidas Gerais",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast.error("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        setIsSubmitting(true);

        // Simulação de envio com feedback amigável
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.");
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "Dúvidas Gerais",
                message: ""
            });
        }, 800);
    };

    return (
        <div className="flex flex-col min-h-screen bg-(--color-background) text-(--color-text-body) transition-colors duration-200">
            <Header />

            <main className="grow">
                {/* ═══ HERO SECTION ═══ */}
                <section className="relative h-96 md:h-120 w-full overflow-hidden flex items-center justify-center">
                    <img 
                        src="/rio_amambai.png" 
                        alt="Paisagem natural de Naviraí" 
                        className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-75 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
                    
                    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-sm font-semibold tracking-wider uppercase mb-4">
                            <Compass size={16} /> Canais Oficiais de Atendimento
                        </span>
                        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
                            Fale Conosco
                        </h1>
                        <p className="text-emerald-100 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            Precisa de suporte turístico, informações sobre a cidade ou quer divulgar seu negócio em Naviraí? Estamos prontos para ajudar você.
                        </p>
                    </div>
                </section>

                {/* ═══ MAIN CONTENT CONTAINER ═══ */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    
                    {/* ═══ CONTACT CARDS GRID ═══ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20 md:-mt-24 relative z-20 mb-16">
                        
                        {/* CARD 1: Atendimento Presencial */}
                        <div className="bg-white dark:bg-[#241a06] p-6 rounded-2xl shadow-xl border border-[#ede0d8] dark:border-[#3a2e1a] hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <Building2 size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-[#241a06] dark:text-[#f0e6d6] mb-2">
                                    SEDETUR Naviraí
                                </h3>
                                <p className="text-sm text-[#5a4d3e] dark:text-[#c5b49e] leading-relaxed mb-4">
                                    Secretaria Municipal de Desenvolvimento Econômico e Turismo.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-[#ede0d8] dark:border-[#3a2e1a] text-xs text-[#8a7968] dark:text-[#c5b49e]">
                                <p className="font-medium text-[#241a06] dark:text-[#f0e6d6] mb-1 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-emerald-500 shrink-0" />
                                    Praça Pref. Euclides Fabris, 343
                                </p>
                                <p>Centro — Naviraí, MS</p>
                            </div>
                        </div>

                        {/* CARD 2: Telefones e WhatsApp */}
                        <div className="bg-white dark:bg-[#241a06] p-6 rounded-2xl shadow-xl border border-[#ede0d8] dark:border-[#3a2e1a] hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <Phone size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-[#241a06] dark:text-[#f0e6d6] mb-2">
                                    Telefone & WhatsApp
                                </h3>
                                <p className="text-sm text-[#5a4d3e] dark:text-[#c5b49e] leading-relaxed mb-4">
                                    Suporte direto com nosso plantão de atendimento e informações.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-[#ede0d8] dark:border-[#3a2e1a]">
                                <a 
                                    href="https://wa.me/556734611234" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                                >
                                    (67) 3461-1234
                                    <ExternalLink size={14} />
                                </a>
                                <p className="text-xs text-[#8a7968] dark:text-[#c5b49e] mt-1">Atendimento ao Cidadão</p>
                            </div>
                        </div>

                        {/* CARD 3: E-mail Oficial */}
                        <div className="bg-white dark:bg-[#241a06] p-6 rounded-2xl shadow-xl border border-[#ede0d8] dark:border-[#3a2e1a] hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <Mail size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-[#241a06] dark:text-[#f0e6d6] mb-2">
                                    E-mail Oficial
                                </h3>
                                <p className="text-sm text-[#5a4d3e] dark:text-[#c5b49e] leading-relaxed mb-4">
                                    Envie ofícios, solicitações, sugestões ou materiais de eventos.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-[#ede0d8] dark:border-[#3a2e1a]">
                                <a 
                                    href="mailto:turismo@navirai.ms.gov.br" 
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline break-all"
                                >
                                    turismo@navirai.ms.gov.br
                                    <ExternalLink size={14} />
                                </a>
                                <p className="text-xs text-[#8a7968] dark:text-[#c5b49e] mt-1">Resposta em até 48h úteis</p>
                            </div>
                        </div>

                        {/* CARD 4: Horários de Atendimento */}
                        <div className="bg-white dark:bg-[#241a06] p-6 rounded-2xl shadow-xl border border-[#ede0d8] dark:border-[#3a2e1a] hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <Clock size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-[#241a06] dark:text-[#f0e6d6] mb-2">
                                    Horário de Expediente
                                </h3>
                                <p className="text-sm text-[#5a4d3e] dark:text-[#c5b49e] leading-relaxed mb-4">
                                    Atendimento ao público presencial e administrativo.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-[#ede0d8] dark:border-[#3a2e1a] text-xs text-[#5a4d3e] dark:text-[#c5b49e]">
                                <p className="font-semibold text-[#241a06] dark:text-[#f0e6d6]">Segunda a Sexta-feira</p>
                                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">07:00 às 13:00</p>
                                <p className="text-[#8a7968] dark:text-[#c5b49e] text-xs mt-0.5">(Horário de Mato Grosso do Sul)</p>
                            </div>
                        </div>

                    </div>

                    {/* ═══ FORM & DIRECT SUPPORT SECTION ═══ */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
                        
                        {/* FORM COLUMN (7 cols) */}
                        <div className="lg:col-span-7 bg-white dark:bg-[#241a06] p-8 sm:p-10 rounded-3xl shadow-xl border border-[#ede0d8] dark:border-[#3a2e1a]">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-[#241a06] dark:text-[#f0e6d6]">
                                        Envie sua Mensagem
                                    </h2>
                                    <p className="text-sm text-[#8a7968] dark:text-[#c5b49e]">
                                        Preencha o formulário abaixo que retornaremos em breve.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#241a06] dark:text-[#f0e6d6] mb-2">
                                            Nome Completo *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Ex: João da Silva"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-[#ede0d8] dark:border-[#3a2e1a] bg-[#f5ede5] dark:bg-[#2e2310] text-[#241a06] dark:text-[#f0e6d6] placeholder-[#8a7968] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#241a06] dark:text-[#f0e6d6] mb-2">
                                            E-mail *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="seuemail@exemplo.com"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-[#ede0d8] dark:border-[#3a2e1a] bg-[#f5ede5] dark:bg-[#2e2310] text-[#241a06] dark:text-[#f0e6d6] placeholder-[#8a7968] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#241a06] dark:text-[#f0e6d6] mb-2">
                                            Telefone / WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="(67) 99999-9999"
                                            className="w-full px-4 py-3 rounded-xl border border-[#ede0d8] dark:border-[#3a2e1a] bg-[#f5ede5] dark:bg-[#2e2310] text-[#241a06] dark:text-[#f0e6d6] placeholder-[#8a7968] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#241a06] dark:text-[#f0e6d6] mb-2">
                                            Assunto
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-[#ede0d8] dark:border-[#3a2e1a] bg-[#f5ede5] dark:bg-[#2e2310] text-[#241a06] dark:text-[#f0e6d6] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                        >
                                            <option value="Dúvidas Gerais">Dúvidas Gerais</option>
                                            <option value="Cadastro no Portal">Cadastro no Portal (Hotel/Restaurante/Serviço)</option>
                                            <option value="Divulgação de Evento">Divulgação de Evento</option>
                                            <option value="Roteiros e Guias">Roteiros e Guias Turísticos</option>
                                            <option value="Parcerias e Imprensa">Parcerias e Imprensa</option>
                                            <option value="Sugestões ou Reclamações">Sugestões ou Reclamações</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#241a06] dark:text-[#f0e6d6] mb-2">
                                        Sua Mensagem *
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Descreva detalhadamente como podemos te ajudar..."
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-[#ede0d8] dark:border-[#3a2e1a] bg-[#f5ede5] dark:bg-[#2e2310] text-[#241a06] dark:text-[#f0e6d6] placeholder-[#8a7968] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] shadow-lg shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Enviando mensagem...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>Enviar Mensagem</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* SIDEBAR / HIGHLIGHTS (5 cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            
                            {/* Tourism Bureau Info Box */}
                            <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                                
                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-2">
                                    Portal Oficial
                                </span>
                                <h3 className="text-2xl font-bold mb-4">
                                    Prefeitura Municipal de Naviraí
                                </h3>
                                <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                                    Naviraí é polo econômico, universitário e turístico do Conesul de Mato Grosso do Sul. Nosso portal conecta turistas, investidores e moradores com o melhor da cidade.
                                </p>

                                <div className="space-y-3 text-sm text-emerald-100 border-t border-emerald-700/50 pt-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Apoio a hotéis, pousadas, restaurantes e atrativos locais</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Roteiros turísticos de pesca, ecoturismo e eventos esportivos</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Acolhimento aos investidores do agronegócio e indústria</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link
                                        to="/investir"
                                        className="px-5 py-2.5 rounded-full bg-white text-emerald-950 text-xs font-bold hover:bg-emerald-50 transition-colors inline-flex items-center gap-1.5 shadow"
                                    >
                                        Invista em Naviraí
                                        <ExternalLink size={13} />
                                    </Link>
                                    <Link
                                        to="/historia"
                                        className="px-5 py-2.5 rounded-full bg-emerald-700/60 hover:bg-emerald-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-emerald-600/40"
                                    >
                                        Conheça nossa História
                                    </Link>
                                </div>
                            </div>

                            {/* Location / Como Chegar Card */}
                            <div className="bg-white dark:bg-[#241a06] p-6 sm:p-8 rounded-3xl shadow-xl border border-[#ede0d8] dark:border-[#3a2e1a]">
                                <h4 className="font-bold text-lg text-[#241a06] dark:text-[#f0e6d6] mb-3 flex items-center gap-2">
                                    <MapPin size={20} className="text-emerald-500" />
                                    Localização e Acesso
                                </h4>
                                <p className="text-sm text-[#5a4d3e] dark:text-[#c5b49e] leading-relaxed mb-4">
                                    Naviraí está estrategicamente localizada às margens da rodovia BR-163, a aproximadamente 360 km da capital Campo Grande e próxima à divisa com o Paraná.
                                </p>
                                
                                <div className="bg-[#f5ede5]/60 dark:bg-[#2e2310]/60 p-4 rounded-2xl border border-[#ede0d8] dark:border-[#3a2e1a] space-y-2 text-xs text-[#5a4d3e] dark:text-[#c5b49e]">
                                    <div className="flex justify-between items-center py-1 border-b border-[#ede0d8] dark:border-[#3a2e1a]">
                                        <span className="font-semibold text-[#241a06] dark:text-[#f0e6d6]">Terminal Rodoviário:</span>
                                        <span>Av. Dourados, Naviraí - MS</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1 border-b border-[#ede0d8] dark:border-[#3a2e1a]">
                                        <span className="font-semibold text-[#241a06] dark:text-[#f0e6d6]">Aeroporto Regional mais próximo:</span>
                                        <span>Dourados (DOU) — ~130 km</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="font-semibold text-[#241a06] dark:text-[#f0e6d6]">Aeroporto Internacional:</span>
                                        <span>Campo Grande (CGR) — ~360 km</span>
                                    </div>
                                </div>

                                <a 
                                    href="https://maps.google.com/?q=Navirai,+MS"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                                >
                                    Ver no Google Maps
                                    <ExternalLink size={15} />
                                </a>
                            </div>

                        </div>

                    </div>

                    {/* ═══ FAQ ACCORDION SECTION ═══ */}
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                                <HelpCircle size={15} /> Dúvidas Frequentes
                            </span>
                            <h2 className="text-3xl font-extrabold text-[#241a06] dark:text-[#f0e6d6]">
                                Perguntas Mais Comuns
                            </h2>
                            <p className="text-[#8a7968] dark:text-[#c5b49e] text-sm mt-2">
                                Respostas rápidas para as principais dúvidas de visitantes e empreendedores locais.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div 
                                        key={index}
                                        className="bg-white dark:bg-[#241a06] rounded-2xl border border-[#ede0d8] dark:border-[#3a2e1a] overflow-hidden shadow-sm hover:shadow transition-shadow"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq(isOpen ? null : index)}
                                            className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-semibold text-[#241a06] dark:text-[#f0e6d6] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                        >
                                            <span className="text-base">{faq.question}</span>
                                            <ChevronDown 
                                                size={20} 
                                                className={`text-[#8a7968] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-emerald-500" : ""}`}
                                            />
                                        </button>
                                        {isOpen && (
                                            <div className="px-6 pb-5 text-sm text-[#5a4d3e] dark:text-[#c5b49e] leading-relaxed border-t border-[#ede0d8] dark:border-[#3a2e1a] pt-3">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}

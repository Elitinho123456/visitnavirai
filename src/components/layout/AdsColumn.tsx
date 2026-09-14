import React from 'react';
import { Link } from 'react-router-dom';

interface AdCardProps {
    title: string;
    description: string;
    link: string;
    color: string; // Ex: "border-red-500"
}

// Componente simples de Card de Anúncio
const AdCard: React.FC<AdCardProps> = ({ title, description, link, color }) => (
    <div className={`bg-white dark:bg-[#241a06] border border-[#ede0d8] dark:border-[#3a2e1a] rounded-xl p-4 shadow-md border-t-4 ${color} mb-5 transform hover:scale-[1.02] transition-all duration-300`}>
        <h4 className="font-bold text-sm md:text-base text-[#241a06] dark:text-[#f0e6d6]"> 
            {title}
        </h4>
        <p className="text-xs md:text-sm text-[#5a4d3e] dark:text-[#c5b49e] my-2 leading-relaxed">{description}</p>
        
        <Link to={link} className="inline-flex items-center text-xs font-bold text-(--color-primary) hover:underline transition-colors">
            Ver Oferta →
        </Link>
    </div>
);

// Componente da Coluna de Anúncios
const AdsColumn: React.FC<{ position: 'left' | 'right' }> = ({ position }) => {
    // Dados de exemplo para anúncios 
    const ads = [
        { 
            title: "Oportunidade de Emprego", 
            description: "Vagas abertas em diversas áreas. Cadastre seu currículo!", 
            link: "/empregos", 
            color: "border-red-500" 
        },
        { 
            title: "Novas Casas à Venda", 
            description: "Confira os melhores imóveis em Naviraí e região.", 
            link: "/imoveis", 
            color: "border-teal-500" 
        },
        { 
            title: "Eventos Culturais", 
            description: "A agenda completa de shows e exposições deste mês.", 
            link: "/event", 
            color: "border-orange-500" 
        },
    ];

    return (
        <div className={`sticky top-20 pt-4 pb-8 ${position === 'right' ? 'lg:pl-4' : 'lg:pr-4'}`}> 
            <h3 className="font-bold text-base md:text-lg mb-4 text-[#241a06] dark:text-[#f0e6d6]"> 
                {position === 'left' ? 'Anúncios Locais' : 'Parceiros em Destaque'}
            </h3>
            {ads.map((ad, index) => (
                <AdCard key={index} {...ad} />
            ))}
            
            <div className="text-center mt-6 p-3 border border-[#ede0d8] dark:border-[#3a2e1a] rounded-xl bg-[#f5ede5] dark:bg-[#241a06]">
                <p className="text-xs uppercase tracking-wider text-[#8a7968] dark:text-[#c5b49e] font-medium">Publicidade</p>
            </div>
        </div>
    );
};

export default AdsColumn;
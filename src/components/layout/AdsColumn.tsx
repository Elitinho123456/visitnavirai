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
    // CORREÇÃO: Removido text-(--color-secondary) e substituído por text-secondary (assumindo config do Tailwind)
    // O 'color' aqui refere-se à cor da borda, não ao texto.
    <div className={`bg-white rounded-xl p-4 shadow-lg border-t-4 ${color} mb-6 transform hover:scale-[1.02] transition-transform duration-300`}>
        <h4 className="font-bold text-md text-secondary"> 
            {title}
        </h4>
        <p className="text-sm text-gray-600 my-2">{description}</p>
        
        {/* CORREÇÃO: Removido text-(--color-primary) e substituído por text-primary (assumindo config do Tailwind) */}
        <Link to={link} className="text-xs font-semibold text-primary hover:underline">
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
            link: "/eventos", 
            color: "border-orange-500" 
        },
    ];

    return (
        // Nota: A classe `lg:pl-4` / `lg:pr-4` está correta para controle de padding.
        <div className={`sticky top-20 pt-4 pb-8 ${position === 'right' ? 'lg:pl-4' : 'lg:pr-4'}`}> 
            
            {/* CORREÇÃO: Removido text-(--color-secondary) e substituído por text-secondary */}
            <h3 className="font-bold text-lg mb-4 text-secondary"> 
                {position === 'left' ? 'Anúncios Locais' : 'Parceiros em Destaque'}
            </h3>
            {ads.map((ad, index) => (
                <AdCard key={index} {...ad} />
            ))}
            
            <div className="text-center mt-6 p-4 border rounded-xl bg-gray-50">
                <p className="text-sm text-gray-500">Publicidade</p>
            </div>
        </div>
    );
};

export default AdsColumn;
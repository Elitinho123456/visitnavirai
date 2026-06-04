export interface Hotel {
    id?: number | string;
    _id?: string;
    name: string;
    image: string;
    distance: string; // Distância do centro
    features: string[];
    highlight?: boolean;
    highlightExpiration?: string;
    latitude: number;
    longitude: number;
    socials?: {
        facebook?: string;
        instagram?: string;
        website?: string;
    };
    gallery?: string[];
    about?: {
        title?: string;
        subtitle?: string;
        desc?: string[];
    };
    accommodation?: {
        title?: string;
        image?: string;
        imageCaption?: string;
        desc?: string[];
    };
    policies?: {
        label?: string;
        title?: string;
        desc?: string;
    }[];
    amenities?: {
        title?: string;
        cards?: {
            icon?: string;
            title?: string;
            desc?: string;
        }[];
    };
    cta?: {
        title?: string;
        desc?: string;
    };
}

export interface Service extends Hotel {
    about?: {
        title?: string;
        subtitle?: string;
        desc?: string[];
    };
}

export interface Venue {
    id?: number | string;
    _id?: string;
    name: string;
    
    // Adicionei a categoria para facilitar o seu filtro na tela (Futebol, Basket, etc.)
    category?: 'Futebol' | 'Basket' | 'Vôlei' | 'Beisebol' | string; 
    
    image: string;
    distance: string; // Ex: '2km do centro'
    features: string[]; // Ex: ['Grama Sintética', 'Iluminação', 'Vestiário']
    highlight?: boolean;
    highlightExpiration?: string;
    latitude: number;
    longitude: number;
    
    socials?: {
        facebook?: string;
        instagram?: string;
        website?: string;
        whatsapp?: string; // Adicionei WhatsApp, muito comum para reservar quadras
    };
    
    gallery?: string[];
    
    about?: {
        title?: string;
        subtitle?: string;
        desc?: string[];
    };

    // ----------------------------------------------------
    // PROPRIEDADES ESPECÍFICAS DE ESPORTES (Substituindo as de Hotel)
    // ----------------------------------------------------

    // Substitui 'accommodation' (Acomodações) por 'courts' (Quadras/Campos)
    courts?: {
        title?: string;
        image?: string;
        imageCaption?: string;
        desc?: string[];
        type?: string; // Ex: 'Futebol Society', 'Quadra de Areia'
    };

    // Substitui 'policies' (Políticas do Hotel) por 'rules' (Regras do Local/Horários)
    rules?: {
        label?: string; // Ex: 'Cancelamento', 'Uso de Chuteira'
        title?: string;
        desc?: string;
    }[];

    // Substitui 'amenities' (Comodidades de quarto) por 'infrastructure' (Infraestrutura)
    infrastructure?: {
        title?: string; // Ex: 'O que o local oferece'
        cards?: {
            icon?: string; // Ex: 'Shower', 'Beer', 'Car' (Banheiros, Bar, Estacionamento)
            title?: string;
            desc?: string;
        }[];
    };

    cta?: {
        title?: string;
        desc?: string;
    };


    

}


export interface Restaurant {
    id?: number | string;
    _id?: string;
    name: string;
    
    // Categoria para ajudar nos filtros (ex: Pizzaria, Café, Hamburgueria, etc.)
    category?: 'Restaurante' | 'Café' | 'Pizzaria' | 'Lanchonete' | 'Bar' | string; 
    
    address?: string; // Endereço físico do local
    image: string;
    distance: string; // Ex: 'Centro' ou 'A 1km de você'
    features: string[]; // Ex: ['Música ao Vivo', 'Ar Condicionado', 'Delivery']
    highlight?: boolean;
    highlightExpiration?: string;
    latitude: number;
    longitude: number;
    
    socials?: {
        facebook?: string;
        instagram?: string;
        website?: string;
        whatsapp?: string;
    };
    
    gallery?: string[];
    
    about?: {
        title?: string;
        subtitle?: string;
        desc?: string[];
    };

    // ----------------------------------------------------
    // PROPRIEDADES ESPECÍFICAS DE GASTRONOMIA
    // ----------------------------------------------------

    // Substitui 'accommodation' (Hotel) / 'courts' (Esportes)
    specialties?: {
        title?: string; // Ex: 'Destaques da Casa'
        image?: string;
        imageCaption?: string;
        desc?: string[];
        type?: string; // Ex: 'Culinária Italiana', 'Frutos do Mar'
    };

    // Substitui 'policies' (Hotel) / 'rules' (Esportes)
    usefulInfo?: {
        icon?: string; // Para renderizar ícones dinamicamente
        label?: string; // Ex: 'Horário', 'Reservas', 'Dress Code'
        title?: string;
        desc?: string;
    }[];

    // Substitui 'amenities' (Hotel) e mantém o formato de 'infrastructure' de Esportes
    infrastructure?: {
        title?: string; // Ex: 'Comodidades'
        cards?: {
            icon?: string; // Ex: 'Wifi', 'Kids', 'Parking'
            title?: string; // Ex: 'Espaço Kids', 'Estacionamento Gratuito'
            desc?: string;
        }[];
    };

    cta?: {
        title?: string;
        desc?: string;
    };
}
import { type Hotel } from "../types/interfacesTypes";

const navItems = [
    {
        name: 'Naviraí',
        path: '/historia',
        subItems: [
            { name: 'Como Chegar', path: '#', label: 'Como Chegar' },
            { name: 'Dados Turísticos', path: '#', label: 'Dados Turísticos' },
            { name: 'História', path: '/historia', label: 'História' },
            { name: 'Investir', path: '/investir', label: 'Investir' },
        ],
    },
    {
        name: 'nav.where_to_sleep',
        path: '/acomodacoes',
        subItems: [
            { name: 'Hotéis', path: '/acomodacoes?tipo=Hotel', label: 'Hotéis' },
            { name: 'Pousadas', path: '/acomodacoes?tipo=Pousada', label: 'Pousadas' },
            { name: 'Área de Camping', path: '/acomodacoes?tipo=Área de Camping', label: 'Área de Camping' },
            { name: 'Flat', path: '/acomodacoes?tipo=Flat', label: 'Flat' },
        ],
    },
    {
        name: 'nav.what_to_visit',
        path: '#',
        subItems: [
            { name: 'Artesanatos', path: '#', label: 'Artesanatos' },
            { name: 'Compras', path: '#', label: 'Compras' },
            { name: 'Monumentos', path: '#', label: 'Monumentos' },
            { name: 'Museus', path: '#', label: 'Museus' },
            { name: 'Praça e Parques', path: '#', label: 'Praças e Parques' },
            { name: 'Rancho', path: '#', label: 'Rancho' },
            { name: 'Pesqueiro', path: '#', label: 'Pesqueiro' },
        ],
    },
    {
        name: 'nav.where_to_eat',
        path: '#',
        subItems: [
            { name: 'Bares', path: '#', label: 'Bares' },
            { name: 'Cafeterias', path: '#', label: 'Cafeterias' },
            { name: 'Lanches e Doces', path: '#', label: 'Lanches e Doces' },
            { name: 'Hamburguerias', path: '#', label: 'Hamburguerias' },
            { name: 'Pastelarias', path: '#', label: 'Pastelarias' },
            { name: 'Pizzarias', path: '#', label: 'Pizzarias' },
            { name: 'Restaurantes', path: '#', label: 'Restaurantes' },
        ],
    },
    {
        name: 'nav.services',
        path: '#',
        subItems: [
            { name: 'Agência de Viagens', path: '#', label: 'Agência de Viagens' },
            { name: 'Espaços para Eventos', path: '#', label: 'Espaços para Eventos' },
            { name: 'Locadora de Veículos', path: '#', label: 'Locadora de Veículos' },
            { name: 'Organizadoras de Eventos', path: '#', label: 'Organizadoras de Eventos' },
            { name: 'Taxi', path: '#', label: 'Taxi' },
            { name: 'Transportadoras Rodoviárias', path: '#', label: 'Transportadoras Rodoviárias' },
            { name: 'Transportadoras Turísticas', path: '#', label: 'Transportadoras Turísticas' },
        ],
    },
    {
        name: 'nav.calendar',
        path: '#',
        subItems: [
            { name: 'Calendário Eventos de 2025', path: '#', label: 'Calendário de Eventos 2025' },
            { name: 'Próximos Eventos', path: '#', label: 'Próximos Eventos' },
            { name: 'Cadastro de Eventos', path: '#', label: 'Cadastro de Eventos' },
        ],
    },
];

const navImages = [
    { name: 'Naviraí à Noite', src: '/navirai_noite.png', label: 'Naviraí à Noite' },
    { name: 'Parque Municipal Cumundaí', src: '/parque_cumandai.png', label: 'Parque Municipal Cumundaí' },
    { name: 'Rio Amambai', src: '/rio_amambai.png', label: 'Rio Amambai' },
    { name: 'Entrada da Cidade', src: '/araras.png', label: 'Entrada da Cidade' },
    { name: 'Praça Central', src: '/praca_central.png', label: 'Praça Central' },
    { name: 'Fejunavi', src: '/fejunavi.png', label: 'Fejunavi' },
];

const navEvents = [
    { 
        name: 'Festa Junina', 
        date: '2024-06-24', 
        description: 'Celebração tradicional com comidas típicas, quadrilhas e muita diversão.', 
        image: "https://placehold.co/600x400",
    },
    { 
        name: 'Festival de Música', 
        date: '2024-07-15', 
        description: 'Apresentações de bandas locais e nacionais em um evento imperdível para os amantes da música.', 
        image: "https://placehold.co/600x400",
    },
    { 
        name: 'Feira de Artesanato', 
        date: '2024-08-10', 
        description: 'Exposição e venda de produtos artesanais feitos por talentosos artesãos da região.', 
        image: "https://placehold.co/600x400",
    },
];

// Mapeamento de feature keys para labels legíveis
const featureLabels: Record<string, string> = {
    'hotels.features.pool': 'Piscina Externa',
    'hotels.features.breakfast': 'Café da manhã incluído',
    'hotels.features.parking': 'Estacionamento grátis',
    'hotels.features.exceptional_service': 'Atendimento Excepcional',
    'hotels.features.free_wifi': 'Wi-Fi Grátis',
    'hotels.features.ac': 'Ar-condicionado',
    'hotels.features.central_location': 'Localização Central',
    'hotels.features.restaurant': 'Restaurante',
    'hotels.features.reception_24h': 'Recepção 24h',
    'hotels.features.pets_allowed': 'Aceita Pets',
    'hotels.features.garden': 'Jardim',
    'hotels.features.gym': 'Academia',
    'hotels.features.economic': 'Econômico',
    'hotels.features.main_avenue': 'Av. Principal',
};

/** Traduz uma feature key para texto legível. Se não encontrar no mapa, retorna a própria string. */
function translateFeature(key: string): string {
    return featureLabels[key] || key;
}

const hotelsData: Hotel[] = [
    {
        id: 1,
        name: "Villa Verde Hotel",
        image: "https://placehold.co/400x300/e2e8f0/3e913e?text=Villa+Verde",
        distance: "0.4 km do centro",
        features: ["hotels.features.pool", "hotels.features.breakfast", "hotels.features.parking"],
        highlight: true,
        latitude: -23.0657,
        longitude: -54.1921,
        socials: {
            website: "https://example.com",
            instagram: "https://instagram.com/villaverde",
        }
    },
    {
        id: 2,
        name: "Dubai Hotel",
        image: "https://placehold.co/400x300/e2e8f0/3e913e?text=Dubai+Hotel",
        distance: "0.6 km do centro",
        features: ["hotels.features.exceptional_service", "hotels.features.free_wifi", "hotels.features.ac"],
        latitude: -23.0683,
        longitude: -54.1958,
        socials: {
            facebook: "https://facebook.com/dubaihotel",
        }
    },
    {
        id: 3,
        name: "Hotel 2 Gaúchos",
        image: "https://placehold.co/400x300/e2e8f0/3e913e?text=Hotel+2+Gauchos",
        distance: "0.4 km do centro",
        features: ["hotels.features.central_location", "hotels.features.restaurant", "hotels.features.reception_24h"],
        latitude: -23.0640,
        longitude: -54.2005,
        socials: {
            website: "https://example.com",
        }
    },
    {
        id: 4,
        name: "Nav Park Hotel",
        image: "https://placehold.co/400x300/e2e8f0/3e913e?text=Nav+Park",
        distance: "0.8 km do centro",
        features: ["hotels.features.pets_allowed", "hotels.features.garden", "hotels.features.gym"],
        highlight: true,
        latitude: -23.0721,
        longitude: -54.1944,
        socials: {
            website: "https://example.com",
            instagram: "https://instagram.com/navpark",
            facebook: "https://facebook.com/navpark"
        }
    },
    {
        id: 5,
        name: "Gold Hotel Naviraí",
        image: "https://placehold.co/400x300/e2e8f0/3e913e?text=Gold+Hotel",
        distance: "1.0 km do centro",
        features: ["hotels.features.economic", "hotels.features.main_avenue", "hotels.features.breakfast"],
        latitude: -23.0619,
        longitude: -54.1878,
        socials: {
            website: "https://example.com",
        }
    }
];

export { navItems, navImages, navEvents, hotelsData, translateFeature };
import { type Hotel, type Service, type Venue, type Restaurant } from "../types/interfacesTypes";

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
        path: '/atracoes',
        subItems: [
            { name: 'Artesanatos', path: '/atracoes?tipo=Artesanatos', label: 'Artesanatos' },
            { name: 'Compras', path: '/atracoes?tipo=Compras', label: 'Compras' },
            { name: 'Monumentos', path: '/atracoes?tipo=Monumentos', label: 'Monumentos' },
            { name: 'Museus', path: '/atracoes?tipo=Museus', label: 'Museus' },
            { name: 'Praça e Parques', path: '/atracoes?tipo=Praça e Parques', label: 'Praças e Parques' },
            { name: 'Rancho', path: '/atracoes?tipo=Rancho', label: 'Rancho' },
            { name: 'Pesqueiro', path: '/atracoes?tipo=Pesqueiro', label: 'Pesqueiro' },
        ],
    },
    {
        name: 'nav.where_to_eat',
        path: '/restaurantes',
        subItems: [
            { name: 'Bares', path: '/restaurantes?tipo=Bares', label: 'Bares' },
            { name: 'Cafeterias', path: '/restaurantes?tipo=Cafeterias', label: 'Cafeterias' },
            { name: 'Lanches e Doces', path: '/restaurantes?tipo=Lanches e Doces', label: 'Lanches e Doces' },
            { name: 'Hamburguerias', path: '/restaurantes?tipo=Hamburguerias', label: 'Hamburguerias' },
            { name: 'Pastelarias', path: '/restaurantes?tipo=Pastelarias', label: 'Pastelarias' },
            { name: 'Pizzarias', path: '/restaurantes?tipo=Pizzarias', label: 'Pizzarias' },
            { name: 'Restaurantes', path: '/restaurantes?tipo=Restaurantes', label: 'Restaurantes' },
        ],
    },

     {
        name: 'nav.sports',
        path: '/esportes',
        subItems: [
            { name: 'Futebol', path: '/esportes?tipo=Futebol', label: 'Futebol' },
            { name: 'Basket', path: '/esportes?tipo=Basket', label: 'Basket' },
            { name: 'Volei', path: '/esportes?tipo=Vôlei', label: 'Volei' },
            { name: 'Basebol', path: '/esportes?tipo=Beisebol', label: 'Basebol' },
            
        ],
    },

    {
        name: 'nav.services',
        path: '/servicos',
        subItems: [
            { name: 'Agência de Viagens', path: '/servicos?tipo=Agência', label: 'Agência de Viagens' },
            { name: 'Espaços para Eventos', path: '/servicos?tipo=Espaços para Eventos', label: 'Espaços para Eventos' },
            { name: 'Locadora de Veículos', path: '/servicos?tipo=Locadora de Veículos', label: 'Locadora de Veículos' },
            { name: 'Organizadoras de Eventos', path: '/servicos?tipo=Organizadoras de Eventos', label: 'Organizadoras de Eventos' },
            { name: 'Taxi', path: '/servicos?tipo=Taxi', label: 'Taxi' },
            { name: 'Transportadoras Rodoviárias', path: '/servicos?tipo=Transportadoras Rodoviárias', label: 'Transportadoras Rodoviárias' },
            { name: 'Transportadoras Turísticas', path: '/servicos?tipo=Transportadoras Turísticas', label: 'Transportadoras Turísticas' },
        ],
    },
    {
        name: 'nav.calendar',
        path: '/event',
        subItems: [
            { name: 'Eventos', path: '/event', label: 'Eventos' },
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

const servicesData: Service[] = [
    {
        id: 1,
        name: "Agência Naviraí Turismo",
        image: "https://placehold.co/400x300/e2e8f0/3e913e?text=Agencia+Navirai",
        distance: "Centro de Naviraí",
        features: ["Traslado", "Pacotes", "Atendimento personalizado"],
        highlight: true,
        latitude: -23.0657,
        longitude: -54.1921,
        socials: {
            website: "https://example.com",
            instagram: "https://instagram.com/naviraiturismo",
        }
    },
    {
        id: 2,
        name: "Espaços Evento Total",
        image: "https://placehold.co/400x300/e2e8f0/3e913e?text=Eventos",
        distance: "Naviraí - MS",
        features: ["Salão", "Buffet", "Estrutura completa"],
        latitude: -23.0683,
        longitude: -54.1958,
        socials: {
            facebook: "https://facebook.com/eventototal",
        }
    }
];

const venuesData: Venue[] = [
    {
        id: 1,
        name: "Arena Naviraí Society",
        category: "Futebol",
        image: "https://placehold.co/400x300/e2e8f0/3e913e?text=Arena+Navirai",
        distance: "1.2 km do centro",
        features: ["Grama Sintética", "Iluminação LED", "Vestiários", "Barzinho"],
        highlight: true,
        latitude: -23.0645, // Coordenadas fictícias para exemplo
        longitude: -54.1912,
        socials: {
            instagram: "https://instagram.com/arenaviraisociety",
            whatsapp: "5567999999999"
        },
        about: {
            title: "A melhor arena da cidade",
            desc: ["Campos com gramado sintético de última geração, perfeitos para aquele baba com os amigos."]
        },
        courts: {
            title: "Nossos Campos",
            type: "Futebol Society 7x7",
            desc: ["2 campos de society disponíveis para locação por hora."]
        },
        rules: [
            { label: "Calçados", title: "Uso de Chuteiras", desc: "Proibido o uso de trava de alumínio." },
            { label: "Horários", title: "Tolerância", desc: "Tolerância máxima de 10 minutos para início da partida." }
        ],
        infrastructure: {
            title: "O que oferecemos",
            cards: [
                { icon: "beer", title: "Bar", desc: "Bebidas geladas e porções" },
                { icon: "shower", title: "Vestiários", desc: "Duchas quentes e armários" },
                { icon: "car", title: "Estacionamento", desc: "Amplo estacionamento gratuito" }
            ]
        }
    },
    {
        id: 2,
        name: "Ginásio Poliesportivo",
        category: "Basket", // Pode ser filtrado pela categoria na sua tela
        image: "https://placehold.co/400x300/e2e8f0/3e913e?text=Ginasio+Poli",
        distance: "Centro",
        features: ["Piso de Madeira", "Arquibancada", "Placar Eletrônico"],
        latitude: -23.0650,
        longitude: -54.1950,
        socials: {
            whatsapp: "5567988888888"
        },
        courts: {
            title: "Quadra Principal",
            type: "Quadra Poliesportiva Indoor",
            desc: ["Quadra com marcações oficiais para Basquete, Vôlei e Futsal."]
        },
        rules: [
            { label: "Reserva", title: "Antecedência", desc: "Reservas devem ser feitas com 24h de antecedência." }
        ]
    }
];



const restaurantsData: Restaurant[] = [
    {
        id: 1,
        name: "Pizzaria Bella Naviraí",
        category: "Pizzarias",
        address: "Av. Weimar Torres, Centro",
        image: "https://placehold.co/400x300/e2e8f0/f59e0b?text=Pizzaria+Bella",
        distance: "Centro",
        features: ["Forno a Lenha", "Espaço Kids", "Delivery"],
        highlight: true,
        latitude: -23.0645,
        longitude: -54.1912,
        socials: {
            instagram: "https://instagram.com/pizzariabellanavirai",
            whatsapp: "5567999999999"
        },
        about: {
            title: "Tradição em cada fatia",
            desc: ["A melhor pizza da região, feita no autêntico forno a lenha com ingredientes selecionados e muito carinho para você e sua família."]
        },
        specialties: {
            title: "Destaques do Cardápio",
            type: "Pizzas e Massas Artesanais",
            desc: ["Experimente nossa famosa Pizza à Moda da Casa e o suculento Calzone de Frango com Catupiry."]
        },
        usefulInfo: [
            { label: "Horário", title: "Funcionamento", desc: "Terça a Domingo das 18h às 23h30" },
            { label: "Delivery", title: "Entregas", desc: "Entregamos em toda a cidade sem taxa na região central." }
        ],
        infrastructure: {
            title: "Comodidades",
            cards: [
                { icon: "wifi", title: "Wi-Fi", desc: "Internet rápida gratuita para clientes" },
                { icon: "kids", title: "Espaço Kids", desc: "Área com brinquedos e monitor" }
            ]
        }
    },
    {
        id: 2,
        name: "Café Central",
        category: "Cafeterias",
        address: "Praça Euclides Fabris, Centro",
        image: "https://placehold.co/400x300/e2e8f0/f59e0b?text=Cafe+Central",
        distance: "0.1 km do centro",
        features: ["Cafés Especiais", "Wi-Fi Grátis", "Pet Friendly"],
        latitude: -23.0655,
        longitude: -54.1930,
        socials: {
            instagram: "https://instagram.com/cafecentralnavirai"
        },
        about: {
            title: "O seu refúgio no coração de Naviraí",
            desc: ["Um ambiente aconchegante perfeito para reuniões de trabalho, encontros com amigos ou apenas para relaxar lendo um bom livro."]
        },
        specialties: {
            title: "Delícias do Café",
            type: "Cafés e Doces Finos",
            desc: ["Cafés extraídos na perfeição e nossa famosa Torta de Limão com merengue suíço."]
        },
        usefulInfo: [
            { label: "Horário", title: "Aberto o dia todo", desc: "Segunda a Sábado das 07h às 19h" },
            { label: "Pet", title: "Pet Friendly", desc: "Seu amigo de quatro patas é bem-vindo na nossa área externa." }
        ]
    },
    {
        id: 3,
        name: "Churrascaria Fogo de Ouro",
        category: "Restaurantes",
        address: "Rodovia BR-163, Km 120",
        image: "https://placehold.co/400x300/e2e8f0/f59e0b?text=Fogo+de+Ouro",
        distance: "3 km do centro",
        features: ["Rodízio de Carnes", "Buffet Livre", "Ar Condicionado"],
        highlight: true,
        latitude: -23.0800,
        longitude: -54.1700,
        socials: {
            facebook: "https://facebook.com/fogodeouronavirai",
            whatsapp: "5567988888888"
        },
        about: {
            title: "O autêntico churrasco sul-mato-grossense",
            desc: ["Carnes nobres, atendimento de excelência e um buffet completo de saladas e pratos quentes. A parada obrigatória em Naviraí."]
        },
        specialties: {
            title: "Carnes Nobres",
            type: "Churrasco Tradicional",
            desc: ["Nossa especialidade é a Picanha no Alho e a Costela Assada lentamente por 12 horas."]
        }
    },
    {
        id: 4,
        name: "Mestre do Burguer",
        category: "Hamburguerias",
        address: "Av. Dourados, 1500",
        image: "https://placehold.co/400x300/e2e8f0/f59e0b?text=Mestre+do+Burguer",
        distance: "1.5 km do centro",
        features: ["Blend Artesanal", "Cerveja Gelada", "Música Ambiente"],
        latitude: -23.0590,
        longitude: -54.1850,
        socials: {
            instagram: "https://instagram.com/mestreburguernavirai"
        },
        about: {
            title: "Hambúrguer de verdade",
            desc: ["Pão brioche selado na manteiga, blend 100% bovino fresco e molhos autorais. O melhor Smash Burger da cidade!"]
        },
        specialties: {
            title: "Os Mais Pedidos",
            type: "Smash e Artesanais",
            desc: ["Não deixe de provar o 'Mestre Bacon' e nossa deliciosa porção de batatas rústicas com páprica."]
        }
    }
];




export { navItems, navImages, navEvents, hotelsData, servicesData, venuesData, restaurantsData,  translateFeature };
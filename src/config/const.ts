import { type Hotel } from "../types/interfacesTypes";

const navItems = [
    {
        name: 'Naviraí',
        path: '/historia',
        subItems: [
            { name: 'Como Chegar', path: '#', tKey: 'nav.sub.how_to_get_there' },
            { name: 'Dados Turísticos', path: '#', tKey: 'nav.sub.tourist_data' },
            { name: 'História', path: '/historia', tKey: 'nav.sub.history' },
        ],
    },
    {
        name: 'nav.where_to_sleep',
        path: '#',
        subItems: [
            { name: 'Hotéis', path: '/hoteis', tKey: 'nav.sub.hotels' },
            { name: 'Pousadas', path: '#', tKey: 'nav.sub.inns' },
            { name: 'Área de Camping', path: '#', tKey: 'nav.sub.camping_area' },
            { name: 'Flat', path: '#', tKey: 'nav.sub.flat' },
        ],
    },
    {
        name: 'nav.what_to_visit',
        path: '#',
        subItems: [
            { name: 'Artesanatos', path: '#', tKey: 'nav.sub.crafts' },
            { name: 'Compras', path: '#', tKey: 'nav.sub.shopping' },
            { name: 'Monumentos', path: '#', tKey: 'nav.sub.monuments' },
            { name: 'Museus', path: '#', tKey: 'nav.sub.museums' },
            { name: 'Praça e Parques', path: '#', tKey: 'nav.sub.squares_and_parks' },
            { name: 'Rancho', path: '#', tKey: 'nav.sub.ranch' },
            { name: 'Pesqueiro', path: '#', tKey: 'nav.sub.fishing_spot' },
        ],
    },
    {
        name: 'nav.where_to_eat',
        path: '#',
        subItems: [
            { name: 'Bares', path: '#', tKey: 'nav.sub.bars' },
            { name: 'Cafeterias', path: '#', tKey: 'nav.sub.coffee_shops' },
            { name: 'Lanches e Doces', path: '#', tKey: 'nav.sub.snacks_and_sweets' },
            { name: 'Hamburguerias', path: '#', tKey: 'nav.sub.burger_joints' },
            { name: 'Pastelarias', path: '#', tKey: 'nav.sub.pastry_shops' },
            { name: 'Pizzarias', path: '#', tKey: 'nav.sub.pizzerias' },
            { name: 'Restaurantes', path: '#', tKey: 'nav.sub.restaurants' },
        ],
    },
    {
        name: 'nav.services',
        path: '#',
        subItems: [
            { name: 'Agência de Viagens', path: '#', tKey: 'nav.sub.travel_agency' },
            { name: 'Espaços para Eventos', path: '#', tKey: 'nav.sub.event_spaces' },
            { name: 'Locadora de Veículos', path: '#', tKey: 'nav.sub.car_rental' },
            { name: 'Organizadoras de Eventos', path: '#', tKey: 'nav.sub.event_organizers' },
            { name: 'Taxi', path: '#', tKey: 'nav.sub.taxi' },
            { name: 'Transportadoras Rodoviárias', path: '#', tKey: 'nav.sub.road_carriers' },
            { name: 'Transportadoras Turísticas', path: '#', tKey: 'nav.sub.tourist_carriers' },
        ],
    },
    {
        name: 'nav.calendar',
        patch: '#',
        subItems: [
            { name: 'Calendário Eventos de 2025', path: '#', tKey: 'nav.sub.events_calendar_2025' },
            { name: 'Próximos Eventos', path: '#', tKey: 'nav.sub.upcoming_events' },
            { name: 'Cadastro de Eventos', path: '#', tKey: 'nav.sub.event_registration' },
        ],
    },
];

const navImages = [
    { name: 'Naviraí à Noite', src: '/navirai_noite.png', tKey: 'home.slider.navirai_at_night' },
    { name: 'Parque Municipal Cumundaí', src: '/parque_cumandai.png', tKey: 'home.slider.cumundai_park' },
    { name: 'Rio Amambai', src: '/rio_amambai.png', tKey: 'home.slider.amambai_river' },
    { name: 'Entrada da Cidade', src: '/araras.png', tKey: 'home.slider.city_entrance' },
    { name: 'Praça Central', src: '/praca_central.png', tKey: 'home.slider.central_square' },
    { name: 'Fejunavi', src: '/fejunavi.png', tKey: 'home.slider.fejunavi' },
];

const navEvents = [
    { 
        name: 'Festa Junina', 
        date: '2024-06-24', 
        description: 'Celebração tradicional com comidas típicas, quadrilhas e muita diversão.', 
        image: "https://placehold.co/600x400",
        nameTKey: 'events.festa_junina.name',
        descriptionTKey: 'events.festa_junina.description'
    },
    { 
        name: 'Festival de Música', 
        date: '2024-07-15', 
        description: 'Apresentações de bandas locais e nacionais em um evento imperdível para os amantes da música.', 
        image: "https://placehold.co/600x400",
        nameTKey: 'events.music_festival.name',
        descriptionTKey: 'events.music_festival.description'
    },
    { 
        name: 'Feira de Artesanato', 
        date: '2024-08-10', 
        description: 'Exposição e venda de produtos artesanais feitos por talentosos artesãos da região.', 
        image: "https://placehold.co/600x400",
        nameTKey: 'events.craft_fair.name',
        descriptionTKey: 'events.craft_fair.description'
    },
];

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

export { navItems, navImages, navEvents, hotelsData };
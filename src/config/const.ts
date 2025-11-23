const navItems = [
    {
        name: 'Naviraí',
        subItems: [
            { name: 'Como Chegar', path: '#' },
            { name: 'Dados Turísticos', path: '#' },
            { name: 'História', path: '#' },
        ],
    },
    {
        name: 'Onde Dormir',
        subItems: [
            { name: 'Hotéis', path: '#' },
            { name: 'Pousadas', path: '#' },
            { name: 'Área de Camping', path: '#' },
            { name: 'Flat', path: '#' },
        ],
    },
    {
        name: 'O Que Visitar',
        subItems: [
            { name: 'Artesanatos', path: '#' },
            { name: 'Compras', path: '#' },
            { name: 'Monumentos', path: '#' },
            { name: 'Museus', path: '#' },
            { name: 'Praça e Parques', path: '#' },
            { name: 'Rancho', path: '#' },
            { name: 'Pesqueiro', path: '#' },
        ],
    },
    {
        name: 'Onde Comer',
        subItems: [
            { name: 'Bares', path: '#' },
            { name: 'Cafeterias', path: '#' },
            { name: 'Lanches e Doces', path: '#' },
            { name: 'Hamburguerias', path: '#' },
            { name: 'Pastelarias', path: '#' },
            { name: 'Pizzarias', path: '#' },
            { name: 'Restaurantes', path: '#' },
        ],
    },
    {
        name: 'Serviços',
        subItems: [
            { name: 'Agência de Viagens', path: '#' },
            { name: 'Espaços para Eventos', path: '#' },
            { name: 'Locadora de Veículos', path: '#' },
            { name: 'Organizadoras de Eventos', path: '#' },
            { name: 'Taxi', path: '#' },
            { name: 'Transportadoras Rodoviárias', path: '#' },
            { name: 'Transportadoras Turísticas', path: '#' },
        ],
    },
    {
        name: 'Calendário',
        subItems: [
            { name: 'Calendário Eventos de 2025', path: '#' },
            { name: 'Próximos Eventos', path: '#' },
            { name: 'Cadastro de Eventos', path: '#' },
        ],
    },
];

const navImages = [
    { name: 'Naviraí à Noite', src: 'https://placehold.co/1600x700' },
    { name: 'Parque das Nações', src: 'https://placehold.co/1600x700' },
    { name: 'Rio Ivinhema', src: 'https://placehold.co/1600x700' },
    { name: 'Monumento do Cristo', src: 'https://placehold.co/1600x700' },
    { name: 'Praça Central', src: 'https://placehold.co/1600x700' },
    { name: 'Evento Cultural', src: 'https://placehold.co/1600x700' },
];

const navEvents = [
    { name: 'Festa Junina', date: '2024-06-24', description: 'Celebração tradicional com comidas típicas, quadrilhas e muita diversão.', image: "https://placehold.co/600x400" },
    { name: 'Festival de Música', date: '2024-07-15', description: 'Apresentações de bandas locais e nacionais em um evento imperdível para os amantes da música.', image: "https://placehold.co/600x400"},
    { name: 'Feira de Artesanato', date: '2024-08-10', description: 'Exposição e venda de produtos artesanais feitos por talentosos artesãos da região.', image: "https://placehold.co/600x400" },
];

export { navItems, navImages, navEvents };
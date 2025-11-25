interface Hotel {
    id: number;
    name: string;
    image: string;
    stars: number;
    rating: number;
    reviews: number;
    distance: string; // Distância do centro
    price: number;
    features: string[];
    badges?: string[]; // Ex: "Opção popular"
}

export { type Hotel };
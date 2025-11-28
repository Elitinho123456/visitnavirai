interface Hotel {
    id: number;
    name: string;
    image: string;
    distance: string; // Distância do centro
    features: string[];
    highlight?: boolean;
    latitude: number;
    longitude: number;
    socials: {
        facebook?: string;
        instagram?: string;
        website?: string;
    };
}

export { type Hotel };
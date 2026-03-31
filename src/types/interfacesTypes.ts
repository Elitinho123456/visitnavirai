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
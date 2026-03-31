import mongoose from "mongoose";

const Schema = mongoose.Schema;

const HotelSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, 
    category: { type: String, required: true, enum: ['Hotel', 'Pousada', 'Flat', 'Área de Camping'] },
    features: [String],
    highlight: { type: Boolean, default: false },
    highlightExpiration: { type: Date },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    socials: {
        facebook: String,
        instagram: String,
        website: String,
    },
    // Informações detalhadas
    about: {
        title: String,
        subtitle: String,
        desc: [String] // Array de parágrafos
    },
    accommodation: {
        title: String,
        image: String,
        imageCaption: String,
        desc: [String]
    },
    policies: [{
        type: { type: String, enum: ['horario', 'regra'], default: 'horario' },
        label: String,
        title: String,
        desc: String
    }],
    amenities: {
        title: String,
        cards: [{
            icon: String, // String para identificar o ícone
            title: String,
            desc: String
        }]
    },
    gallery: [String], // Array de image URLs
    cta: {
        title: String,
        desc: String
    }
}, { timestamps: true });

export const Hotel = mongoose.model("Hotel", HotelSchema);

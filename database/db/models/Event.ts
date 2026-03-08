import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
    name: string;
    date: string;       // Formato 'YYYY-MM-DD' enviado pelo front
    startTime: string;  // Formato 'HH:mm'
    endTime: string;    // Formato 'HH:mm'
    image: string;      // URL da imagem
    description: string;
    createdAt: Date;
}

const eventSchema: Schema = new Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Event = mongoose.model<IEvent>("Event", eventSchema);

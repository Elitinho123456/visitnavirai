import { Request, Response } from "express";
import { Hotel } from "../models/Hotel";
import path from "path";
import fs from "fs";
import { sanitizeName, categoryFolder } from "../utils/fileUtils";

export const getHotels = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotels = await Hotel.find().lean();
        const now = new Date();
        const processed = hotels.map(h => {
            if (h.highlight && h.highlightExpiration && new Date(h.highlightExpiration) < now) {
                h.highlight = false;
            }
            return h;
        });
        res.json(processed);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar hotéis" });
    }
};

export const getHotelById = async (req: Request, res: Response): Promise<void> => {
    try {
        const hotel = await Hotel.findById(req.params.id).lean();
        if (!hotel) {
            res.status(404).json({ message: "Hotel não encontrado" });
            return;
        }
        
        const now = new Date();
        if (hotel.highlight && hotel.highlightExpiration && new Date(hotel.highlightExpiration) < now) {
            hotel.highlight = false;
        }
        
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar hotel" });
    }
};

export const createHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const newHotel = new Hotel(req.body);
        const savedHotel = await newHotel.save();
        res.status(201).json(savedHotel);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Erro ao criar hotel" });
    }
};

export const updateHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
        res.json(updatedHotel);
    } catch (error) {
        res.status(400).json({ message: "Erro ao atualizar" });
    }
};

export const deleteHotel = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);

        if (!deletedHotel) {
            res.status(404).json({ message: "Hotel não encontrado" });
            return;
        }

        if (deletedHotel.name) {
            const category = (deletedHotel as any).category || "diversos";
            const dirPath = path.join(process.cwd(), "database", "imgs", categoryFolder(category), sanitizeName(deletedHotel.name));
            if (fs.existsSync(dirPath)) {
                fs.rmSync(dirPath, { recursive: true, force: true });
            }
        }

        res.json({ message: "Hotel excluído com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir hotel" });
    }
};

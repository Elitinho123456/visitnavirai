import { Request, Response } from "express";
import { User } from "../models/User";
import { Hotel } from "../models/Hotel";
import { Event } from "../models/Event";

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const usersCount = await User.countDocuments();
        const hotelsCount = await Hotel.countDocuments();
        const eventsCount = await Event.countDocuments();

        res.json({
            users: usersCount,
            hotels: hotelsCount,
            events: eventsCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao carregar estatísticas do dashboard" });
    }
};

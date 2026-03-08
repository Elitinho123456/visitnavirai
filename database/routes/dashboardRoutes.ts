import { Router, Request, Response } from "express";
import { User } from "../db/models/User";
import { Hotel } from "../db/models/Hotel";
import { Event } from "../db/models/Event";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const router = Router();

// GET OVERVIEW STATS (Admin Only)
router.get("/", verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const usersCount = await User.countDocuments();
        const hotelsCount = await Hotel.countDocuments();
        const eventsCount = await Event.countDocuments();

        // Exemplo: Retornamos os totais em uma estrutura de objeto JSON.
        res.json({
            users: usersCount,
            hotels: hotelsCount,
            events: eventsCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao carregar estatísticas do dashboard" });
    }
});

export default router;

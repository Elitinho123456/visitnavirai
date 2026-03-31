import { Router, Request, Response } from "express";
import { Event } from "../db/models/Event";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import path from "path";
import fs from "fs";
import { sanitizeName } from "../utils/fileUtils";

const router = Router();

// GET ALL EVENTS (Public)
router.get("/", async (req: Request, res: Response) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar eventos" });
    }
});

// CREATE NEW EVENT (Admin Only)
router.post("/", verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Erro ao criar evento" });
    }
});

// DELETE EVENT (Admin Only)
router.delete("/:id", verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ message: "Evento não encontrado" });

        if (deletedEvent.name) {
            const dirPath = path.join(process.cwd(), "database", "imgs", "eventos", sanitizeName(deletedEvent.name));
            if (fs.existsSync(dirPath)) {
                fs.rmSync(dirPath, { recursive: true, force: true });
            }
        }

        res.json({ message: "Evento deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar evento" });
    }
});

export default router;

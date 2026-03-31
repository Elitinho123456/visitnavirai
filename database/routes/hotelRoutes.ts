import { Router, Request, Response } from "express";
import { Hotel } from "../db/models/Hotel";
import { verifyToken, requirePermission } from "../middlewares/authMiddleware";
import path from "path";
import fs from "fs";
import { sanitizeName, categoryFolder } from "../utils/fileUtils";

const router = Router();

// GET ALL
router.get("/", async (req: Request, res: Response) => {
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
});

// GET ONE
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const hotel = await Hotel.findById(req.params.id).lean();
        if (!hotel) return res.status(404).json({ message: "Hotel não encontrado" });
        
        const now = new Date();
        if (hotel.highlight && hotel.highlightExpiration && new Date(hotel.highlightExpiration) < now) {
            hotel.highlight = false;
        }
        
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar hotel" });
    }
});

// CREATE
router.post("/", verifyToken, requirePermission('where_to_sleep', 'create'), async (req: Request, res: Response) => {
    try {
        const newHotel = new Hotel(req.body);
        const savedHotel = await newHotel.save();
        res.status(201).json(savedHotel);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Erro ao criar hotel" });
    }
});

// UPDATE
router.put("/:id", verifyToken, requirePermission('where_to_sleep', 'edit'), async (req: Request, res: Response) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
        res.json(updatedHotel);
    } catch (error) {
        res.status(400).json({ message: "Erro ao atualizar" });
    }
});

// DELETE
router.delete("/:id", verifyToken, requirePermission('where_to_sleep', 'delete'), async (req: Request, res: Response): Promise<any> => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);

        if (!deletedHotel) return res.status(404).json({ message: "Hotel não encontrado" });

        if (deletedHotel.name) {
            const category = (deletedHotel as any).category || "diversos";
            const dirPath = path.join(process.cwd(), "database", "imgs", categoryFolder(category), sanitizeName(deletedHotel.name));
            if (fs.existsSync(dirPath)) {
                fs.rmSync(dirPath, { recursive: true, force: true });
            }
        }

        return res.json({ message: "Hotel excluído com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao excluir hotel" });
    }
});

export default router;

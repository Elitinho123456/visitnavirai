import { Router, Request, Response } from "express";
import { Hotel } from "../db/models/Hotel";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const router = Router();

// GET ALL
router.get("/", async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar hotéis" });
    }
});

// GET ONE
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: "Hotel não encontrado" });
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar hotel" });
    }
});

// CREATE
router.post("/", verifyToken, isAdmin, async (req: Request, res: Response) => {
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
router.put("/:id", verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
        res.json(updatedHotel);
    } catch (error) {
        res.status(400).json({ message: "Erro ao atualizar" });
    }
});

// DELETE
router.delete("/:id", verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);

        if (!deletedHotel) return res.status(404).json({ message: "Hotel não encontrado" });
        res.json({ message: "Hotel excluído com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir hotel" });
    }
});

export default router;

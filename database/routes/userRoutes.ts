import { Router, Request, Response } from "express";
import { User } from "../db/models/User";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const router = Router();

// GET ALL USERS (Admin Only)
router.get("/", verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
});

// GET USER BY ID (Admin Only)
router.get("/:id", verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuário" });
    }
});

// PROMOTE USER TO ADMIN (Admin Only)
router.put("/:id/promote", verifyToken, isAdmin, async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role: "admin" }, { returnDocument: "after" }).select("-password");
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro ao promover usuário" });
    }
});

export default router;

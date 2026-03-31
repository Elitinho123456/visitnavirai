import { Router, Request, Response } from "express";
import { User } from "../db/models/User";
import { Role } from "../db/models/Role";
import { verifyToken, isSuperAdmin, AuthRequest } from "../middlewares/authMiddleware";

const router = Router();

// GET ALL USERS (Admin Only)
router.get("/", verifyToken, isSuperAdmin, async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
});

// GET USER BY ID (Admin Only OR Self)
router.get("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
             return res.status(403).json({ message: "Acesso restrito." });
        }
        const user = await User.findById(req.params.id).select("-password").lean();
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        // Se o usuário possuir um cargo específico, busque as permissões na doc de cargos
        let permissions = null;
        if (user.role && user.role !== "admin" && user.role !== "user") {
            const roleDoc = await Role.findOne({ name: user.role }).lean();
            if (roleDoc) {
                permissions = roleDoc.permissions;
            }
        }
        
        // Embutindo um "fallback" simulado de permissões pro user objeto retornar pro front
        res.json({ ...user, permissions });
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuário" });
    }
});

// UPDATE USER ROLE (Admin Only)
router.put("/:id/role", verifyToken, isSuperAdmin, async (req: Request, res: Response) => {
    try {
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({ message: "O cargo (role) é obrigatório" });
        }
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { returnDocument: "after" }).select("-password");
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar cargo do usuário" });
    }
});

// UPDATE USER PROFILE IMAGE (Self or Admin)
router.put("/:id/profile-image", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
        if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: "Acesso restrito." });
        }
        
        const { profileImage } = req.body;
        if (profileImage === undefined) {
            return res.status(400).json({ message: "A imagem de perfil é obrigatória" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { profileImage }, 
            { returnDocument: "after" }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar a foto de perfil do usuário" });
    }
});

export default router;

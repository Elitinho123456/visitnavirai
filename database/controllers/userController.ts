import { Request, Response } from "express";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== "admin" && req.user?._id.toString() !== req.params.id) {
             res.status(403).json({ message: "Acesso restrito." });
             return;
        }
        const user = await User.findById(req.params.id).select("-password").lean();
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        let permissions = null;
        if (user.role && user.role !== "admin" && user.role !== "user") {
            const roleDoc = await Role.findOne({ name: user.role }).lean();
            if (roleDoc) {
                permissions = roleDoc.permissions;
            }
        }
        
        res.json({ ...user, permissions });
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuário" });
    }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role } = req.body;
        if (!role) {
            res.status(400).json({ message: "O cargo (role) é obrigatório" });
            return;
        }
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { returnDocument: "after" }).select("-password");
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar cargo do usuário" });
    }
};

export const updateUserProfileImage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== "admin" && req.user?._id.toString() !== req.params.id) {
            res.status(403).json({ message: "Acesso restrito." });
            return;
        }
        
        const { profileImage } = req.body;
        if (profileImage === undefined) {
            res.status(400).json({ message: "A imagem de perfil é obrigatória" });
            return;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { profileImage }, 
            { returnDocument: "after" }
        ).select("-password");

        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar a foto de perfil do usuário" });
    }
};

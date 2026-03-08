import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../db/models/User";

// Extending Request to include user
export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Acesso negado. Token não fornecido." });
            return;
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as any;

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            res.status(401).json({ message: "Token inválido. Usuário não encontrado." });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado." });
    }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Acesso restrito. Privilégios insuficientes." });
    }
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../db/models/User";

// Extending Request to include user
export interface AuthRequest extends Request {
    user?: any;
    permissions?: any;
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

        const user = await User.findById(decoded.id).select("-password").lean();
        if (!user) {
            res.status(401).json({ message: "Token inválido. Usuário não encontrado." });
            return;
        }

        req.user = user;
        req.permissions = decoded.permissions || {}; // Permissões injetadas do JWT
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado." });
    }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role !== "user") {
        next();
    } else {
        res.status(403).json({ message: "Acesso restrito. Privilégios insuficientes." });
    }
};

export const isSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Acesso restrito apenas ao Administrador Chefe." });
    }
};

export const requirePermission = (module: string, action: "read" | "create" | "edit" | "delete") => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: "Não autorizado." });
            return;
        }

        // Admins têm poder absoluto
        if (req.user.role === "admin") {
            return next();
        }

        const permissions = req.permissions || {};
        const modulePerms = permissions[module];

        if (modulePerms && modulePerms[action] === true) {
            return next();
        }

        res.status(403).json({ message: `Acesso Negado: Faltam privilégios de '${action}' para o módulo '${module}'.` });
    };
};

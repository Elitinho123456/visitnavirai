import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../db/models/User";
import { Role } from "../db/models/Role";

export default async function login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email e senha são obrigatórios" });
            return;
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Senha inválida" });
            return;
        }

        let permissions = null;
        if (user.role && user.role !== "admin" && user.role !== "user") {
            const roleDoc = await Role.findOne({ name: user.role }).lean();
            if (roleDoc) {
                permissions = roleDoc.permissions;
            }
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, permissions },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "12h" }
        );

        res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor" });
    }
}
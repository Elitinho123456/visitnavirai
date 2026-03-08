import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../db/models/User";

export default async function register(req: Request, res: Response): Promise<void> {
    try {
        const { email, password, confirmPassword, name } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email e senha são obrigatórios" });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ message: "As senhas não coincidem" });
            return;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409).json({ message: "Usuário com este email já existe" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name || "",
            email,
            password: hashedPassword,
            role: "user",
        });

        await newUser.save();

        res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro no servidor" });
    }
}
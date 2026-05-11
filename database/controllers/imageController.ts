import { Request, Response } from "express";
import { sanitizeName, categoryFolder } from "../utils/fileUtils";

export const uploadSingle = (req: Request, res: Response): void => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "Nenhuma imagem foi recebida ou formato inválido." });
            return;
        }

        const category = req.body.category || "diversos";
        const name = req.body.name || "sem_nome";
        const relativePath = `${categoryFolder(category)}/${sanitizeName(name)}/${req.file.filename}`;
        const imageUrl = `/imgs/${relativePath}`;

        res.status(200).json({ url: imageUrl });
    } catch (error: any) {
        console.error("Erro no upload:", error);
        res.status(500).json({ message: error.message || "Erro no servidor ao processar o upload." });
    }
};

export const uploadMultiple = (req: Request, res: Response): void => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            res.status(400).json({ message: "Nenhuma imagem foi recebida." });
            return;
        }

        const category = req.body.category || "diversos";
        const name = req.body.name || "sem_nome";

        const urls = files.map(file => {
            const relativePath = `${categoryFolder(category)}/${sanitizeName(name)}/${file.filename}`;
            return `/imgs/${relativePath}`;
        });

        res.status(200).json({ urls });
    } catch (error: any) {
        console.error("Erro no upload múltiplo:", error);
        res.status(500).json({ message: error.message || "Erro no servidor." });
    }
};

import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const baseUploadDir = path.join(process.cwd(), "database", "imgs");
if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
}

// Formata o nome para uso em pastas (lowercase, sem espaços, sem acentos)
function sanitizeName(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/\s+/g, "_") // espaços → underscores
        .replace(/[^a-z0-9_-]/g, ""); // remove caracteres especiais
}

// Mapeia categoria para nome de pasta
function categoryFolder(category: string): string {
    const map: Record<string, string> = {
        "Hotel": "hoteis",
        "Pousada": "pousadas",
        "Flat": "flats",
        "Área de Camping": "campings",
    };
    return map[category] || "diversos";
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Lê category e name do body (devem ser enviados ANTES do arquivo no FormData)
        const category = req.body.category || "diversos";
        const name = req.body.name || "sem_nome";

        const destDir = path.join(baseUploadDir, categoryFolder(category), sanitizeName(name));

        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        cb(null, destDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedExtensions = /jpeg|jpg|png|webp|gif|svg|avif/i;
    const isExtensionValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const isMimetypeValid = allowedExtensions.test(file.mimetype);

    if (isExtensionValid && isMimetypeValid) {
        return cb(null, true);
    } else {
        return cb(new Error("Apenas imagens (png, jpg, webp, gif, svg, avif) são permitidas!"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

// Upload de um único arquivo
router.post("/upload", upload.single("file"), (req: Request, res: Response): any => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Nenhuma imagem foi recebida ou formato inválido." });
        }

        const category = req.body.category || "diversos";
        const name = req.body.name || "sem_nome";
        const relativePath = `${categoryFolder(category)}/${sanitizeName(name)}/${req.file.filename}`;
        const imageUrl = `http://localhost:${process.env.VITE_API_PORT || 3000}/imgs/${relativePath}`;

        return res.status(200).json({ url: imageUrl });
    } catch (error: any) {
        console.error("Erro no upload:", error);
        return res.status(500).json({ message: error.message || "Erro no servidor ao processar o upload." });
    }
});

// Upload de múltiplos arquivos (para galeria)
router.post("/upload-multiple", upload.array("files", 20), (req: Request, res: Response): any => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "Nenhuma imagem foi recebida." });
        }

        const category = req.body.category || "diversos";
        const name = req.body.name || "sem_nome";

        const urls = files.map(file => {
            const relativePath = `${categoryFolder(category)}/${sanitizeName(name)}/${file.filename}`;
            return `http://localhost:${process.env.VITE_API_PORT || 3000}/imgs/${relativePath}`;
        });

        return res.status(200).json({ urls });
    } catch (error: any) {
        console.error("Erro no upload múltiplo:", error);
        return res.status(500).json({ message: error.message || "Erro no servidor." });
    }
});

export default router;
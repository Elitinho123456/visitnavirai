import multer from "multer";
import path from "path";
import fs from "fs";
import { sanitizeName, categoryFolder } from "../utils/fileUtils";
import { Request } from "express";

const baseUploadDir = path.join(process.cwd(), "database", "imgs");
if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
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

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

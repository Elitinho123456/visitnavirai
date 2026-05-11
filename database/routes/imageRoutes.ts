import { Router } from "express";
import { upload } from "../middlewares/uploadMiddleware";
import { uploadSingle, uploadMultiple } from "../controllers/imageController";

const router = Router();

router.post("/upload", upload.single("file"), uploadSingle);
router.post("/upload-multiple", upload.array("files", 20), uploadMultiple);

export default router;

import { Router } from "express";
import { verifyToken, isSuperAdmin } from "../middlewares/authMiddleware";
import { getUsers, getUserById, updateUserRole, updateUserProfileImage } from "../controllers/userController";

const router = Router();

router.get("/", verifyToken, isSuperAdmin, getUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id/role", verifyToken, isSuperAdmin, updateUserRole);
router.put("/:id/profile-image", verifyToken, updateUserProfileImage);

export default router;

import { Router } from "express";
import { verifyToken, isSuperAdmin } from "../middlewares/authMiddleware";
import { 
    seedDefaultRoles, 
    getRoles, 
    createRole, 
    checkRoleExists, 
    updateRole, 
    deleteRole 
} from "../controllers/roleController";

const router = Router();

seedDefaultRoles();

router.get("/", verifyToken, isSuperAdmin, getRoles);
router.post("/", verifyToken, isSuperAdmin, createRole);
router.post("/check", verifyToken, isSuperAdmin, checkRoleExists);
router.put("/:id", verifyToken, isSuperAdmin, updateRole);
router.delete("/:id", verifyToken, isSuperAdmin, deleteRole);

export default router;

import { Router } from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import { getDashboardStats } from "../controllers/dashboardController";

const router = Router();

router.get("/", verifyToken, isAdmin, getDashboardStats);

export default router;

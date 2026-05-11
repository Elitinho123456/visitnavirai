import { Router } from "express";
import authRoutes from "./authRoutes";
import hotelRoutes from "./hotelRoutes";
import userRoutes from "./userRoutes";
import eventRoutes from "./eventRoutes";
import dashboardRoutes from "./dashboardRoutes";
import imageRoutes from "./imageRoutes";
import roleRoutes from "./roleRoutes";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World! Server is running.");
});

router.use("/auth", authRoutes);
router.use("/api/hotels", hotelRoutes);
router.use("/api/users", userRoutes);
router.use("/api/events", eventRoutes);
router.use("/api/dashboard/stats", dashboardRoutes);
router.use("/api/imgs", imageRoutes);
router.use("/api/roles", roleRoutes);

export default router;

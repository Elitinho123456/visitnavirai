import { Router } from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import { getEvents, createEvent, deleteEvent, updateEvent } from "../controllers/eventController";

const router = Router();

router.get("/", getEvents);
router.post("/", verifyToken, isAdmin, createEvent);
router.put("/:id", verifyToken, isAdmin, updateEvent);
router.delete("/:id", verifyToken, isAdmin, deleteEvent);

export default router;

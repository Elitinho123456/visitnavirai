import { Router } from "express";
import { verifyToken, requirePermission } from "../middlewares/authMiddleware";
import { getHotels, getHotelById, createHotel, updateHotel, deleteHotel } from "../controllers/hotelController";

const router = Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);
router.post("/", verifyToken, requirePermission('where_to_sleep', 'create'), createHotel);
router.put("/:id", verifyToken, requirePermission('where_to_sleep', 'edit'), updateHotel);
router.delete("/:id", verifyToken, requirePermission('where_to_sleep', 'delete'), deleteHotel);

export default router;

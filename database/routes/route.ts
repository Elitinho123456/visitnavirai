import { Router } from "express";
import login from "../auth/login";
import register from "../auth/register";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World! Server is running.");
});

router.post("/auth/login", login);
router.post("/auth/register", register);

export default router;
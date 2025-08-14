// import express from "express";
import { Router } from "express";
// const router = express.Router();
import login from "../controllers/authController.js";
import { guard } from "../middleware/guard.js";

const router = Router();
router.post("/login", login);
router.get("/check", guard);
export default router;

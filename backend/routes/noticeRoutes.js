// const express = require("express");
// const router = express.Router();
import { Router } from "express";
import {
  getActiveNotice,
  getArchivedNotice,
  createNotice,
  archiveNotice,
  deleteNotice,
  getAdmins,
} from "../controllers/noticeController.js";

import { guard } from "../middleware/guard.js";
const router = Router();
router.get("/", getActiveNotice);
router.get("/archived", getArchivedNotice);
router.get("/admins", getAdmins);

//adding routes for admin only functions
// in all of these the guard middleware runs first checking for teh admin priviledges and next function is onyl ran if authentication is successful
router.post("/", guard, createNotice);
router.put("/archive/:id", guard, archiveNotice);
router.delete("/:id", guard, deleteNotice);

export default router;

// const express = require("express");
// const router = express.Router();
import { Router } from "express";
import {
  getActiveNotice,
  getArchivedNotice,
} from "../controllers/noticeController.js";

const router = Router();
router.get("/", getActiveNotice);
router.get("/archived", getArchivedNotice);

export default router;

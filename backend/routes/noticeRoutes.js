const express = require("express");
const router = express.Router();
const {
  getActiveNotice,
  getArchivedNotice,
} = require("../controllers/noticeController");

router.get("/", getActiveNotice);
router.get("/archived", getArchivedNotice);

module.exports = router;

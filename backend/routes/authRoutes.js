const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const { guard } = require("../middleware/guard");

router.post("/login", login);
router.get("/check", guard);
module.exports = router;

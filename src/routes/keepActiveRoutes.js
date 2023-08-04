const express = require("express");

const { keepActive } = require("../controllers/keepActiveController.js");

const router = express.Router();

router.post("/api/keep-active", keepActive);

module.exports = router;

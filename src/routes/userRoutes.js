const express = require("express");
const { signUp, signIn, signOut } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signin", signOut);

// TODO: forgot password, update password

module.exports = router;

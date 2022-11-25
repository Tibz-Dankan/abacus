const express = require("express");
const {
  signUpClient,
  signUpAdmin,
  signIn,
  signOut,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signUpClient);
router.post("/signup-admin", signUpAdmin);
router.post("/signin", signIn);
router.post("/signin", signOut);

// TODO: forgot password, update password

module.exports = router;

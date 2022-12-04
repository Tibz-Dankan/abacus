const express = require("express");
const { verifyAdminToken } = require("../utils/verifyAdminToken");

const {
  signUpClient,
  signUpAdmin,
  signIn,
  signOut,
  generateAdminCode,
  getAdminCodes,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signUpClient);
router.post("/signup-admin", signUpAdmin);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.post("/generate-admin-code", verifyAdminToken, generateAdminCode);
router.get("/generate-admin-code", verifyAdminToken, getAdminCodes);
router.get("/get-admin-codes", verifyAdminToken, getAdminCodes);

// TODO: forgot password, update password

module.exports = router;

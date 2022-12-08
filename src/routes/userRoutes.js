const express = require("express");
const { verifyAdminToken } = require("../utils/verifyAdminToken");
const { verifyToken } = require("../utils/verifyToken");

const {
  signUpClient,
  signUpAdmin,
  signIn,
  signOut,
  getUpdatePassword,
  updatePassword,
  getForgotPassword,
  forgotPassword,
  getResetPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  generateAdminCode,
  getAdminCodes,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signUpClient);
router.post("/signup-admin", signUpAdmin);
router.post("/signin", signIn);
router.get("/signout", signOut);

router.get("/forgot-password", getForgotPassword);
router.post("/forgot-password", forgotPassword);

// router.get("/reset-password/:token", getResetPassword);
// router.post("/reset-password/:token", resetPassword);

router.get("/reset-password", getResetPassword);
router.post("/reset-password", resetPassword);

router.get("/update-password", verifyToken, getUpdatePassword);
router.post("/update-password", verifyToken, updatePassword);

router.get("/user-profile", verifyToken, getUserProfile);
router.post("/user-profile", verifyToken, updateUserProfile);

router.post("/generate-admin-code", verifyAdminToken, generateAdminCode);
router.get("/generate-admin-code", verifyAdminToken, getAdminCodes);
router.get("/get-admin-codes", verifyAdminToken, getAdminCodes);

// TODO: forgot password, update password

module.exports = router;

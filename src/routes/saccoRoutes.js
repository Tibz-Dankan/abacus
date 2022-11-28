const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const { verifyAdminToken } = require("../utils/verifyAdminToken");

const {
  getSaccoMembershipForm,
  applyForSaccoMembership,
  mySaccoData,
  saccoApplicants,
  singleSaccoApplication,
} = require("../controllers/saccoController");

const router = express.Router();

router.get("/apply-for-sacco-membership", verifyToken, getSaccoMembershipForm);
router.post(
  "/apply-for-sacco-membership",
  verifyToken,
  applyForSaccoMembership
);
router.get("/my-sacco-data", verifyToken, mySaccoData);

router.get("/sacco-applicants", verifyAdminToken, saccoApplicants);
router.get(
  "/single-sacco-membership-application",
  verifyAdminToken,
  singleSaccoApplication
);

module.exports = router;

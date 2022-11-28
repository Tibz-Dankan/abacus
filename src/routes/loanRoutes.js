const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const { verifyAdminToken } = require("../utils/verifyAdminToken");

const {
  getLoanForm,
  applyForLoan,
  myLoanData,
  startApplying,
  loanApplicants,
  singleLoanApplication,
} = require("../controllers/loanController");

const router = express.Router();

router.get("/start-applying", verifyToken, startApplying);
router.get("/apply-for-loan", verifyToken, getLoanForm);
router.post("/apply-for-loan", verifyToken, applyForLoan);
router.get("/my-loan-data", verifyToken, myLoanData);

router.get("/loan-applicants", verifyAdminToken, loanApplicants);
router.get("/single-loan-application", verifyAdminToken, singleLoanApplication);

module.exports = router;

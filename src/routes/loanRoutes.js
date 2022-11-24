const express = require("express");
const { verifyToken } = require("../utils/verifyToken");

const {
  apply,
  applyForLoan,
  myLoanApplicationData,
  getStarted,
  whoApplied,
} = require("../controllers/loanController");

const router = express.Router();

router.get("/apply", verifyToken, apply);
router.post("/apply", verifyToken, applyForLoan);
router.get("/apply", verifyToken, myLoanApplicationData);
router.get("/get-started", verifyToken, getStarted);
router.get("/who-applied", verifyToken, whoApplied);

module.exports = router;

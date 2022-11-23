const express = require("express");
const { verifyToken } = require("../utils/verifyToken");

const {
  apply,
  applyForLoan,
  myLoanApplicationData,
} = require("../controllers/loanController");

const router = express.Router();

router.get("/apply", verifyToken, apply);
router.post("/apply", verifyToken, applyForLoan);
router.get("/apply", verifyToken, myLoanApplicationData);

module.exports = router;

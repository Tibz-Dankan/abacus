const express = require("express");

const { verifyToken } = require("../utils/verifyToken");

const {
  getLoanFile,
  uploadLoanFile,
  upload,
} = require("../controllers/fileController");

const router = express.Router();

router.get("/upload-loan-file/", verifyToken, getLoanFile);
router.post(
  "/upload-loan-file/",
  verifyToken,
  upload.single("loanFile"),
  uploadLoanFile
);

module.exports = router;

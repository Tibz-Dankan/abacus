const express = require("express");

const { verifyToken } = require("../utils/verifyToken");

const {
  getUserFile,
  uploadUserFile,
  upload,
} = require("../controllers/fileController");

const router = express.Router();

router.get("/upload-application-file", verifyToken, getUserFile);
router.post(
  "/upload-application-file",
  verifyToken,
  upload.single("loanFile"),
  uploadUserFile
);

module.exports = router;

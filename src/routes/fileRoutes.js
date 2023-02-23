const express = require("express");

const { verifyAdminToken } = require("../utils/verifyAdminToken");
const { verifyToken } = require("../utils/verifyToken");

const {
  getUserFile,
  uploadUserFile,
  upload,
  getUploadedFiles,
} = require("../controllers/fileController");

const router = express.Router();

router.get("/upload-application-file", verifyToken, getUserFile);
router.post(
  "/upload-application-file",
  verifyToken,
  upload.single("loanFile"),
  uploadUserFile
);
router.get("/application-files-uploaded", verifyAdminToken, getUploadedFiles);

module.exports = router;

const express = require("express");

const { verifyAdminToken } = require("../utils/verifyAdminToken");
const { verifyToken } = require("../utils/verifyToken");

const {
  getUserFile,
  uploadUserFile,
  upload,
  getUploadedFiles,
  AdminGetFile,
  AdminUploadFile,
  AdminUpdateFile,
  markFileRead,
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
router.get("/admin-upload-files", verifyAdminToken, AdminGetFile);
router.post(
  "/admin-upload-files",
  verifyAdminToken,
  upload.single("uploadFile"),
  AdminUploadFile
);
router.post(
  "/admin-update-files",
  verifyAdminToken,
  upload.single("uploadFile"),
  AdminUpdateFile
);
router.post("/mark-file-read", verifyAdminToken, markFileRead);

module.exports = router;

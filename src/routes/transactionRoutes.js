const express = require("express");

const { verifyAdminToken } = require("../utils/verifyAdminToken");
const { verifyToken } = require("../utils/verifyToken");

const { upload } = require("../controllers/fileController");
const {
  getTransactionRequest,
  postTransactionRequest,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/transaction-request", verifyToken, getTransactionRequest);
router.post("/transaction-request", verifyToken, postTransactionRequest);

// router.get("/application-files-uploaded", verifyAdminToken, getUploadedFiles);
// router.post(
//   "/admin-upload-files",
//   verifyAdminToken,
//   upload.single("uploadFile"),
//   AdminUploadFile
// );

module.exports = router;

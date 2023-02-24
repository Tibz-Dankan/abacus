const multer = require("multer");
const { firebaseApp } = require("../config/firebaseConfig");
const { getStorage, deleteObject } = require("firebase/storage");
const { ref, uploadString, getDownloadURL } = require("firebase/storage");
const path = require("path");
const {
  decodeJwtGetUserId,
  decodeJwtGetUserName,
} = require("../utils/decodeJwt");
const { catchError } = require("../utils/catchError");
const { signedInUser } = require("../utils/signedInUser");
const { baseUrl } = require("../utils/constants");
const { elapsedTime } = require("../utils/date");

const User = require("../models/user");
const File = require("../models/file");

const noFileMessage = (req, res, pageName) => {
  return res.render(pageName, {
    urls: {},
    myFiles: [],
    message: "please provide a file",
    isSuccess: false,
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const fileNotApprovedMessage = (req, res, pageName) => {
  return res.render(pageName, {
    urls: {},
    myFiles: [],
    message: "You already uploaded an application for this category",
    isSuccess: false,
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const fileDir = (fileCategory) => {
  if (fileCategory == "loan") return "loans/files";
  if (fileCategory == "sacco") return "sacco/files";
};

const bufferToBase64 = (buffer) => {
  return Buffer.from(buffer).toString("base64");
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 },
});

// user file is either loan form file or sacco form file
const uploadUserFile = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);
    const username = decodeJwtGetUserName(req.cookies);
    const fileBuffer = req.file.buffer;
    const category = req.body.category;
    const fileDate = new Date(Date.now());
    const isRead = false;
    const isApproved = false;

    console.log("req.file");
    console.log(req.file);

    if (!fileBuffer) return noFileMessage(req, res, "user-application-file");

    const fileBase64 = bufferToBase64(fileBuffer);
    const extension = path.extname(req.file.originalname);
    let filename;

    if (category == "loan") {
      filename = `${username}_loan_${Date.now()}${extension}`;
    } else {
      filename = `${username}_sacco_${Date.now()}${extension}`;
    }

    const file = await File.findByUserId(userId);

    if (
      file.rows[0] &&
      !file.rows[0].is_approved &&
      file.rows[0].category === category
    ) {
      return fileNotApprovedMessage(req, res, "user-application-file");
    }

    const firebaseStorage = getStorage(firebaseApp);
    let fileRef;

    if (process.env.NODE_ENV === "production") {
      fileRef = ref(firebaseStorage, `prod/${fileDir(category)}/${filename}`);
    } else {
      fileRef = ref(firebaseStorage, `dev/${fileDir(category)}/${filename}`);
    }

    await uploadString(fileRef, fileBase64, "base64");

    const downloadURL = await getDownloadURL(fileRef);
    console.log(downloadURL);

    await File.save(
      userId,
      category,
      filename,
      downloadURL,
      fileDate,
      isRead,
      isApproved
    );
    const myFiles = await File.findByUserId(userId);

    res.render("user-application-file", {
      urls: {},
      myFiles: myFiles.rows,
      message: "Application uploaded successfully",
      isSuccess: true,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "user-application-file");
  }
};

const applicationURL = (applicationArr) => {
  const urls = {};
  if (!applicationArr[0]) {
    console.log("No application forms available in the system");
  }
  applicationArr.map((application) => {
    if (application.category == "loan") {
      urls.loan = application.url;
    }
    if (application.category == "sacco") {
      urls.sacco = application.url;
    }
  });
  return urls;
};

const computeElapsedTime = (fileArr) => {
  let files = [];
  if (!fileArr[0]) return files;

  fileArr.map((file, index) => {
    if (index < fileArr.length) {
      file.elapsedTime = elapsedTime(file.file_date);
      files.push(file);
    }
  });
  return files;
};

const getUserFile = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);

    const file = await File.findAllApplications();
    const urls = applicationURL(file.rows);

    const fileApplications = await File.findByUserId(userId);

    const myFiles = computeElapsedTime(fileApplications.rows);

    res.render("user-application-file", {
      urls: {
        loan: urls.loan,
        sacco: urls.sacco,
      },
      myFiles: myFiles,
      message: "",
      isSuccess: true,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "user-application-file");
  }
};

const AdminGetFile = async (req, res) => {
  try {
    const file = await File.findAllApplications();
    const urls = applicationURL(file.rows);

    res.render("admin-upload-files", {
      urls: {
        loan: urls.loan,
        sacco: urls.sacco,
      },
      message: "",
      isSuccess: true,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "admin-upload-files");
  }
};

// upload application files to be done by only admins
const AdminUploadFile = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);
    const fileBuffer = req.file.buffer;
    const category = req.body.category;
    const fileDate = new Date(Date.now());

    console.log("req.file");
    console.log(req.file);

    if (!fileBuffer) return noFileMessage(req, res, "admin-upload-files");

    const fileBase64 = bufferToBase64(fileBuffer);
    const extension = path.extname(req.file.originalname);
    let filename;

    if (category == "loan") {
      filename = `Abacus_loan_form_${fileDate.getFullYear()}${extension}`;
    } else {
      filename = `Abacus_open_account_form_${fileDate.getFullYear()}${extension}`;
    }

    const firebaseStorage = getStorage(firebaseApp);
    let fileRef;

    if (process.env.NODE_ENV === "production") {
      fileRef = ref(firebaseStorage, `prod/${fileDir(category)}/${filename}`);
    } else {
      fileRef = ref(firebaseStorage, `dev/${fileDir(category)}/${filename}`);
    }

    await uploadString(fileRef, fileBase64, "base64");

    const downloadURL = await getDownloadURL(fileRef);
    console.log("downloadURL from firebase");
    console.log(downloadURL);

    await File.saveApplication(
      userId,
      category,
      filename,
      downloadURL,
      fileDate
    );
    const file = await File.findAllApplications();
    const urls = applicationURL(file.rows);

    res.render("admin-upload-files", {
      urls: {
        loan: urls.loan,
        sacco: urls.sacco,
      },
      message: "File uploaded successfully",
      isSuccess: true,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "admin-upload-files");
  }
};

// upload application files to be done by only admins
const AdminUpdateFile = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);
    const fileBuffer = req.file.buffer;
    const category = req.body.category;
    const fileDate = new Date(Date.now());

    console.log("req.file");
    console.log(req.file);

    if (!fileBuffer) return noFileMessage(req, res, "admin-upload-files");

    const fileBase64 = bufferToBase64(fileBuffer);
    const extension = path.extname(req.file.originalname);
    let filename;

    if (category == "loan") {
      filename = `Abacus_loan_form_${fileDate.getFullYear()}${extension}`;
    } else {
      filename = `Abacus_open_account_form_${fileDate.getFullYear()}${extension}`;
    }

    const findingFile = await File.findApplicationByCategory(category);
    const file = findingFile.rows[0];
    console.log("file");
    console.log(file);

    const firebaseStorage = getStorage(firebaseApp);
    let fileRef, delFileRef;

    if (process.env.NODE_ENV === "production") {
      fileRef = ref(firebaseStorage, `prod/${fileDir(category)}/${filename}`);
      delFileRef = ref(
        firebaseStorage,
        `prod/${fileDir(category)}/${file.file_name}`
      );
    } else {
      fileRef = ref(firebaseStorage, `dev/${fileDir(category)}/${filename}`);
      delFileRef = ref(
        firebaseStorage,
        `dev/${fileDir(category)}/${file.file_name}`
      );
    }
    await uploadString(fileRef, fileBase64, "base64");

    const downloadURL = await getDownloadURL(fileRef);
    console.log("downloadURL from firebase");
    console.log(downloadURL);

    await File.updateApplication(
      userId,
      category,
      filename,
      downloadURL,
      fileDate
    );

    if (file.url) {
      await deleteObject(delFileRef);
    }

    const applicationFiles = await File.findAllApplications();
    const urls = applicationURL(applicationFiles.rows);

    res.render("admin-upload-files", {
      urls: {
        loan: urls.loan,
        sacco: urls.sacco,
      },
      message: "File updated successfully",
      isSuccess: true,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "admin-upload-files");
  }
};

const computeElapseTime = (uploadArr) => {
  let uploads = [];
  if (!uploadArr[0]) return uploads;

  uploadArr.map((upload, index) => {
    if (index < uploadArr.length) {
      upload.elapsedTime = elapsedTime(upload.file_date);
      if (upload.category == "sacco") {
        upload.category = "open account";
      }
      uploads.push(upload);
    }
  });
  return uploads;
};

const getUploadedFiles = async (req, res) => {
  try {
    const fileUploads = await File.findAll();
    console.log(fileUploads.rows);

    const uploads = computeElapseTime(fileUploads.rows);
    console.log(uploads);

    res.render("application-files-uploaded", {
      uploads: uploads,
      message: "",
      isSuccess: true,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "application-files-uploaded");
  }
};

module.exports = {
  getUserFile,
  uploadUserFile,
  upload,
  getUploadedFiles,
  AdminGetFile,
  AdminUploadFile,
  AdminUpdateFile,
  applicationURL,
};

// user file (loan file or sacco file)

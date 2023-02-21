const multer = require("multer");
const { firebaseApp } = require("../config/firebaseConfig");
const { getStorage, deleteObject, uploadBytes } = require("firebase/storage");
const { ref, uploadString, getDownloadURL } = require("firebase/storage");
const path = require("path");
const {
  decodeJwtGetUserId,
  decodeJwtGetUserName,
} = require("../utils/decodeJwt");
const { catchError } = require("../utils/catchError");
const { signedInUser } = require("../utils/signedInUser");
const { baseUrl } = require("../utils/constants");

const User = require("../models/user");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 },
});

const uploadLoanFile = async (req, res) => {
  const userId = decodeJwtGetUserId(req.cookies);
  const username = decodeJwtGetUserName(req.cookies);

  console.log("req.file");
  console.log(req.file);

  const buffer = req.file.buffer;

  const file = buffer.toString("ascii");

  console.log("file");
  console.log(file);

  //   return;
  //   TODO: ensure that file is not empty

  const extension = path.extname(req.file.originalname); //To be made dynamic

  const filename = `${Date.now()}_${username}${extension}`;

  let user = await User.getUserById(userId);

  const firebaseStorage = getStorage(firebaseApp);
  let fileRef, delFileRef;

  if (process.env.NODE_ENV === "production") {
    fileRef = ref(firebaseStorage, `prod/loans/files/${filename}`);
    // delFileRef = ref(firebaseStorage, `prod/loans/files/${user.filename}`);
  } else {
    fileRef = ref(firebaseStorage, `dev/loans/files/${filename}`);
    // delFileRef = ref(firebaseStorage, `dev/loans/files/${user.filename}`);
  }

  await uploadString(fileRef, file, "base64"); // uploading file

  //   // 'file' comes from the Blob or File API
  //   uploadBytes(fileRef, req.file.buffer).then((snapshot) => {
  //     console.log("Uploaded a blob or file!");
  //   });

  const downloadURL = await getDownloadURL(fileRef);

  console.log("downloadURL from firebase");
  console.log(downloadURL);

  //   if (user.imageUrl) {
  //     await deleteObject(delFileRef);
  //   }

  //   user = await User.updatePhoto(userId, imageName, downloadURL);
  //   res.status(200).json({ status: "success", user: user });
};

const getLoanFile = (req, res) => {
  try {
    // fetch file download url from the database and attach to the template

    res.render("loan-file", {
      fileUrl: "",
      message: "",
      isSuccess: false,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "loan-file");
  }
};

module.exports = { getLoanFile, uploadLoanFile, upload };

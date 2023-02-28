const { firebaseApp } = require("../config/firebaseConfig");
const { getStorage, deleteObject } = require("firebase/storage");
const { ref, uploadString, getDownloadURL } = require("firebase/storage");
const { decodeJwtGetUserId } = require("../utils/decodeJwt");
const { catchError } = require("../utils/catchError");
const { signedInUser } = require("../utils/signedInUser");
const { baseUrl } = require("../utils/constants");
const { elapsedTime } = require("../utils/date");
const { bufferToBase64 } = require("./fileController");
const Transaction = require("../models/transaction");

const noTransactionCategory = (req, res) => {
  return res.render("transaction-request", {
    transactions: [],
    message: "No transaction category selected",
    isSuccess: false,
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const notRespondedToTransaction = (req, res) => {
  return res.render("transaction-request", {
    transactions: [],
    message:
      "You already requested a transaction in this category whose response is pending",
    isSuccess: false,
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const fileDir = (fileCategory) => {
  if (fileCategory == "loan") return "transactions/loans";
  if (fileCategory == "sacco") return "transactions/sacco";
};

const computeTransactionElapse = (transactionArr) => {
  let transactions = [];
  if (!transactionArr[0]) return transactions;

  transactionArr.map((transaction, index) => {
    if (transaction.response_date) {
      transaction.responseElapseTime = elapsedTime(transaction.response_date);
    }
    transaction.requestElapseTime = elapsedTime(transaction.request_date);
    transactions.push(transaction);
  });
  return transactions;
};

const getTransactionRequest = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);

    const fetchMyTransactions = await Transaction.findByRequestId(userId);

    const transactions = computeTransactionElapse(fetchMyTransactions.rows);
    console.log("transactions");
    console.log(transactions);

    // compute elapse time
    res.render("transaction-request", {
      transactions: transactions,
      message: "",
      isSuccess: false,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "transaction-request");
  }
};

const postTransactionRequest = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);
    const category = req.body.category;
    const requestDate = new Date(Date.now()).toISOString();
    const isResponded = false;

    if (!category) return noTransactionCategory(req, res);

    const transaction = await Transaction.findByRequestIdCategory(
      userId,
      category
    );

    if (!transaction.rows[0].is_responded) {
      return notRespondedToTransaction(req, res);
    }

    await Transaction.saveRequest(userId, category, requestDate, isResponded);

    const fetchMyTransactions = await Transaction.findByRequestId(userId);

    const transactions = computeTransactionElapse(fetchMyTransactions.rows);
    console.log("transactions");
    console.log(transactions);

    // compute elapse time
    res.render("transaction-request", {
      transactions: transactions,
      message: "Transaction request successful",
      isSuccess: true,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "transaction-request");
  }
};

const getTransactionsRequested = async (req, res) => {
  try {
    const allTransactions = await Transaction.findAll();

    const transactions = computeTransactionElapse(allTransactions.rows);
    console.log("transactions");
    console.log(transactions);

    res.render("transactions-requested", {
      transactions: transactions,
      message: "",
      isSuccess: false,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "transactions-requested");
  }
};

const getTransactionUpload = async (req, res) => {
  try {
    const transactionId = req.query.transactionId;
    const singleTransaction = await Transaction.findByTransactionId(
      transactionId
    );
    const transactions = computeTransactionElapse(singleTransaction.rows);
    console.log("transactions");
    console.log(transactions);

    res.render("transaction-upload", {
      transaction: transactions[0],
      message: "",
      isSuccess: false,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "transaction-upload");
  }
};

const postTransactionUpload = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);
    const transactionId = req.body.transactionId;
    const fileBuffer = req.file.buffer;
    const responseDate = new Date(Date.now()).toISOString();
    const fileName = req.file.originalname;
    const isResponded = true;

    const fileBase64 = bufferToBase64(fileBuffer);

    const findingFile = await Transaction.findByTransactionId(transactionId);
    const file = findingFile.rows[0];
    const category = file.category;

    const filename = `${Date.now()}_${fileName}`;

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
    console.log("starting to upload");
    await uploadString(fileRef, fileBase64, "base64");

    const downloadURL = await getDownloadURL(fileRef);
    console.log("downloadURL from firebase");
    console.log(downloadURL);

    await Transaction.update(
      transactionId,
      userId,
      responseDate,
      downloadURL,
      filename,
      isResponded
    );

    if (file.url && file.is_responded) {
      await deleteObject(delFileRef);
    }

    const singleTransaction = await Transaction.findByTransactionId(
      transactionId
    );
    const transactions = computeTransactionElapse(singleTransaction.rows);

    res.render("transaction-upload", {
      transaction: transactions[0],
      message: "File uploaded successfully",
      isSuccess: false,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "transaction-upload");
  }
};

module.exports = {
  getTransactionRequest,
  postTransactionRequest,
  getTransactionsRequested,
  getTransactionUpload,
  postTransactionUpload,
};

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

const computeTransactionElapse = (transactionArr) => {
  let transactions = [];
  if (!transactionArr[0]) return transactions;

  transactionArr.map((transaction, index) => {
    // if (index < transactionArr.length) {
    transaction.requestElapseTime = elapsedTime(transaction.request_date);
    transactions.push(transaction);
    // }
    if (transaction.response_date) {
      transaction.responseElapseTime = elapsedTime(transaction.response_date);
      transactions.push(transaction);
    }
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

module.exports = {
  getTransactionRequest,
  postTransactionRequest,
  getTransactionsRequested,
};

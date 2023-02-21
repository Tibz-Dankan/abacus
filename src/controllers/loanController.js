const Loan = require("../models/loan");
const { catchError } = require("../utils/catchError");
const { decodeJwtGetUserId } = require("../utils/decodeJwt");
const { signedInUser } = require("../utils/signedInUser");
const { baseUrl } = require("../utils/constants");
const { dateOne } = require("../utils/date");

const noEmptyFieldMessage = (req, res, loanObject) => {
  return res.render("apply-for-loan", {
    message: "please fill out all fields",
    user: loanObject,
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const alreadyHaveLoanMessage = (req, res, loanObject) => {
  return res.render("apply-for-loan", {
    message: "You already applied for a loan whose approval is pending",
    user: loanObject,
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const noLoanIdMessage = (req, res) => {
  return res.render("single-loan-application", {
    message:
      "You no loan id is provided, contact the developers to fix the issue",
    loanApplication: {},
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const invalidLoanIdMessage = (req, res) => {
  return res.render("approve-loan", {
    message: "Invalid loan Id",
    isSuccess: false,
    loanApplication: {},
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const loanAlreadyMessage = (req, res) => {
  return res.render("approve-loan", {
    message: "Loan already approved",
    isSuccess: false,
    loanApplication: {},
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const startApplying = async (req, res) => {
  try {
    res.render("start-applying", {
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "start-applying");
  }
};

const getLoanForm = async (req, res) => {
  try {
    res.render("apply-for-loan", {
      message: "",
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "apply-for-loan");
  }
};

const applyForLoan = async (req, res) => {
  try {
    console.log(req.body);
    const userId = decodeJwtGetUserId(req.cookies);
    const loanAmount = req.body.loanAmount;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const jobDescription = req.body.jobDescription;
    const phoneNumber = req.body.phoneNumber;
    const cityOrTown = req.body.cityOrTown;
    const isSettled = false;
    const isApproved = false;
    const isRead = false;
    const loanDate = new Date(Date.now()).toISOString();
    console.log(loanDate);

    const loanObject = {};
    loanObject.loanAmount = loanAmount;
    loanObject.firstName = firstName;
    loanObject.lastName = lastName;
    loanObject.gender = gender;
    loanObject.phoneNumber = phoneNumber;
    loanObject.cityOrTown = cityOrTown;

    if (
      !loanAmount ||
      !firstName ||
      !lastName ||
      !gender ||
      !jobDescription ||
      !phoneNumber ||
      !cityOrTown
    ) {
      return noEmptyFieldMessage(req, res, loanObject);
    }

    const loan = await Loan.getLoanApplicationByUserId(userId);
    if (loan.rows[0] && loan.rows[0].is_settled === false) {
      return alreadyHaveLoanMessage(req, res, loanObject);
    }

    await Loan.saveLoanApplicationData(
      userId,
      firstName,
      lastName,
      gender,
      jobDescription,
      phoneNumber,
      cityOrTown,
      loanAmount,
      isSettled,
      isRead,
      loanDate,
      isApproved
    );

    res.redirect("/my-loan-data");
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "apply-for-loan");
  }
};

const formatLoanDate = (loanArr) => {
  let loans = [];
  if (!loanArr[0]) return loans;

  loanArr.map((loan, index) => {
    if (index < loanArr.length) {
      loan.dateMany = dateOne(loan.loan_date);
      loans.push(loan);
    }
  });
  return loans;
};

const myLoanData = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);
    const loan = await Loan.getLoanApplicationByUserId(userId);

    const applications = formatLoanDate(loan.rows);

    res.render("my-loan-applications", {
      message: "",
      myLoanData: applications,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "my-loan-applications");
  }
};

const loanApplicants = async (req, res) => {
  try {
    const applicants = await Loan.getAllLoanApplications();
    res.render("loan-applicants", {
      message: "",
      loanApplicants: applicants.rows,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "loan-applicants");
  }
};

const singleLoanApplication = async (req, res) => {
  try {
    const loanId = req.query.loanId;
    if (!loanId) return noLoanIdMessage(req, res);

    const loan = await Loan.getLoanApplicationByLoanId(loanId);
    let application = loan.rows[0];

    if (application.is_read === false) {
      await Loan.applicationRead(loanId);
    }

    application.dateOne = dateOne(application.loan_date);

    res.render("single-loan-application", {
      message: "",
      loanApplication: application,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "single-loan-application");
  }
};

const approveLoan = async (req, res) => {
  try {
    const loanId = req.query.loanId;
    if (!loanId) return noLoanIdMessage(req, res);

    const loan = await Loan.getLoanApplicationByLoanId(loanId);

    let application = loan.rows[0];

    if (!application) {
      return invalidLoanIdMessage(req, res);
    }
    if (application.is_approved) {
      return loanAlreadyMessage(req, res);
    }
    await Loan.approved(loanId);

    application.dateOne = dateOne(application.loan_date);

    res.render("approve-loan", {
      message: "Loan approved successfully",
      isSuccess: true,
      loanApplication: application,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "approve-loan");
  }
};

module.exports = {
  startApplying,
  getLoanForm,
  applyForLoan,
  myLoanData,
  loanApplicants,
  singleLoanApplication,
  approveLoan,
};

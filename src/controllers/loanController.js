const Loan = require("../models/loan");
const { catchError } = require("../utils/catchError");
const { decodeJwtGetUserId } = require("../utils/decodeJwt");
const { signedInUser } = require("../utils/signedInUser");

const noEmptyFieldMessage = (req, res, loanObject) => {
  return res.render("apply-for-loan", {
    message: "please fill out all fields",
    user: loanObject,
    signedInUser: signedInUser(req.cookies),
  });
};

const alreadyHaveLoanMessage = (req, res, loanObject) => {
  return res.render("apply-for-loan", {
    message: "You already applied for a loan whose approval is pending",
    user: loanObject,
    signedInUser: signedInUser(req.cookies),
  });
};

const noLoanIdMessage = (req, res) => {
  return res.render("single-loan-application", {
    message:
      "You no loan id is provided, contact the developers to fix the issue",
    loanApplication: {},
    signedInUser: signedInUser(req.cookies),
  });
};

const startApplying = async (req, res) => {
  try {
    res.render("start-applying", {
      signedInUser: signedInUser(req.cookies),
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
    const loanCategory = req.body.loanCategory;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const jobDescription = req.body.jobDescription;
    const phoneNumber = req.body.phoneNumber;
    const cityOrTown = req.body.cityOrTown;
    const isSettled = false;
    const isRead = false;
    // TODO : capture loan application date

    const loanObject = {};
    loanObject.loanAmount = loanAmount;
    loanObject.loanCategory = loanCategory;
    loanObject.firstName = firstName;
    loanObject.lastName = lastName;
    loanObject.gender = gender;
    loanObject.phoneNumber = phoneNumber;
    loanObject.cityOrTown = cityOrTown;

    if (
      !loanAmount ||
      !loanCategory ||
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
      loanCategory,
      isSettled,
      isRead
    );

    res.redirect("/my-loan-data");
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "apply-for-loan");
  }
};

const myLoanData = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);
    const myApplicationData = await Loan.getLoanApplicationByUserId(userId);
    res.render("my-loan-applications", {
      message: "",
      myLoanData: myApplicationData.rows,
      signedInUser: signedInUser(req.cookies),
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

    const application = await Loan.getLoanApplicationByLoanId(loanId);
    if (application.rows[0].is_read === false) {
      await Loan.applicationRead(loanId);
    }
    res.render("single-loan-application", {
      message: "",
      loanApplication: application.rows[0],
      signedInUser: signedInUser(req.cookies),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "single-loan-application");
  }
};

module.exports = {
  startApplying,
  getLoanForm,
  applyForLoan,
  myLoanData,
  loanApplicants,
  singleLoanApplication,
};

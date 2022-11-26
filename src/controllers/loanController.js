const Loan = require("../models/loan");
const { catchError } = require("../utils/catchError");
const { decodeJwtGetUserId } = require("../utils/decodeJwt");

const noEmptyFieldMessage = (res, loanObject) => {
  return res.render("apply-for-loan", {
    message: "please fill out all fields",
    user: loanObject,
  });
};

const alreadyHaveLoanMessage = (res, loanObject) => {
  return res.render("apply-for-loan", {
    message: "You already applied for a loan whose approval is pending",
    user: loanObject,
  });
};

const startApplying = async (req, res) => {
  try {
    res.render("start-applying");
  } catch (error) {
    console.log(error);
  }
};

const getLoanForm = async (req, res) => {
  try {
    res.render("apply-for-loan", { message: "" });
  } catch (error) {
    console.log(error);
    if (error) return catchError(res, "apply-for-loan");
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
      return noEmptyFieldMessage(res, loanObject);
    }

    const loan = await Loan.getLoanApplicationByUserId(userId);
    if (loan.rows[0] && loan.rows[0].is_settled === false) {
      return alreadyHaveLoanMessage(res, loanObject);
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
    if (error) return catchError(res, "apply-for-loan");
  }
};

const myLoanData = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);
    const myApplicationData = await Loan.getLoanApplicationByUserId(userId);
    res.render("my-loan-applications", {
      myLoanData: myApplicationData.rows,
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(res, "my-loan-applications");
  }
};

const loanApplicants = async (req, res) => {
  try {
    const applicants = await Loan.getAllLoanApplications();
    res.render("loan-applicants", {
      loanApplicants: applicants.rows,
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(res, "loan-applicants");
  }
};

module.exports = {
  startApplying,
  getLoanForm,
  applyForLoan,
  myLoanData,
  loanApplicants,
};

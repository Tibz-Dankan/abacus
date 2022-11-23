const Loan = require("../models/loan");
const { decodeJwtGetUserId } = require("../utils/decodeJwt");

const noEmptyFieldMessage = (res, loanObject) => {
  return res.render("apply", {
    message: "please fill out all fields",
    user: loanObject,
  });
};

const apply = async (req, res) => {
  try {
    res.render("apply");
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const applyForLoan = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);
    const loanAmount = req.body.loanAmount;
    const loanCategory = req.body.loanCategory;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const phoneNumber = req.body.phoneNumber;
    const cityOrTown = req.body.cityOrTown;

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
      !phoneNumber ||
      !cityOrTown
    ) {
      return noEmptyFieldMessage(res, loanObject);
    }

    return res.json({ status: "success" });

    // save loan details in the database
    await Loan.saveLoanApplicationData(
      userId,
      firstName,
      lastName,
      gender,
      phoneNumber,
      cityOrTown,
      loanAmount,
      loanCategory
    );
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const myLoanApplicationData = async (req, res) => {
  let userId; // To be removed
  //   const userId = decodeJwtGetUserId(req.cookies);
  const myApplicationData = await Loan.getLoanApplicationByUserId(userId);
  res.render("apply", {
    loanApplicationData: myApplicationData.rows,
  });
};

module.exports = { apply, applyForLoan, myLoanApplicationData };

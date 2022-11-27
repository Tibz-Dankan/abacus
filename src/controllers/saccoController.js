const Sacco = require("../models/sacco");
const { catchError } = require("../utils/catchError");
const { decodeJwtGetUserId } = require("../utils/decodeJwt");

const noEmptyFieldMessage = (res, saccoObject) => {
  return res.render("apply-for-sacco-membership", {
    message: "please fill out all fields",
    user: saccoObject,
  });
};

const appliedForSaccoMessage = (res, saccoObject) => {
  return res.render("apply-for-sacco-membership", {
    message:
      "You already applied for sacco membership whose approval is pending",
    user: saccoObject,
  });
};

const getSaccoMembershipForm = async (req, res) => {
  try {
    res.render("apply-for-sacco-membership", { message: "" });
  } catch (error) {
    console.log(error);
    if (error) return catchError(res, "apply-for-sacco-membership");
  }
};

const applyForSaccoMembership = async (req, res) => {
  try {
    console.log(req.body);
    const userId = decodeJwtGetUserId(req.cookies);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const jobDescription = req.body.jobDescription;
    const phoneNumber = req.body.phoneNumber;
    const cityOrTown = req.body.cityOrTown;
    const isAccepted = false;
    const isRead = false;
    // TODO : capture sacco membership application date

    const saccoObject = {};
    saccoObject.firstName = firstName;
    saccoObject.lastName = lastName;
    saccoObject.gender = gender;
    saccoObject.phoneNumber = phoneNumber;
    saccoObject.cityOrTown = cityOrTown;

    if (
      !firstName ||
      !lastName ||
      !gender ||
      !jobDescription ||
      !phoneNumber ||
      !cityOrTown
    ) {
      return noEmptyFieldMessage(res, saccoObject);
    }

    const sacco = await Sacco.getSaccoApplicationByUserId(userId);
    if (sacco.rows[0] && sacco.rows[0].is_accepted === false) {
      return appliedForSaccoMessage(res, saccoObject);
    }

    await Sacco.saveSaccoMembershipApplication(
      userId,
      firstName,
      lastName,
      gender,
      jobDescription,
      phoneNumber,
      cityOrTown,
      isAccepted,
      isRead
    );

    res.redirect("my-sacco-data");
  } catch (error) {
    console.log(error);
    if (error) return catchError(res, "apply-for-sacco-membership");
  }
};

const mySaccoData = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);
    const myApplicationData = await Sacco.getSaccoApplicationByUserId(userId);
    res.render("my-sacco-membership-applications", {
      message: "",
      mySaccoData: myApplicationData.rows,
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(res, "my-sacco-membership-applications");
  }
};

const saccoApplicants = async (req, res) => {
  try {
    const applicants = await Sacco.getAllSaccoApplications();
    console.log("sacco membership applicants");
    console.log(applicants.rows);
    res.render("sacco-applicants", {
      message: "",
      saccoApplicants: applicants.rows,
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(res, "sacco-applicants");
  }
};

const singleSaccoApplication = async (req, res) => {
  try {
    const saccoId = req.params.saccoId;
    const application = await Sacco.getSaccoApplicationBySaccoId(saccoId);

    if (application.rows[0].is_read === false) {
      await Sacco.applicationRead(saccoId);
    }
    res.render("single-sacco-membership-application", {
      message: "",
      saccoApplication: application.rows[0],
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(res, "single-sacco-membership-application");
  }
};

module.exports = {
  getSaccoMembershipForm,
  applyForSaccoMembership,
  mySaccoData,
  saccoApplicants,
  singleSaccoApplication,
};

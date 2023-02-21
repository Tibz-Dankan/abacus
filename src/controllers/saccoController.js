"use strict";

const Sacco = require("../models/sacco");
const { catchError } = require("../utils/catchError");
const { decodeJwtGetUserId } = require("../utils/decodeJwt");
const { signedInUser } = require("../utils/signedInUser");
const { baseUrl } = require("../utils/constants");
const { dateOne } = require("../utils/date");

const noEmptyFieldMessage = (req, res, saccoObject) => {
  return res.render("apply-for-sacco-membership", {
    message: "please fill out all fields",
    user: saccoObject,
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const appliedForSaccoMessage = (req, res, saccoObject) => {
  return res.render("apply-for-sacco-membership", {
    message:
      "You already applied for sacco membership whose approval is pending",
    user: saccoObject,
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const noSaccoIdMessage = (req, res) => {
  return res.render("single-sacco-membership-application", {
    message: "No sacco id is provided, contact the developers to fix the issue",
    saccoApplication: {},
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const invalidSaccoIdMessage = (req, res) => {
  return res.render("approve-sacco", {
    message: "Invalid sacco Id",
    isSuccess: false,
    saccoApplication: {},
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const saccoAlreadyMessage = (req, res) => {
  return res.render("approve-sacco", {
    message: "Sacco already approved",
    isSuccess: false,
    saccoApplication: {},
    signedInUser: signedInUser(req.cookies),
    baseUrl: baseUrl(),
  });
};

const getSaccoMembershipForm = async (req, res) => {
  try {
    res.render("apply-for-sacco-membership", {
      message: "",
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "apply-for-sacco-membership");
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
    const isApproved = false;
    const isRead = false;
    const saccoDate = new Date(Date.now()).toISOString();

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
      return noEmptyFieldMessage(req, res, saccoObject);
    }

    const sacco = await Sacco.getSaccoApplicationByUserId(userId);
    if (sacco.rows[0] && sacco.rows[0].is_accepted === false) {
      return appliedForSaccoMessage(req, res, saccoObject);
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
      isRead,
      saccoDate,
      isApproved
    );

    res.redirect("my-sacco-data");
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "apply-for-sacco-membership");
  }
};

const formatSaccoDate = (saccoArr) => {
  let sacco = [];
  if (!saccoArr[0]) return sacco;

  saccoArr.map((loan, index) => {
    if (index < saccoArr.length) {
      loan.dateMany = dateOne(loan.sacco_date);
      sacco.push(loan);
    }
  });
  return sacco;
};

const mySaccoData = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);
    const sacco = await Sacco.getSaccoApplicationByUserId(userId);

    const applications = formatSaccoDate(sacco.rows);

    res.render("my-sacco-membership-applications", {
      message: "",
      mySaccoData: applications,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "my-sacco-membership-applications");
  }
};

const saccoApplicants = async (req, res) => {
  try {
    const applicants = await Sacco.getAllSaccoApplications();
    res.render("sacco-applicants", {
      message: "",
      saccoApplicants: applicants.rows,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "sacco-applicants");
  }
};

const singleSaccoApplication = async (req, res) => {
  try {
    const saccoId = req.query.saccoId;
    if (!saccoId) return noSaccoIdMessage(req, res);
    const sacco = await Sacco.getSaccoApplicationBySaccoId(saccoId);

    let application = sacco.rows[0];

    if (application.is_read === false) {
      await Sacco.applicationRead(saccoId);
    }

    application.dateOne = dateOne(application.sacco_date);

    res.render("single-sacco-membership-application", {
      message: "",
      saccoApplication: application,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error)
      return catchError(req, res, "single-sacco-membership-application");
  }
};

const approveSacco = async (req, res) => {
  try {
    const saccoId = req.query.saccoId;

    if (!saccoId) return noSaccoIdMessage(req, res);
    const sacco = await Sacco.getSaccoApplicationBySaccoId(saccoId);

    let application = sacco.rows[0];

    if (!application) {
      return invalidSaccoIdMessage(req, res);
    }
    if (application.is_approved) {
      return saccoAlreadyMessage(req, res);
    }
    await Sacco.approved(saccoId);

    application.dateOne = dateOne(application.sacco_date);

    res.render("approve-sacco", {
      message: "Sacco membership approved successfully",
      isSuccess: true,
      saccoApplication: application,
      signedInUser: signedInUser(req.cookies),
      baseUrl: baseUrl(),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "approve-sacco");
  }
};

module.exports = {
  getSaccoMembershipForm,
  applyForSaccoMembership,
  mySaccoData,
  saccoApplicants,
  singleSaccoApplication,
  approveSacco,
};

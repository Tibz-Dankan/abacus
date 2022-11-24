const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { decodeJwtGetUserId } = require("../utils/decodeJwt");

const baseUrl = (requestRawHeaders) => {
  let originUrlIndex;
  requestRawHeaders.map((rawHeaderElement, index) => {
    if (rawHeaderElement === "Origin") {
      originUrlIndex = index + 1;
    }
  });
  const baseUrl = requestRawHeaders[originUrlIndex];
  return baseUrl;
};

// Referer is the full url path making request to the server E.g http://localhost:8000/register
const refererUrl = (requestRawHeaders) => {
  let refererUrlIndex;
  requestRawHeaders.map((rawHeaderElement, index) => {
    if (rawHeaderElement === "Referer") {
      refererUrlIndex = index + 1;
    }
  });
  const refererUrl = requestRawHeaders[refererUrlIndex];
  return refererUrl;
};

const assignUserRole = (baseUrl, refererUrl) => {
  if (`${baseUrl}/signup` === refererUrl) return "client";
  if (`${baseUrl}/register` === refererUrl) return "client";
  if (`${baseUrl}/signup-admin` === refererUrl) return "admin";
};

const assignToken = (userId, userName) => {
  return jwt.sign({ userId, userName }, process.env.JWT_SECRETE_TOKEN, {
    expiresIn: "15m",
  });
};

const assignCookieRedirectUser = (res, userObj) => {
  const token = assignToken(userObj.userId, userObj.userName);
  res.cookie("token", token, {
    httpOnly: true,
    // signed: true,
  });
  if (userObj.userRole === "client") return res.redirect("/get-started");
  if (userObj.userRole === "admin") return res.redirect("/who-applied");
};

const noEmptyFieldMessage = (res, userObject) => {
  return res.render("signup", {
    message: "Please fill out all fields",
    user: userObject,
  });
};

const noAdminCodeMessage = (res, userObject) => {
  return res.render("signup", {
    message: "No admin signup code provided",
    user: userObject,
  });
};

const validCodeMessage = (res, userObject) => {
  return res.render("signup", {
    message: "Admin code provided is invalid",
    user: userObject,
  });
};

const validEmailMessage = (res, userObject) => {
  return res.render("signup", {
    message: "Invalid email",
    user: userObject,
  });
};

const validUserNameMessage = (res, userObject) => {
  return res.render("signup", {
    message:
      "Username must not contain any space and have must a dash e.g 'firstname-lastname'",
    user: userObject,
  });
};

const passwordMatchMessage = (res, userObject) => {
  return res.render("signup", {
    message: "Passwords don't match",
    user: userObject,
  });
};

const passwordLengthMessage = (res, userObject) => {
  return res.render("signup", {
    message: "password must have at least 6 characters",
    user: userObject,
  });
};

const registeredEmailMessage = (res, userObject) => {
  return res.render("signup", {
    message: "Email already registered",
    user: userObject,
  });
};

const noEmailMessage = (res, userObject) => {
  return res.render("signin", {
    message: "Email does not exist",
    user: userObject,
  });
};

const inCorrectPasswordMessage = (res, userObject) => {
  return res.render("signin", {
    message: "Incorrect password",
    user: userObject,
  });
};

const saveDotEnvAdminCode = async (dotEnvCode) => {
  const associatedEmail = "developer@email.com";
  const used = "YES";
  const codeStatus = "Invalid";
  const generatedAt = '{"date":" 2022-11-24T20:46:08.250Z"}';
  const createdByUserId = 0;

  await User.saveAdminCode(
    dotEnvCode,
    associatedEmail,
    used,
    codeStatus,
    generatedAt,
    createdByUserId
  );
};

const saveAdminCode = async (request) => {
  const associatedEmail = request.body.associatedEmail;
  const createdByUserId = decodeJwtGetUserId(request.cookies);
  const adminCode = request.body.adminSignUpCode;
  const used = "YES";
  const codeStatus = "Invalid";
  const generatedAt = request.body.generatedAt;

  await User.saveAdminCode(
    adminCode,
    associatedEmail,
    used,
    codeStatus,
    generatedAt,
    createdByUserId
  );
};

const signUp = async (req, res) => {
  try {
    const userName = req.body.username;
    const email = req.body.email;
    const userRole = assignUserRole(
      baseUrl(req.rawHeaders),
      refererUrl(req.rawHeaders)
    );
    const password = req.body.password;
    const confirmPassword = req.body.confirmpassword;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.getUserByEmail(email);
    const userObject = {};

    userObject.username = userName;
    userObject.email = email;
    userObject.password = password;
    userObject.confirmpassword = confirmPassword;

    if (!userName || !email || !password || !confirmPassword) {
      return noEmptyFieldMessage(res, userObject);
    }
    if (userName.includes(" ") || !userName.includes("-")) {
      return validUserNameMessage(res, userObject);
    }
    if (user.rows[0]) return registeredEmailMessage(res, userObject);
    if (!email.includes("@")) return validEmailMessage(res, userObject);
    if (password.length <= 5) return passwordLengthMessage(res, userObject);
    if (password !== confirmPassword) {
      return passwordMatchMessage(res, userObject);
    }

    if (userRole === "admin") {
      const adminCode = req.body.associatedEmail;
      if (!adminCode) return noAdminCodeMessage(req, userObject);
      if (parseInt(adminCode) === process.env.ADMIN_SIGNUP_CODE) {
        const code = await User.getAdminCode(adminCode);
        if (code.rows[0]) return validCodeMessage(res, userObject);
        saveDotEnvAdminCode(adminCode);
      } else {
        saveAdminCode(req);
      }
    }

    const newUser = await User.createUser(
      userName,
      email,
      userRole,
      hashedPassword
    );

    userObject.userId = newUser.rows[0].user_id;
    userObject.userName = newUser.rows[0].user_name;
    userObject.userRole = newUser.rows[0].user_role;
    assignCookieRedirectUser(res, userObject);
  } catch (error) {
    console.log("error ", error.message);
  }
};

const signIn = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.getUserByEmail(email);

    const userObject = {};

    userObject.email = email;
    userObject.password = password;

    if (!user.rows[0]) return noEmailMessage(res, userObject);

    if (!(await bcrypt.compare(password, user.rows[0].password))) {
      return inCorrectPasswordMessage(res, userObject);
    }

    userObject.userId = user.rows[0].user_id;
    userObject.userName = user.rows[0].user_name;
    userObject.userRole = user.rows[0].user_role;

    assignCookieRedirectUser(res, userObject);
  } catch (error) {
    console.log("error", error.message);
  }
};

const signOut = (req, res) => {
  try {
    res.clearCookie("token");
    return res.redirect("signin");
  } catch (error) {
    console.log("error", error.message);
  }
};

const notAdminMessage = (res) => {
  return res.render("admin-signup-codes", {
    message: "You are not allowed to generate codes since you are not an Admin",
    user: userObject,
  });
};

const noAssociatedEmailMessage = (res) => {
  return res.render("admin-signup-codes", {
    message: "Please provide email to associated with code being generated",
    user: userObject,
  });
};

const generateCode = () => {
  let randomCode;
  randomCode = Math.floor(Math.random() * 1000000);

  if (!(randomCode.toString().length === 6)) {
    randomCode = Math.floor(Math.random() * 1000000);
  }
  if (!(randomCode.toString().length === 6)) {
    randomCode = Math.floor(Math.random() * 1000000);
  }
  if (!(randomCode.toString().length === 6)) {
    randomCode = Math.floor(Math.random() * 1000000);
  }
  return randomCode;
};

const generateAdminCode = async (req, res) => {
  const userId = decodeJwtGetUserId(req.cookies);
  const associatedEmail = req.body.associatedEmail;
  const user = await User.getUserById(userId);
  const used = "NO";
  let generatedAt; // to derived from the frontend

  if (!(user.rows[0].user_role === "admin")) return notAdminMessage(res);
  if (!associatedEmail) return noAssociatedEmailMessage(res);

  const code = generateCode();

  await User.saveAdminCode(
    code,
    associatedEmail,
    used,
    codeStatus,
    generatedAt,
    createdByUserId
  );
  // render page with all generated codes
};

module.exports = { signUp, signIn, signOut, generateAdminCode };

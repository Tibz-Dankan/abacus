const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const assignToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRETE_TOKEN, {
    expiresIn: "15m",
  });
};

const assignCookieRedirectUser = (res, userObj) => {
  const token = assignToken(userObj.userId);
  res.cookie("token", token, {
    httpOnly: true,
    // signed: true,
  });
  return res.redirect("/apply");
};

const noEmptyFieldMessage = (res, userObject) => {
  return res.render("signup", {
    message: "Please fill out all fields",
    user: userObject,
  });
};

const validEmailMessage = (res, userObject) => {
  return res.render("signup", {
    message: "Invalid email",
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

const signup = async (req, res) => {
  try {
    const userName = req.body.username;
    const email = req.body.email;
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
    if (user.rows[0]) return registeredEmailMessage(res, userObject);
    if (!email.includes("@")) return validEmailMessage(res, userObject);
    if (password.length <= 5) return passwordLengthMessage(res, userObject);
    if (password !== confirmPassword) {
      return passwordMatchMessage(res, userObject);
    }

    const newUser = await User.createUser(userName, email, hashedPassword);

    userObject.userId = newUser.rows[0].user_id;
    assignCookieRedirectUser(res, userObject);
  } catch (error) {
    console.log("error ", error.message);
  }
};

const signin = async (req, res) => {
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

    assignCookieRedirectUser(res, userObject);
  } catch (error) {
    console.log("error", error.message);
  }
};

const signout = (req, res) => {
  // TODO: signout user here
};

module.exports = { signup, signin };

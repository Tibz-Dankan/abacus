const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const assignToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRETE_TOKEN);
};

const createSendToken = (user, statusCode, res) => {
  const token = assignToken(user.userId);

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

const createUserSendResponse = async (res, name, email, password) => {
  const user = await User.getUserByEmail(email);
  if (user.rows[0]) return res.json({ errorMessage: "Email already exists" });
  await User.createUser(name, email, password);
  res.status(201).json({ status: "success" });
};

const signup = async (req, res) => {
  try {
    console.log("REQUEST BODY RESPONSE");
    console.log(req.body);
    // Response message to be embedded in the html tags with help of ejs
    return res.json({ status: "signup successful" });
  } catch (error) {
    console.log("error ", error.message);
  }
};

const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.getUserByEmail(email);
    if (!user.rows[0])
      return res.json({ errorMessage: "Email does not exist" });

    if (!(await bcrypt.compare(password, user.rows[0].password))) {
      return res.json({ errorMessage: "Incorrect password" });
    }
    const userObject = {
      userId: user.rows[0].user_id,
      userName: user.rows[0].user_name,
      email: user.rows[0].email,
    };
    createSendToken(userObject, 200, res);
  } catch (error) {
    console.log("error", error.message);
  }
};

const sendSignUpPage = async (req, res) => {
  //   res.sendFile(__dirname + "/views/signup.html");
  res.render("/views/signup");
};

module.exports = { signup, login, sendSignUpPage };

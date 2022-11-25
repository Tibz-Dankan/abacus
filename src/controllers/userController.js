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

const signUpPage = (baseUrl, refererUrl) => {
  if (`${baseUrl}/signup` === refererUrl) return "signup";
  if (`${baseUrl}/register` === refererUrl) return "signup";
  if (`${baseUrl}/signup-admin` === refererUrl) return "signup-admin";
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

const noEmptyFieldMessage = (req, res, userObject) => {
  const signupPage = signUpPage(
    baseUrl(req.rawHeaders),
    refererUrl(req.rawHeaders)
  );
  return res.render(signupPage, {
    message: "Please fill out all fields",
    user: userObject,
  });
};

const noAdminCodeMessage = (req, res, userObject) => {
  const signupPage = signUpPage(
    baseUrl(req.rawHeaders),
    refererUrl(req.rawHeaders)
  );
  return res.render(signupPage, {
    message: "No admin signup code provided",
    user: userObject,
  });
};

const validCodeMessage = (req, res, userObject) => {
  const signupPage = signUpPage(
    baseUrl(req.rawHeaders),
    refererUrl(req.rawHeaders)
  );
  return res.render(signupPage, {
    message: "Admin code provided is invalid",
    user: userObject,
  });
};
const invalidAssociatedEmailMessage = (req, res, userObject) => {
  const signupPage = signUpPage(
    baseUrl(req.rawHeaders),
    refererUrl(req.rawHeaders)
  );
  return res.render(signupPage, {
    message: "Email associated with admin code is invalid",
    user: userObject,
  });
};

const validEmailMessage = (req, res, userObject) => {
  const signupPage = signUpPage(
    baseUrl(req.rawHeaders),
    refererUrl(req.rawHeaders)
  );
  return res.render(signupPage, {
    message: "Invalid email",
    user: userObject,
  });
};

const validUserNameMessage = (req, res, userObject) => {
  const signupPage = signUpPage(
    baseUrl(req.rawHeaders),
    refererUrl(req.rawHeaders)
  );
  return res.render(signupPage, {
    message:
      "Username must not contain any space and have must a dash e.g 'firstname-lastname'",
    user: userObject,
  });
};

const passwordMatchMessage = (req, res, userObject) => {
  const signupPage = signUpPage(
    baseUrl(req.rawHeaders),
    refererUrl(req.rawHeaders)
  );
  return res.render(signupPage, {
    message: "Passwords don't match",
    user: userObject,
  });
};

const passwordLengthMessage = (req, res, userObject) => {
  const signupPage = signUpPage(
    baseUrl(req.rawHeaders),
    refererUrl(req.rawHeaders)
  );
  return res.render(signupPage, {
    message: "password must have at least 6 characters",
    user: userObject,
  });
};

const registeredEmailMessage = (req, res, userObject) => {
  const signupPage = signUpPage(
    baseUrl(req.rawHeaders),
    refererUrl(req.rawHeaders)
  );
  return res.render(signupPage, {
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
  const used = "yes";
  const codeStatus = "invalid";
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

const signUpClient = async (req, res) => {
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
      return noEmptyFieldMessage(req, res, userObject);
    }
    if (userName.includes(" ") || !userName.includes("-")) {
      return validUserNameMessage(req, res, userObject);
    }
    if (user.rows[0]) return registeredEmailMessage(req, res, userObject);
    if (!email.includes("@")) return validEmailMessage(req, res, userObject);
    if (password.length <= 5)
      return passwordLengthMessage(req, res, userObject);
    if (password !== confirmPassword) {
      return passwordMatchMessage(req, res, userObject);
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

const signUpAdmin = async (req, res) => {
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
      return noEmptyFieldMessage(req, res, userObject);
    }
    if (userName.includes(" ") || !userName.includes("-")) {
      return validUserNameMessage(req, res, userObject);
    }
    if (user.rows[0]) return registeredEmailMessage(req, res, userObject);
    if (!email.includes("@")) return validEmailMessage(req, res, userObject);
    if (password.length <= 5)
      return passwordLengthMessage(req, res, userObject);
    if (password !== confirmPassword) {
      return passwordMatchMessage(req, res, userObject);
    }

    if (userRole === "admin") {
      const adminCode = req.body.adminSignUpCode;
      if (!adminCode) return noAdminCodeMessage(req, res, userObject);
      if (adminCode === process.env.ADMIN_SIGNUP_CODE) {
        const code = await User.getAdminCode(adminCode);

        console.log("Admin code from the database");
        console.log(code.rows);
        if (code.rows[0]) return validCodeMessage(req, res, userObject);
        saveDotEnvAdminCode(adminCode);
      } else {
        const code = await User.getAdminCode(adminCode);
        if (!code.rows[0] || code.rows[0].code_status === "invalid") {
          return validCodeMessage(req, res, userObject);
        }
        if (!(email === code.rows[0].associated_email)) {
          return invalidAssociatedEmailMessage(req, res, userObject);
        }
        // TODO: check for code expiration
        await User.InvalidateAdminCodes(adminCode);
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
  const createdByUserId = decodeJwtGetUserId(req.cookies);
  const associatedEmail = req.body.associatedEmail;
  const used = "no";
  const codeStatus = "valid";
  let generatedAt = JSON.stringify({ date: new Date(Date.now()) });

  const user = await User.getUserById(createdByUserId);

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

module.exports = {
  signUpClient,
  signUpAdmin,
  signIn,
  signOut,
  generateAdminCode,
};

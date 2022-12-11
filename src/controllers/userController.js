const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { randomBytes, createHash } = require("crypto");
// const Email = require("../utils/email");

require("dotenv").config();
const { decodeJwtGetUserId } = require("../utils/decodeJwt");
const { catchError } = require("../utils/catchError");
const { signedInUser } = require("../utils/signedInUser");

// const baseUrl = (requestRawHeaders) => {
//   let originUrlIndex;
//   requestRawHeaders.map((rawHeaderElement, index) => {
//     if (rawHeaderElement === "Origin") {
//       originUrlIndex = index + 1;
//     }
//   });
//   const baseUrl = requestRawHeaders[originUrlIndex];
//   return baseUrl;
// };

// Referer is the full url path making request to the server E.g http://localhost:8000/register
// const refererUrl = (requestRawHeaders) => {
//   let refererUrlIndex;
//   requestRawHeaders.map((rawHeaderElement, index) => {
//     if (rawHeaderElement === "Referer") {
//       refererUrlIndex = index + 1;
//     }
//   });
//   const refererUrl = requestRawHeaders[refererUrlIndex];
//   return refererUrl;
// };

// const assignUserRole = (baseUrl, refererUrl) => {
const assignUserRole = (req) => {
  // if (`${baseUrl}/signup` === refererUrl) return "client";
  // if (`${baseUrl}/register` === refererUrl) return "client";
  // if (`${baseUrl}/signup-admin` === refererUrl) return "admin";
  if (req.url === "/signup") return "client";
  if (req.url === "/register") return "client";
  if (req.url === "/signup-admin") return "admin";
};

const signUpPage = (req) => {
  // if (`${baseUrl}/signup` === refererUrl) return "signup";
  // if (`${baseUrl}/register` === refererUrl) return "signup";
  // if (`${baseUrl}/signup-admin` === refererUrl) return "signup-admin";
  if (req.url === "/signup") return "signup";
  if (req.url === "/register") return "signup";
  if (req.url === "/signup-admin") return "signup-admin";
};

const assignToken = (userId, userName, userRole) => {
  return jwt.sign(
    { userId, userName, userRole },
    process.env.JWT_SECRETE_TOKEN,
    {
      expiresIn: "15m",
    }
  );
};

const assignCookieRedirectUser = (res, userObj) => {
  const token = assignToken(userObj.userId, userObj.userName, userObj.userRole);
  res.cookie("token", token, {
    httpOnly: true,
    // signed: true,
  });
  if (userObj.userRole === "client") return res.redirect("/start-applying");
  if (userObj.userRole === "admin") return res.redirect("/applications");
};

const noEmptyFieldMessage = (req, res, userObject) => {
  // const signupPage = signUpPage(
  //   baseUrl(req.rawHeaders),
  //   refererUrl(req.rawHeaders)
  // );
  const signupPage = signUpPage(req);
  return res.render(signupPage, {
    message: "Please fill out all fields",
    user: userObject,
  });
};

const noAdminCodeMessage = (req, res, userObject) => {
  // const signupPage = signUpPage(
  //   baseUrl(req.rawHeaders),
  //   refererUrl(req.rawHeaders)
  // );
  const signupPage = signUpPage(req);
  return res.render(signupPage, {
    message: "No admin signup code provided",
    user: userObject,
  });
};

const validCodeMessage = (req, res, userObject) => {
  // const signupPage = signUpPage(
  //   baseUrl(req.rawHeaders),
  //   refererUrl(req.rawHeaders)
  // );
  const signupPage = signUpPage(req);
  return res.render(signupPage, {
    message: "Admin code provided is invalid",
    user: userObject,
  });
};
const invalidAssociatedEmailMessage = (req, res, userObject) => {
  // const signupPage = signUpPage(
  //   baseUrl(req.rawHeaders),
  //   refererUrl(req.rawHeaders)
  // );
  const signupPage = signUpPage(req);

  return res.render(signupPage, {
    message: "Email associated with admin code is invalid",
    user: userObject,
  });
};

const expiredAdminCodeMessage = (req, res, userObject) => {
  // const signupPage = signUpPage(
  //   baseUrl(req.rawHeaders),
  //   refererUrl(req.rawHeaders)
  // );
  const signupPage = signUpPage(req);
  return res.render(signupPage, {
    message: "Admin code is expired",
    user: userObject,
  });
};

const validEmailMessage = (req, res, userObject) => {
  // const signupPage = signUpPage(
  //   baseUrl(req.rawHeaders),
  //   refererUrl(req.rawHeaders)
  // );
  const signupPage = signUpPage(req);
  return res.render(signupPage, {
    message: "Invalid email",
    user: userObject,
  });
};

const validUserNameMessage = (req, res, userObject) => {
  // const signupPage = signUpPage(
  //   baseUrl(req.rawHeaders),
  //   refererUrl(req.rawHeaders)
  // );
  const signupPage = signUpPage(req);
  return res.render(signupPage, {
    message:
      "Username must not contain any space and have must a dash e.g 'firstname-lastname'",
    user: userObject,
  });
};

const passwordMatchMessage = (req, res, userObject) => {
  // const signupPage = signUpPage(
  //   baseUrl(req.rawHeaders),
  //   refererUrl(req.rawHeaders)
  // );
  const signupPage = signUpPage(req);
  return res.render(signupPage, {
    message: "Passwords don't match",
    user: userObject,
  });
};

const passwordLengthMessage = (req, res, userObject) => {
  // const signupPage = signUpPage(
  //   baseUrl(req.rawHeaders),
  //   refererUrl(req.rawHeaders)
  // );
  const signupPage = signUpPage(req);
  return res.render(signupPage, {
    message: "password must have at least 6 characters",
    user: userObject,
  });
};

const registeredEmailMessage = (req, res, userObject) => {
  // const signupPage = signUpPage(
  //   baseUrl(req.rawHeaders),
  //   refererUrl(req.rawHeaders)
  // );
  const signupPage = signUpPage(req);

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
    // const userRole = assignUserRole(
    //   baseUrl(req.rawHeaders),
    //   refererUrl(req.rawHeaders)
    // );
    const userRole = assignUserRole(req);
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
    console.log(error);
    catchError(req, res, "signup");
  }
};

const convertToDate = (stringifiedDate) => {
  const date = JSON.parse(stringifiedDate).date;
  return new Date(date);
};

const signUpAdmin = async (req, res) => {
  try {
    const userName = req.body.username;
    const email = req.body.email;
    // const userRole = assignUserRole(
    //   baseUrl(req.rawHeaders),
    //   refererUrl(req.rawHeaders)
    // );
    const userRole = assignUserRole(req);
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
    if (password.length <= 5) {
      return passwordLengthMessage(req, res, userObject);
    }
    if (password !== confirmPassword) {
      return passwordMatchMessage(req, res, userObject);
    }

    if (userRole === "admin") {
      const adminCode = req.body.adminSignUpCode;
      if (!adminCode) return noAdminCodeMessage(req, res, userObject);

      if (adminCode === process.env.ADMIN_SIGNUP_CODE) {
        const code = await User.getAdminCode(adminCode);
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
        if (
          new Date(Date.now()) - convertToDate(code.rows[0].generated_at) >
          new Date(1000 * 60 * 60 * 24)
        ) {
          return expiredAdminCodeMessage(req, res, userObject);
        }
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
    console.log(error);
    if (error) return catchError(req, res, "signup-admin");
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
    console.log(error);
    if (error) return catchError(req, res, "signin");
  }
};

const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.redirect("signin");
  } catch (error) {
    console.log(error);
  }
};

const noResetEmailMessage = (res) => {
  return res.render("forgot-password", {
    message: "Please provide a valid email",
  });
};

const noUserWithProvidedEmail = (res) => {
  return res.render("forgot-password", {
    message: "No user with provided email  address",
  });
};
const noResetToken = (res) => {
  return res.render("reset-password", {
    message: "No token is provided",
  });
};

const invalidResetToken = (res) => {
  return res.render("reset-password", {
    message: "please provide a valid token",
  });
};

const expiredResetToken = (res) => {
  return res.render("reset-password", {
    message: "Token is expired",
  });
};

// const updateResetPasswordPages = (baseUrl, refererUrl) => {
const updateResetPasswordPages = (req) => {
  // if (`${baseUrl}/update-password` === refererUrl) return "update-password";
  // if (`${baseUrl}/reset-password` === refererUrl) return "reset-password";
  if (req.url === "/update-password") return "update-password";
  if (req.url === "/reset-password") return "reset-password";
};

const noPassword = (req, res) => {
  // const page = updateResetPasswordPages(
  //   baseUrl(req.rawHeaders),
  //   refererUrl(req.rawHeaders)
  // );
  const page = updateResetPasswordPages(req);
  return res.render(page, {
    message: "Please fill out password field",
    signedInUser: signedInUser(req.cookies),
  });
};

const incorrectCurrentPassword = (req, res) => {
  return res.render("update-password", {
    message: "Incorrect current password",
    signedInUser: signedInUser(req.cookies),
  });
};

const passwordsDontMatch = (req, res, pageName) => {
  res.render(pageName, {
    message: "passwords don't match",
    signedInUser: signedInUser(req.cookies),
  });
};

const shortPassword = (req, res) => {
  res.render("update-password", {
    message: "password must have at least 6 characters",
    signedInUser: signedInUser(req.cookies),
  });
};

const getUpdatePassword = async (req, res) => {
  try {
    res.render("update-password", {
      message: "",
      signedInUser: signedInUser(req.cookies),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "update-password");
  }
};

const updatePassword = async (req, res) => {
  try {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confirmNewPassword = req.body.confirmNewPassword;

    if (!currentPassword || !newPassword) return noPassword(req, res);
    const userId = decodeJwtGetUserId(req.cookies);
    const user = await User.getUserById(userId);

    if (!(await bcrypt.compare(currentPassword, user.rows[0].password))) {
      return incorrectCurrentPassword(req, res);
    }
    if (newPassword.length <= 5) return shortPassword(req, res);

    if (newPassword != confirmNewPassword) {
      return passwordsDontMatch(req, res, "update-password");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(userId, hashedPassword);

    res.clearCookie("token");
    res.redirect("signin");
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "update-password");
  }
};

const getForgotPassword = async (req, res) => {
  try {
    res.render("forgot-password", { message: "" });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "forgot-password");
  }
};

const expireExistingResetTokens = (tokenArray) => {
  tokenArray.map(async (tokenObj) => {
    if (convertToDate(tokenObj.token_expires) > new Date(Date.now())) {
      await User.updateResetTokenExpires(tokenObj.token);
    }
  });
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) return noResetEmailMessage(res);
    const user = await User.getUserByEmail(email);

    if (!user.rows[0]) return noUserWithProvidedEmail(res);

    const userResetTokens = await User.getPasswordResetTokenByUserId(
      user.rows[0].user_id
    );
    if (userResetTokens.rows[0]) {
      expireExistingResetTokens(userResetTokens.rows);
    }
    const resetToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(resetToken).digest("hex");
    const userId = user.rows[0].user_id;
    const tokenExpires = JSON.stringify({
      date: new Date(Date.now() + 1000 * 60 * 20),
    });

    await User.savePasswordResetToken(userId, hashedToken, tokenExpires);

    // const resetURL = `${req.protocol}://abacusuganda.com/reset-password/${resetToken}`;
    const resetURL = `${req.protocol}://localhost:8000/reset-password?token=${resetToken}`;
    // const resetURL = `${req.protocol}://localhost:8000/reset-password/:${resetToken}`;
    console.log("Reset url :", resetURL);
    const subject = "Reset Password";

    // await new Email(email, subject).sendPasswordReset(
    //   resetURL,
    //   user.rows[0].user_name
    // );

    res.render("forgot-password", { message: "Reset Token sent to email" });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "forgot-password");
  }
};

const getResetPassword = async (req, res) => {
  try {
    res.render("reset-password", { message: "" });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "reset-password");
  }
};

const resetPassword = async (req, res) => {
  try {
    console.log("REQUEST");
    console.log(req);

    // const token = req.params.token;

    const token = req.query.token;
    console.log("Token: ", token);
    if (!token) return noResetToken(res);
    const hashedToken = createHash("sha256").update(token).digest("hex");

    const dbHashedToken = await User.getPasswordResetToken(token);
    if (!dbHashedToken.rows[0]) return invalidResetToken(res);

    if (
      new Date(Date.now()) > convertToDate(dbHashedToken.rows[0].token_expires)
    ) {
      return expiredResetToken(res);
    }

    if (dbHashedToken.rows[0].token != hashedToken) {
      return invalidResetToken(res);
    }

    if (!req.body.password || !req.body.confirmPassword) {
      return noPassword(req, res);
    }

    if (req.body.password != req.body.confirmPassword) {
      return passwordsDontMatch(req, res, "reset-password");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userId = dbHashedToken.rows[0].user_id;
    await User.updatePassword(userId, hashedPassword);
    await User.updateResetTokenExpires(token);

    res.redirect("signin");
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "reset-password");
  }
};

const noUserData = async (req, res) => {
  const userId = decodeJwtGetUserId(req.cookies);
  const user = await User.getUserById(userId);

  res.render("user-profile", {
    user: user.rows[0],
    message: "Please fill out all fields",
    signedInUser: signedInUser(req.cookies),
  });
};

const getUserProfile = async (req, res) => {
  try {
    const userId = decodeJwtGetUserId(req.cookies);
    const user = await User.getUserById(userId);

    res.render("user-profile", {
      user: user.rows[0],
      message: "",
      signedInUser: signedInUser(req.cookies),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "user-profile");
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userName = req.body.userName;
    const email = req.body.email;
    if (!userName || !email) return noUserData(req, res);

    // TODO: ensure email is not yet registered
    // TODO: ensure user name contains no space and has a dash e.g firstname-lastname

    const userId = decodeJwtGetUserId(req.cookies);
    const user = await User.updateUserData(userId, userName, email);

    res.render("user-profile", {
      user: user.rows[0],
      message: "",
      signedInUser: signedInUser(req.cookies),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "user-profile");
  }
};

const notAdminMessage = (req, res) => {
  return res.render("admin-codes", {
    message: "You are not allowed to generate codes since you are not an Admin",
    adminCodes: [],
    signedInUser: signedInUser(req.cookies),
  });
};

const noAssociatedEmailMessage = (req, res) => {
  return res.render("admin-codes", {
    message: "Please provide email to associated with code being generated",
    adminCodes: [],
    signedInUser: signedInUser(req.cookies),
  });
};
const validAssociatedEmailMessage = (req, res) => {
  return res.render("admin-codes", {
    message: "Please provide a valid email address",
    adminCodes: [],
    signedInUser: signedInUser(req.cookies),
  });
};
const registeredAssociatedEmailMessage = (req, res) => {
  return res.render("admin-codes", {
    message: "Email address is already registered",
    adminCodes: [],
    signedInUser: signedInUser(req.cookies),
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
  return randomCode;
};

const generateAdminCode = async (req, res) => {
  try {
    const createdByUserId = decodeJwtGetUserId(req.cookies);
    const associatedEmail = req.body.associatedEmail;
    const used = "no";
    const codeStatus = "valid";
    let generatedAt = JSON.stringify({ date: new Date(Date.now()) });

    const user = await User.getUserById(createdByUserId);

    if (!(user.rows[0].user_role === "admin")) return notAdminMessage(req, res);
    if (!associatedEmail) return noAssociatedEmailMessage(req, res);
    if (!associatedEmail.includes("@")) {
      return validAssociatedEmailMessage(req, res);
    }

    const userByEmail = await User.getUserByEmail(associatedEmail);
    if (userByEmail.rows[0]) return registeredAssociatedEmailMessage(req, res);

    const code = generateCode();

    await User.saveAdminCode(
      code,
      associatedEmail,
      used,
      codeStatus,
      generatedAt,
      createdByUserId
    );
    const AdminCodes = await User.getAdminCodesById(createdByUserId);
    res.render("admin-codes", {
      message: "",
      adminCodes: AdminCodes.rows,
      signedInUser: signedInUser(req.cookies),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(res, "admin-codes");
  }
};

const getAdminCodes = async (req, res) => {
  try {
    const createdByUserId = decodeJwtGetUserId(req.cookies);

    const user = await User.getUserById(createdByUserId);
    if (!(user.rows[0].user_role === "admin")) return notAdminMessage(req, res);

    const AdminCodes = await User.getAdminCodesById(createdByUserId);
    res.render("admin-codes", {
      message: "",
      adminCodes: AdminCodes.rows,
      signedInUser: signedInUser(req.cookies),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "admin-codes");
  }
};

module.exports = {
  signUpClient,
  signUpAdmin,
  signIn,
  signOut,
  getUpdatePassword,
  updatePassword,
  getForgotPassword,
  forgotPassword,
  getResetPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  generateAdminCode,
  getAdminCodes,
};

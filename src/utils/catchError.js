const { signedInUser } = require("./signedInUser");
const { baseUrl } = require("./constants");
// const Email = require("./email");

const catchError = async (req, res, pageName) => {
  // const devEmailOne = process.env.DEV_EMAIL_ONE;
  // const devNameOne = process.env.DEV_NAME_ONE;
  // const devEmailTwo = process.env.DEV_EMAIL_TWO;
  // const devNameTwo = process.env.DEV_NAME_TWO;

  // const subject = "A bug in production";

  // await new Email(devEmailOne, subject).sendDevsBug(error, devNameOne);

  let signInUser;
  if (req.cookies.token) {
    signInUser = signedInUser(req.cookies);
  }
  return res.render(pageName, {
    urls: {},
    uploads: [],
    message: "Sorry something went wrong, try again",
    // user: userObject,
    isSuccess: false,
    signedInUser: signInUser,
    baseUrl: baseUrl(),
  });
};

module.exports = { catchError };

const { signedInUser } = require("../utils/signedInUser");
const { catchError } = require("../utils/catchError");

const home = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const signup = async (req, res) => {
  try {
    const userObject = {
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
    };

    res.render("signup", {
      message: "",
      user: userObject,
    });
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const signUpAdmin = (req, res) => {
  try {
    const userObject = {
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
    };
    res.render("signup-admin", {
      message: "",
      user: userObject,
    });
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const signin = async (req, res) => {
  try {
    const userObject = {
      email: "",
      password: "",
    };

    res.render("signin", {
      message: "",
      user: userObject,
    });
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const about = async (req, res) => {
  try {
    res.render("about");
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const blog = async (req, res) => {
  try {
    res.render("blog");
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const blogDetails = async (req, res) => {
  try {
    res.render("blog_details");
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const contact = async (req, res) => {
  try {
    res.render("contact");
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const elements = async (req, res) => {
  try {
    res.render("elements");
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const services = async (req, res) => {
  try {
    res.render("services");
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const notFound = async (req, res) => {
  try {
    res.render("not-found");
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const applications = (req, res) => {
  try {
    res.render("applications", {
      message: "",
      signedInUser: signedInUser(req.cookies),
    });
  } catch (error) {
    console.log(error);
    if (error) return catchError(req, res, "applications");
  }
};

module.exports = {
  home,
  signup,
  signUpAdmin,
  signin,
  about,
  blog,
  blogDetails,
  contact,
  elements,
  services,
  notFound,
  applications,
};

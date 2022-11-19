const home = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log("error: " + error.message);
  }
};
const signup = async (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.log("error: " + error.message);
  }
};

const signin = async (req, res) => {
  try {
    res.render("signin");
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

const apply = async (req, res) => {
  try {
    res.render("apply");
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

module.exports = {
  home,
  signup,
  signin,
  apply,
  about,
  blog,
  blogDetails,
  contact,
  elements,
  services,
  notFound,
};

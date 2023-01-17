const express = require("express");
// const { verifyToken } = require("../utils/verifyToken");
const { verifyAdminToken } = require("../utils/verifyAdminToken");

const {
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
  applyRedirect,
  homeRedirect,
} = require("../controllers/generalRouteController");

const router = express.Router();

router.get("/", home);
router.get("/home", home);
router.get("/signup", signup);
router.get("/register", signup);
router.get("/signup-admin", signUpAdmin);
router.get("/signin", signin);
router.get("/login", signin);
router.get("/about", about);
router.get("/blog", blog);
router.get("/blog_details", blogDetails);
router.get("/contact", contact);
router.get("/elements", elements);
router.get("/services", services);
router.get("/apply", applyRedirect);
router.get("/applications", verifyAdminToken, applications);
// router.get("*", notFound);
router.get("*", homeRedirect);

module.exports = router;

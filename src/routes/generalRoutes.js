const express = require("express");
const { verifyToken } = require("../utils/verifyToken");

const {
  home,
  signup,
  signin,
  about,
  blog,
  blogDetails,
  contact,
  elements,
  services,
  notFound,
  loginRegister,
} = require("../controllers/generalRouteController");

const router = express.Router();

router.get("/", home);
router.get("/home", home);
router.get("/signup", signup);
router.get("/register", signup);
router.get("/signin", signin);
router.get("/login", signin);
router.get("/about", about);
router.get("/blog", blog);
router.get("/blog_details", blogDetails);
router.get("/contact", contact);
router.get("/elements", elements);
router.get("/services", services);
router.get("/temp", loginRegister); // to be removed
router.get("*", notFound);

module.exports = router;

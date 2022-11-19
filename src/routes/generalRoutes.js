const express = require("express");
const {
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
} = require("../controllers/generalRouteController");

const router = express.Router();

router.get("/", home);
router.get("/home", home);
router.get("/signup", signup);
router.get("/register", signup);
router.get("/signin", signin);
router.get("/login", signin);
router.get("/apply", apply);
router.get("/about", about);
router.get("/blog", blog);
router.get("/blog-details", blogDetails);
router.get("/contact", contact);
router.get("/elements", elements);
router.get("/services", services);
router.get("*", notFound);

module.exports = router;

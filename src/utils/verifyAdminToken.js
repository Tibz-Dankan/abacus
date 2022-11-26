const { decodeJwtGetUserRole } = require("./decodeJwt");
const { verifyJWT } = require("./verifyToken");

const verifyAdminToken = (req, res, next) => {
  try {
    // TODO: implement signed cookie
    //console.log(req.signedCookies);
    //const token = req.signedCookies["token"];

    if (!req.cookies) return res.redirect("signin");
    const token = req.cookies.token;
    if (!token) return res.redirect("signin");

    const userRole = decodeJwtGetUserRole(req.cookies);
    if (userRole !== "Admin") {
      return res.render("not-admin", {
        message: "You can't access this page since you are not an admin",
      });
    }

    verifyJWT(token, req, res, next);
  } catch (error) {
    console.log("Jwt catch error: " + error.message);
    console.log(error);
  }
};

module.exports = { verifyAdminToken };

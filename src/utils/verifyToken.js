const jwt = require("jsonwebtoken");

const verifyJWT = (token, req, res, next) => {
  jwt.verify(token, process.env.JWT_SECRETE_TOKEN, (error, userId) => {
    if (error) {
      res.clearCookie("token");
      return res.redirect("signin");
    }
    req.id = userId;
    next();
  });
};

const verifyToken = (req, res, next) => {
  try {
    // TODO: implement signed cookie
    //console.log(req.signedCookies);
    //const token = req.signedCookies["token"];

    if (!req.cookies) return res.redirect("signin");
    const token = req.cookies.token;
    if (!token) return res.redirect("signin");

    verifyJWT(token, req, res, next);
  } catch (error) {
    console.log("Jwt catch error: " + error.message);
    console.log(error);
  }
};

module.exports = { verifyToken };

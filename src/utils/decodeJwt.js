const jwt_decode = require("jwt-decode");

const decodeJwtGetUserId = (requestCookie) => {
  const jwtToken = requestCookie.token;
  const decodedToken = jwt_decode(jwtToken);
  console.log("Decoded token");
  console.log(decodedToken);
  const userId = decodedToken.userId;
  console.log("userId", userId);
  return userId;
};

module.exports = { decodeJwtGetUserId };

//Example from npm
// import jwt_decode from "jwt-decode";

// var token = "eyJ0eXAiO.../// jwt token";
// var decoded = jwt_decode(token);

// console.log(decoded);

// /* prints:
//  * { foo: "bar",
//  *   exp: 1393286893,
//  *   iat: 1393268893  }
//  */

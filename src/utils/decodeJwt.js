const jwt_decode = require("jwt-decode");

const decodeJwtGetUserId = (requestCookie) => {
  const jwtToken = requestCookie.token;
  const decodedToken = jwt_decode(jwtToken);
  const userId = decodedToken.userId;
  return userId;
};

const decodeJwtGetUserName = (requestCookie) => {
  const jwtToken = requestCookie.token;
  const decodedToken = jwt_decode(jwtToken);
  const userName = decodedToken.userName;
  return userName;
};

module.exports = { decodeJwtGetUserId, decodeJwtGetUserName };

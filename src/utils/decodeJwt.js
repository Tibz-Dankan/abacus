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

const decodeJwtGetUserRole = (requestCookie) => {
  const jwtToken = requestCookie.token;
  const decodedToken = jwt_decode(jwtToken);
  const userRole = decodedToken.userRole;
  return userRole;
};

module.exports = {
  decodeJwtGetUserId,
  decodeJwtGetUserName,
  decodeJwtGetUserRole,
};

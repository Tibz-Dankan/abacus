const { decodeJwtGetUserName, decodeJwtGetUserRole } = require("./decodeJwt");

const signedInUser = (requestCookie) => {
  const userName = decodeJwtGetUserName(requestCookie);
  const userRole = decodeJwtGetUserRole(requestCookie);
  return {
    name: userName,
    role: userRole,
  };
};

module.exports = { signedInUser };

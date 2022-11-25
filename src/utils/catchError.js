const catchError = (res, pageName) => {
  // FUTURE TODO: when error occurs in production send email to the devs
  return res.render(pageName, {
    message: "Sorry something went wrong, try again",
    user: userObject,
  });
};

module.exports = { catchError };

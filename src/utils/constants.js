require("dotenv").config();

const baseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.PRODUCTION_BASE_URL;
  } else {
    return process.env.LOCAL_BASE_URL;
  }
};

module.exports = { baseUrl };

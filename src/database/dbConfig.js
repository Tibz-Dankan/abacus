require("dotenv").config();
const pg = require("pg");

const db = new pg.Client({
  connectionString: process.env.POSTGRES_URL,
});

db.connect((error) => {
  if (error) {
    console.log("Failed to connect to the database!");
    console.log("error message: " + error.message);
    console.log(error);
  } else {
    console.log("Database successfully connected!");
  }
});

module.exports = db;

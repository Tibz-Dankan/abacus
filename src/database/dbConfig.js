require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

pool.connect((error) => {
  if (error) {
    console.log("Failed to connect to the database!");
    console.log("error message: " + error.message);
    console.log(error);
  } else {
    console.log("Database successfully connected!");
  }
});

const db = pool;
module.exports = db;

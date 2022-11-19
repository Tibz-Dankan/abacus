const db = require("../database/dbConfig");

const User = {};

// create user
User.createUser = (userName, email, hashedPassword) => {
  return db.query(
    "INSERT INTO users(user_name, email, password) VALUES($1,$2,$3)  RETURNING *",
    [userName, email, hashedPassword]
  );
};

// Get user by Id
User.getUserById = (userId) => {
  return db.query("SELECT * FROM users WHERE user_id =$1", [userId]);
};

// Get user by Email
User.getUserByEmail = (email) => {
  return db.query("SELECT * FROM users WHERE email =$1", [email]);
};

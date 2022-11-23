const db = require("../database/dbConfig");

const User = {};

User.createUser = (userName, email, userRole, hashedPassword) => {
  return db.query(
    "INSERT INTO users(user_name, email, user_role, password) VALUES($1,$2,$3,$4)  RETURNING *",
    [userName, email, userRole, hashedPassword]
  );
};

User.getUserById = (userId) => {
  return db.query("SELECT * FROM users WHERE user_id =$1", [userId]);
};

User.getUserByEmail = (email) => {
  return db.query("SELECT * FROM users WHERE email =$1", [email]);
};

module.exports = User;

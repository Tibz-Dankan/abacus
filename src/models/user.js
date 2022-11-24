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

User.saveAdminCode = (
  code,
  associatedEmail,
  used,
  codeStatus,
  generatedAt,
  createdByUserId
) => {
  return db.query(
    "INSERT INTO admin_signup_codes(code, associated_email, used, code_status, generated_at, created_by_user_id) VALUES($1,$2,$3,$4,$5,$6)  RETURNING *",
    [code, associatedEmail, used, codeStatus, generatedAt, createdByUserId]
  );
};

User.getAdminCode = (code) => {
  return db.query("SELECT * FROM admin_signup_codes WHERE code = $1", [code]);
};

User.getAllAdminCodes = () => {
  return db.query("SELECT * FROM admin_signup_codes");
};

module.exports = User;

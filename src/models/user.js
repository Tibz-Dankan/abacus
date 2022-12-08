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

User.updateUserData = (userId, userName, email) => {
  return db.query(
    "UPDATE users SET user_name = $1 and email = $2 WHERE user_id = $3 RETURNING *",
    [userId, userName, email]
  );
};

User.updatePassword = (userId, hashedPassword) => {
  return db.query("UPDATE users SET password = $1 WHERE user_id = $2", [
    hashedPassword,
    userId,
  ]);
};

User.savePasswordResetToken = (userId, token, tokenExpires) => {
  return db.query(
    "INSERT INTO reset_tokens(user_id, token, token_expires) VALUES($1,$2,$3)  RETURNING *",
    [userId, token, tokenExpires]
  );
};

User.getPasswordResetToken = (token) => {
  return db.query("SELECT * FROM reset_tokens WHERE token = $1", [token]);
};

User.getPasswordResetTokenByUserId = (userId) => {
  return db.query("SELECT * FROM reset_tokens WHERE user_id = $1", [userId]);
};

User.updateResetTokenExpires = (token) => {
  const resetTokenExpires = JSON.stringify({ date: new Date(Date.now()) });
  return db.query(
    "UPDATE reset_tokens SET token_expires = $1 WHERE token = $2",
    [resetTokenExpires, token]
  );
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

User.getAdminCodesById = (createdByUserId) => {
  return db.query(
    "SELECT code, associated_email, code_status, generated_at FROM admin_signup_codes WHERE created_by_user_id = $1 ORDER BY code_id DESC",
    [createdByUserId]
  );
};

User.InvalidateAdminCodes = (adminCode) => {
  return db.query(
    "UPDATE admin_signup_codes SET code_status = 'Invalid' WHERE code = $1 ",
    [adminCode]
  );
};

module.exports = User;

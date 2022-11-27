const db = require("../database/dbConfig");

const Sacco = {};

Sacco.saveSaccoMembershipApplication = (
  userId,
  firstName,
  lastName,
  gender,
  job,
  phoneNumber,
  city,
  isAccepted,
  isRead
) => {
  return db.query(
    "INSERT INTO sacco_membership(user_id, first_name, last_name, gender, job, phone_number, city, is_accepted, is_read) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)  RETURNING *",
    [
      userId,
      firstName,
      lastName,
      gender,
      job,
      phoneNumber,
      city,
      isAccepted,
      isRead,
    ]
  );
};

Sacco.getSaccoApplicationByUserId = (userId) => {
  return db.query("SELECT * FROM sacco_membership WHERE user_id = $1", [
    userId,
  ]);
};

Sacco.getSaccoApplicationBySaccoId = (saccoId) => {
  return db.query("SELECT * FROM sacco_membership WHERE sacco_id = $1", [
    saccoId,
  ]);
};

Sacco.getAllSaccoApplications = () => {
  return db.query("SELECT * FROM sacco_membership ORDER BY sacco_id DESC");
};

Sacco.applicationRead = (saccoId) => {
  return db.query(
    "UPDATE sacco_membership SET is_read = true WHERE sacco_id = $1",
    [saccoId]
  );
};

Sacco.applicationAccepted = (saccoId) => {
  return db.query(
    "UPDATE sacco_membership SET is_accepted = true WHERE sacco_id = $1",
    [saccoId]
  );
};

module.exports = Sacco;

const db = require("../database/dbConfig");

const Loan = {};
// TODO: save loan in the database

Loan.saveLoanApplicationData = (
  userId,
  firstName,
  lastName,
  gender,
  phoneNumber,
  city,
  loanAmount,
  loanCategory
) => {
  return db.query(
    "INSERT INTO loan_applications(user_id, first_name, last_name, gender, phone_number, city, loan_mount, loan_category) VALUES($1,$2,$3,$4,$5,$6,$7,&8)  RETURNING *",
    [
      userId,
      firstName,
      lastName,
      gender,
      phoneNumber,
      city,
      loanAmount,
      loanCategory,
    ]
  );
};

// TODO: get a Loan application from  the database
Loan.getLoanApplicationByUserId = (userId) => {
  return db.query("SELECT * FROM loan_applications WHERE user_id = $1", [
    userId,
  ]);
};

// TODO: get all loan application from the database
Loan.getAllLoanApplications = (userId) => {
  return db.query("SELECT * FROM loan_applications ODER BY DESC", [userId]);
};

module.exports = Loan;

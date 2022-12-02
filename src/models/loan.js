const db = require("../database/dbConfig");

const Loan = {};

Loan.saveLoanApplicationData = (
  userId,
  firstName,
  lastName,
  gender,
  job,
  phoneNumber,
  city,
  loanAmount,
  loanCategory,
  isSettled,
  isRead
) => {
  return db.query(
    "INSERT INTO loan_applications(user_id, first_name, last_name, gender, job, phone_number, city, loan_amount, loan_category,is_settled, is_read) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)  RETURNING *",
    [
      userId,
      firstName,
      lastName,
      gender,
      job,
      phoneNumber,
      city,
      loanAmount,
      loanCategory,
      isSettled,
      isRead,
    ]
  );
};

Loan.getLoanApplicationByUserId = (userId) => {
  return db.query("SELECT * FROM loan_applications WHERE user_id = $1", [
    userId,
  ]);
};

Loan.getLoanApplicationByLoanId = (loanId) => {
  return db.query("SELECT * FROM loan_applications WHERE loan_id = $1", [
    loanId,
  ]);
};

Loan.getAllLoanApplications = () => {
  return db.query("SELECT * FROM loan_applications ORDER BY loan_id DESC");
};

Loan.applicationSettled = (loanId) => {
  return db.query(
    "UPDATE loan_applications SET is_settled = true WHERE loan_id = $1",
    [loanId]
  );
};

Loan.applicationRead = (loanId) => {
  return db.query(
    "UPDATE loan_applications SET is_read = true WHERE loan_id = $1",
    [loanId]
  );
};

module.exports = Loan;

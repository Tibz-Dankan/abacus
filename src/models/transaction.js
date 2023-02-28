const db = require("../database/dbConfig");

const Transaction = {};

Transaction.saveRequest = (requestId, category, requestDate, isResponded) => {
  return db.query(
    "INSERT INTO transactions(request_id, category, request_date, is_responded) VALUES($1,$2,$3,$4)  RETURNING *",
    [requestId, category, requestDate, isResponded]
  );
};

Transaction.update = (
  transactionId,
  responseId,
  responseDate,
  url,
  fileName,
  isResponded
) => {
  return db.query(
    "UPDATE transactions SET response_id = $1, url = $2, file_name = $3, response_date =$4, is_responded =$5 WHERE transaction_id = $6",
    [responseId, url, fileName, responseDate, isResponded, transactionId]
  );
};

Transaction.findAll = () => {
  const query =
    "SELECT trans.*, usr.user_name FROM transactions AS trans, users AS usr WHERE trans.request_id = usr.user_id ORDER BY trans.transaction_id DESC";
  return db.query(query);
};

Transaction.findByRequestId = (requestId) => {
  return db.query(
    "SELECT * FROM transactions WHERE request_id =$1 ORDER BY transaction_id DESC",
    [requestId]
  );
};

Transaction.findByResponseId = (responseId) => {
  return db.query(
    "SELECT * FROM transactions WHERE response_id =$1 ORDER BY transaction_id DESC",
    [responseId]
  );
};

Transaction.findByTransactionId = (transactionId) => {
  return db.query(
    "SELECT trans.*, usr.user_name FROM transactions AS trans, users AS usr WHERE trans.transaction_id =$1",
    [transactionId]
  );
};

Transaction.findByRequestIdCategory = (requestId, category) => {
  return db.query(
    "SELECT * FROM transactions WHERE request_id =$1 and category =$2 ORDER BY transaction_id DESC",
    [requestId, category]
  );
};

Transaction.updateResponded = (transactionId) => {
  return db.query(
    "UPDATE transactions SET is_responded = true WHERE transaction_id =$1",
    [transactionId]
  );
};

module.exports = Transaction;

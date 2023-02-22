const db = require("../database/dbConfig");

const File = {};

// save user form
File.save = (userId, category, fileName, url, fileDate, isRead, isApproved) => {
  return db.query(
    "INSERT INTO user_files(user_id, category, file_name, url, file_date, is_read, is_approved) VALUES($1,$2,$3,$4,$5,$6,$7)  RETURNING *",
    [userId, category, fileName, url, fileDate, isRead, isApproved]
  );
};

File.update = (fileId, fileName, url) => {
  return db.query(
    "UPDATE user_files SET file_name = $1, url = $2 WHERE file_id = $3",
    [fileName, url, fileId]
  );
};

File.findByUserId = (userId) => {
  return db.query("SELECT * FROM user_files WHERE user_id =$1", [userId]);
};

File.findByFileId = (fileId) => {
  return db.query("SELECT * FROM user_files WHERE file_id =$1", [fileId]);
};

// save application form
File.saveApplication = (userId, category, fileName, url, fileDate) => {
  return db.query(
    "INSERT INTO application_files(user_id, category, file_name, url, file_date) VALUES($1,$2,$3,$4,$5)  RETURNING *",
    [userId, category, fileName, url, fileDate]
  );
};

File.updateApplication = (fileId, fileName, url) => {
  return db.query(
    "UPDATE application_files SET file_name = $1, url = $2 WHERE file_id = $3",
    [fileName, url, fileId]
  );
};

File.findApplicationById = (id) => {
  return db.query("SELECT * FROM application_files WHERE file_id =$1", [id]);
};

File.findAllApplications = () => {
  return db.query("SELECT * FROM application_files");
};

module.exports = File;

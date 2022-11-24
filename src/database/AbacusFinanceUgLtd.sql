CREATE DATABASE abacus_finance;

CREATE TABLE users (
   user_id SERIAL PRIMARY KEY ,
   user_name VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL,
   user_role VARCHAR(20) NOT NULL
   password VARCHAR(255) NOT NULL,
   UNIQUE (email) 
);

CREATE TABLE admin_signup_codes (
   code_id SERIAL PRIMARY KEY ,
   code INTEGER NOT NULL,
   associated_email VARCHAR(255) NOT NULL,
   used VARCHAR(10) NOT NULL,
   code_status VARCHAR(20) NOT NULL,
   generated_at VARCHAR(20) NOT NULL,
   created_by_user_id INTEGER NOT NULL
);


-- ALTER TABLE users ADD user_role VARCHAR(20) NOT NULL DEFAULT 'client'; 
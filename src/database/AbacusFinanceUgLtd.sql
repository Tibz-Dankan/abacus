CREATE DATABASE abacus_finance;

CREATE TABLE users (
   user_id SERIAL PRIMARY KEY ,
   user_name VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL,
   user_role VARCHAR(20) NOT NULL,
   password VARCHAR(255) NOT NULL,
   UNIQUE (email) 
);

CREATE TABLE reset_tokens (
   token_id SERIAL PRIMARY KEY ,
   user_id INTEGER NOT NULL,
   token VARCHAR(500) NOT NULL,
   token_expires VARCHAR(50) NOT NULL
);

CREATE TABLE admin_signup_codes (
   code_id SERIAL PRIMARY KEY ,
   code INTEGER NOT NULL,
   associated_email VARCHAR(255) NOT NULL,
   used VARCHAR(10) NOT NULL,
   code_status VARCHAR(20) NOT NULL,
   generated_at VARCHAR(50) NOT NULL,
   created_by_user_id INTEGER NOT NULL
);
    
CREATE TABLE loan_applications (
   loan_id SERIAL PRIMARY KEY ,
   user_id INTEGER NOT NULL ,
   first_name VARCHAR(255) NOT NULL,
   last_name VARCHAR(255) NOT NULL,
   gender VARCHAR(20) NOT NULL,
   job VARCHAR(300) NOT NULL,
   phone_number VARCHAR(50) NOT NULL,
   city VARCHAR(100) NOT NULL,
   loan_amount VARCHAR(255) NOT NULL,
   loan_category VARCHAR(255) NOT NULL,
   is_settled BOOLEAN NOT NULL,
   is_read BOOLEAN NOT NULL
);

CREATE TABLE sacco_membership (
   sacco_id SERIAL PRIMARY KEY ,
   user_id INTEGER NOT NULL ,
   first_name VARCHAR(255) NOT NULL,
   last_name VARCHAR(255) NOT NULL,
   gender VARCHAR(20) NOT NULL,
   job VARCHAR(300) NOT NULL,
   phone_number VARCHAR(50) NOT NULL, 
   city VARCHAR(100) NOT NULL,
   is_accepted BOOLEAN NOT NULL,
   is_read BOOLEAN NOT NULL
);

-- ALTER TABLE users ADD user_role VARCHAR(20) NOT NULL DEFAULT 'client'; 
-- ALTER TABLE loan_applications RENAME loan_mount TO loan_amount; -- To be done colleagues computer
-- ALTER TABLE loan_applications DROP COLUMN loan_category; -- To be run against production database




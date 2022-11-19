CREATE DATABASE abacus_finance;

CREATE TABLE users (
   user_id SERIAL PRIMARY KEY ,
   user_name VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,
   UNIQUE (email) 
);
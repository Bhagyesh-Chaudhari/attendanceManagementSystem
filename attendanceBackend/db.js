/**********************************************************************************************************************************
File Name: db.js

File created by: Bhagyesh Chaudhari

Date: 11-04-2025

Description: This file contains the database connection configuration for the MySQL database. It uses the mysql2 package to create a connection and loads environment variables from a .env file.

last modified: 12-04-2025

last modified by: Bhagyesh Chaudhari

Description of changes: Updated the database connection configuration to use environment variables for better security and flexibility.

***********************************************************************************************************************************/

const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected');
});

module.exports = db;
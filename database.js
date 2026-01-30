const database = require("mysql2/promise");
const dotenv = require("dotenv").config();

const db = database.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
});

module.exports = db;

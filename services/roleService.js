const db = require("../database");
const dateHelper = require("../helper/date");
const jwtHelper = require("../helper/jwt");

const getRole = async (httpQuery) => {
  let query = "SELECT * FROM role";
  let params = [];
  const httpQueryLength = Object.keys(httpQuery).length;
  if (httpQueryLength > 0) {
    query += " WHERE ";
    Object.entries(httpQuery).forEach(([key, value], idx) => {
      params.push(value);
      query += `${key} = ?`;
      if (idx === httpQueryLength - 1) {
        query += "";
      } else {
        query += " AND ";
      }
    });
  }

  const [roles] = await db.query(query, params);

  return roles;
};

module.exports = {
  getRole,
};

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

const postRole = async (roleName) => {
  const [postRes] = await db.query(
    "INSERT INTO role (role_name) VALUES(?)",
    roleName,
  );

  return postRes.affectedRows > 0 ? true : false;
};

module.exports = {
  getRole,
  postRole,
};

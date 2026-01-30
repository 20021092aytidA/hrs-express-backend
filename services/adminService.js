const db = require("../database");

const getAdmin = async (httpQuery) => {
  let query = "SELECT * FROM admin";
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
        query += ", ";
      }
    });
  }

  //   console.log(query);
  //   console.log(params);

  const [rows] = await db.query(query, params);
  return rows;
};

module.exports = { getAdmin };

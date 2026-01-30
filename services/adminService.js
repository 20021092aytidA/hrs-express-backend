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

  const [rows] = await db.query(query, params);
  return rows;
};

const postAdmin = async (
  fullName,
  username,
  password,
  isSuperAdmin,
  addedBy,
) => {
  const date = new Date();
  const todayDate = date.toISOString().slice(0, 10);
  const time = date.toTimeString().split(" ")[0];
  const dateTime = `${todayDate} ${time}`;

  const [post] = await db.query(
    "INSERT INTO admin (full_name, username, password, is_super_admin, added_at, added_by) VALUES (?,?,?,?,?,?)",
    [
      fullName,
      username,
      password,
      isSuperAdmin === "true" ? "TRUE" : "FALSE",
      dateTime,
      addedBy,
    ],
  );

  return post.affectedRows < 1 ? false : true;
};

module.exports = { getAdmin, postAdmin };

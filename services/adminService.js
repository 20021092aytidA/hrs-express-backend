const db = require("../database");
const date = require("../helper/date");

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
  const [post] = await db.query(
    "INSERT INTO admin (full_name, username, password, is_super_admin, added_at, added_by) VALUES (?,?,?,?,?,?)",
    [
      fullName,
      username,
      password,
      isSuperAdmin === "true" ? "TRUE" : "FALSE",
      date.getDateTime(),
      addedBy,
    ],
  );

  return post.affectedRows < 1 ? false : true;
};

const deleteAdmin = async (adminID, deletedBy) => {
  const [deleteProcess] = await db.query(
    "UPDATE admin SET deleted_at = ?, deleted_by = ? WHERE admin_id = ?",
    [date.getDateTime(), deletedBy, adminID],
  );

  return deleteProcess.affectedRows < 1 ? false : true;
};

module.exports = { getAdmin, postAdmin, deleteAdmin };

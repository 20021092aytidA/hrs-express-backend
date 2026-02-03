const db = require("../database");
const date = require("../helper/date");

const getUser = async (httpQuery) => {
  let query = "SELECT * FROM user";
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

  console.log(query);

  const [rows] = await db.query(query, params);
  return rows;
};

const postUser = async (fullName, username, password, isSuperUser, addedBy) => {
  const [post] = await db.query(
    "INSERT INTO user (full_name, username, password, is_super_user, added_at, added_by) VALUES (?,?,?,?,?,?)",
    [
      fullName,
      username,
      password,
      isSuperUser === "true" ? "TRUE" : "FALSE",
      date.getDateTime(),
      addedBy,
    ],
  );

  return post.affectedRows < 1 ? false : true;
};

const deleteUser = async (userID, deletedBy) => {
  const [deleteProcess] = await db.query(
    "UPDATE user SET deleted_at = ?, deleted_by = ? WHERE user_id = ?",
    [date.getDateTime(), deletedBy, userID],
  );

  return deleteProcess.affectedRows < 1 ? false : true;
};

const patchUser = async (userID, editedBy, httpBody) => {
  let query = "UPDATE user SET ";
  let params = [];

  Object.entries(httpBody).forEach(([key, value], idx) => {
    params.push(value);
    query += `${key} = ?, `;
  });

  query += "edited_by = ?, ";
  params.push(editedBy);

  query += "edited_at = ? ";
  params.push(date.getDateTime());

  params.push(userID);
  query += "WHERE user_id = ?";

  console.log(query);
  console.log(params);

  const [patch] = await db.query(query, params);

  return patch.affectedRows < 1 ? false : true;
};

module.exports = {
  getUser,
  postUser,
  deleteUser,
  patchUser,
};

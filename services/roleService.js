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

const patchRole = async (roleID, httpBody, userID) => {
  let query = "UPDATE role SET ";
  let params = [];

  Object.entries(httpBody).forEach(([key, value]) => {
    params.push(value);
    query += `${key} = ?, `;
  });

  query += "edited_by = ?, ";
  params.push(userID);

  query += "edited_at = ? ";
  params.push(date.getDateTime());

  params.push(roleID);
  query += "WHERE role_id = ?";

  console.log(query);
  console.log(params);

  const [patch] = await db.query(query, params);

  return patch.affectedRows < 1 ? false : true;
};

const deleteRole = async (roleID, userID) => {
  const [delRes] = await db.query(
    "UPDATE role SET deleted_at = ?, deleted_by = ? WHERE = ?",
    [dateHelper.getDateTime(), userID, roleID],
  );
  return delRes.affectedRows > 0 ? true : false;
};

module.exports = {
  getRole,
  postRole,
  patchRole,
  deleteRole,
};

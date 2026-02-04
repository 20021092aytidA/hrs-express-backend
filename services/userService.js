const db = require("../database");
const dateHelper = require("../helper/date");

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

const postUser = async (
  roleID,
  candidateDetailID,
  fullName,
  username,
  password,
  phoneNum,
  workMail,
  personalMail,
  homeAddress,
  NIK,
  NPWP,
  dateOfBirth,
  joinDate,
  holidayQuota,
  salary,
  addedBy,
) => {
  const params = [];
  params.push(roleID);
  if (candidateDetailID) {
    params.push(candidateDetailID);
  }
  params.push(
    ...[
      fullName,
      username,
      password,
      phoneNum,
      workMail,
      personalMail,
      homeAddress,
      NIK,
      NPWP,
      dateOfBirth,
      joinDate,
      holidayQuota,
      salary,
      dateHelper.getDateTime(),
      addedBy,
    ],
  );

  const query = `INSERT INTO user (role_id, ${candidateDetailID ? "candidate_detail_id, " : ""}full_name, username, password, phone_number, work_mail, personal_mail, home_address, nik, npwp, date_of_birth, join_date, holiday_quota, salary, created_at, created_by) VALUES (?,${candidateDetailID ? "?," : ""}?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  const [post] = await db.query(query, params);

  return post.affectedRows < 1 ? false : true;
};

const deleteUser = async (userID, deletedBy) => {
  const [deleteProcess] = await db.query(
    "UPDATE user SET deleted_at = ?, deleted_by = ? WHERE user_id = ?",
    [dateHelper.getDateTime(), deletedBy, userID],
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
  params.push(dateHelper.getDateTime());

  params.push(userID);
  query += "WHERE user_id = ?";

  const [patch] = await db.query(query, params);

  return patch.affectedRows < 1 ? false : true;
};

module.exports = {
  getUser,
  postUser,
  deleteUser,
  patchUser,
};

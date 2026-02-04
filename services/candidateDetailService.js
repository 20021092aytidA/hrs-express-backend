const db = require("../database");
const dateHelper = require("../helper/date");

const getCandidateDetail = async (httpQuery) => {
  let query = "SELECT * FROM candidate_detail";
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

  const [candidateDetails] = await db.query(query, params);
  return candidateDetails;
};

const postCandidateDetail = async (
  positionName,
  currentCompany,
  currentCompanyLocation,
  expectedSalary,
  currentSalary,
  resume,
  addedBy,
) => {
  const [post] = await db.query(
    `INSERT INTO candidate_detail (position_name, current_company, current_company_location, expected_salary, current_salary, resume, created_by, created_at) VALUES (?,?,?,?,?,?,?,?)`,
    [
      positionName,
      currentCompany,
      currentCompanyLocation,
      expectedSalary,
      currentSalary,
      resume,
      addedBy,
      dateHelper.getDateTime(),
    ],
  );

  return post.affectedRows > 0 ? true : false;
};

const patchCandidateDetail = async (candidateDetailID, httpBody, userID) => {
  let query = "UPDATE candidate_detail SET ";
  let params = [];

  Object.entries(httpBody).forEach(([key, value]) => {
    params.push(value);
    query += `${key} = ?, `;
  });
  query += "edited_by = ?, ";
  params.push(userID);

  query += "edited_at = ? ";
  params.push(dateHelper.getDateTime());

  params.push(candidateDetailID);
  query += "WHERE role_id = ?";

  const [patch] = await db.query(query, params);

  return patch.affectedRows < 1 ? false : true;
};

const deleteCandidateDetail = async (candidateDetailID, userID) => {
  const [delRes] = await db.query(
    "UPDATE candidate_detail SET deleted_at = ?, deleted_by = ? WHERE candidate_detail_id = ?",
    [dateHelper.getDateTime(), Number(userID), Number(candidateDetailID)],
  );
  return delRes.affectedRows > 0 ? true : false;
};

module.exports = {
  getCandidateDetail,
  postCandidateDetail,
  patchCandidateDetail,
  deleteCandidateDetail,
};

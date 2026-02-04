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

const patchCandidateDetail = async () => {};

const deleteCandidateDetail = async () => {};

module.exports = {
  getCandidateDetail,
  postCandidateDetail,
  patchCandidateDetail,
  deleteCandidateDetail,
};

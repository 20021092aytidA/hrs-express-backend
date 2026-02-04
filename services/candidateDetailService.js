const db = require("../database");

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

const postCandidateDetail = async () => {};

const patchCandidateDetail = async () => {};

const deleteCandidateDetail = async () => {};

module.exports = {
  getCandidateDetail,
  postCandidateDetail,
  patchCandidateDetail,
  deleteCandidateDetail,
};

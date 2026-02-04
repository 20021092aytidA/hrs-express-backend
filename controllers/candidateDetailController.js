const service = require("../services/candidateDetailService");

const getCandidateDetail = async (req, res) => {
  try {
    const candidateDetails = await service.getCandidateDetail(req.query);
    return res.status(200).json({
      status: 200,
      message: "Successfully retrieve candidate detail(s).",
      data: candidateDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

const postCandidateDetail = async (req, res) => {};

const patchCandidateDetail = async (req, res) => {};

const deleteCandidateDetail = async (req, res) => {};

module.exports = {
  getCandidateDetail,
  postCandidateDetail,
  patchCandidateDetail,
  deleteCandidateDetail,
};

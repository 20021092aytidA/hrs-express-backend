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

const postCandidateDetail = async (req, res) => {
  const {
    position_name,
    current_company,
    current_company_location,
    expected_salary,
    current_salary,
    resume,
    added_by,
  } = req.body;

  try {
    if (
      !position_name ||
      !current_company ||
      !current_company_location ||
      !expected_salary ||
      !current_salary ||
      !resume ||
      !added_by
    ) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing body value(s)." });
    }

    const postRes = await service.postCandidateDetail(
      position_name,
      current_company,
      current_company_location,
      expected_salary,
      current_salary,
      resume,
      added_by,
    );

    if (!postRes) {
      return res.status(500).json({
        status: 500,
        message: "Failed to create new candidate detail.",
      });
    }

    return res.status(201).json({
      status: 201,
      message: "Succesfully created new candidate detail.",
      data: {
        position_name: position_name,
        current_company: current_company,
        current_company_location: current_company_location,
        expected_salary: expected_salary,
        current_salary: current_salary,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

const patchCandidateDetail = async (req, res) => {};

const deleteCandidateDetail = async (req, res) => {};

module.exports = {
  getCandidateDetail,
  postCandidateDetail,
  patchCandidateDetail,
  deleteCandidateDetail,
};

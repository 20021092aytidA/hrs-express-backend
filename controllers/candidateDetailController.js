const service = require("../services/candidateDetailService");

const getCandidateDetail = async (req, res) => {
  let jwtToken = undefined;
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    // Bearer [jwt-token]
    jwtToken = authHeader.split(" ")[1];
  }

  try {
    if (!jwtToken) {
      return res
        .status(401)
        .json({ status: 401, message: "Missing authorization token!" });
    }

    const isTokenValid = jwtHelper.checkKey(jwtToken);
    if (!isTokenValid) {
      return res
        .status(403)
        .json({ status: 403, message: "Authorization token is not valid!" });
    }

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

  let jwtToken = undefined;
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    // Bearer [jwt-token]
    jwtToken = authHeader.split(" ")[1];
  }

  try {
    if (!jwtToken) {
      return res
        .status(401)
        .json({ status: 401, message: "Missing authorization token!" });
    }

    const isTokenValid = jwtHelper.checkKey(jwtToken);
    if (!isTokenValid) {
      return res
        .status(403)
        .json({ status: 403, message: "Authorization token is not valid!" });
    }

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

const patchCandidateDetail = async (req, res) => {
  const { candidate_detail_id, user_id } = req.params;
  let jwtToken = undefined;
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    // Bearer [jwt-token]
    jwtToken = authHeader.split(" ")[1];
  }

  try {
    if (!jwtToken) {
      return res
        .status(401)
        .json({ status: 401, message: "Missing authorization token!" });
    }

    const isTokenValid = jwtHelper.checkKey(jwtToken);
    if (!isTokenValid) {
      return res
        .status(403)
        .json({ status: 403, message: "Authorization token is not valid!" });
    }

    if (!candidate_detail_id || !user_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing param value(s)!" });
    }

    const candidateDetail = await service.getCandidateDetail({
      candidate_detail_id: candidate_detail_id,
    });
    if (candidateDetail.length < 1) {
      return res
        .status(204)
        .json({ status: 204, message: "Candidate detail not found!" });
    }

    const patchRes = await service.patchCandidateDetail(
      candidate_detail_id,
      req.body,
      user_id,
    );
    if (!patchRes) {
      return res
        .status(500)
        .json({ status: 500, message: "Failed to update candidate detail!" });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Successfully update candidate detail!" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

const deleteCandidateDetail = async (req, res) => {
  const { candidate_detail_id, user_id } = req.params;
  let jwtToken = undefined;
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    // Bearer [jwt-token]
    jwtToken = authHeader.split(" ")[1];
  }

  try {
    if (!jwtToken) {
      return res
        .status(401)
        .json({ status: 401, message: "Missing authorization token!" });
    }

    const isTokenValid = jwtHelper.checkKey(jwtToken);
    if (!isTokenValid) {
      return res
        .status(403)
        .json({ status: 403, message: "Authorization token is not valid!" });
    }

    if (!candidate_detail_id || !user_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing param value(s)!" });
    }

    const candidateDetail = await service.getCandidateDetail({
      candidate_detail_id: candidate_detail_id,
    });
    if (candidateDetail.length < 1) {
      return res
        .status(204)
        .json({ status: 204, message: "No candidate detail found!" });
    }

    const delRes = await service.deleteCandidateDetail(
      candidate_detail_id,
      user_id,
    );
    if (!delRes) {
      return res
        .status(500)
        .json({ status: 500, message: "Failed to delete candidate detail!" });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Successfully deleted candidate detail!" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

module.exports = {
  getCandidateDetail,
  postCandidateDetail,
  patchCandidateDetail,
  deleteCandidateDetail,
};

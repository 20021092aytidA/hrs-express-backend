const userService = require("../services/userService");
const roleService = require("../services/roleService");
const candidateDetailService = require("../services/candidateDetailService");
const bcrypt = require("bcrypt");
const jwtHelper = require("../helper/jwt");

const getUser = async (req, res) => {
  try {
    const data = await userService.getUser(req.query);

    return res.status(200).json({
      status: 200,
      message: "Successfully retrieve users.",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

const postUser = async (req, res) => {
  const {
    role_id,
    candidate_detail_id,
    full_name,
    username,
    password,
    phone_number,
    work_mail,
    personal_mail,
    home_address,
    nik,
    npwp,
    date_of_birth,
    join_date,
    holiday_quota,
    salary,
    added_by,
  } = req.body;

  try {
    if (
      !role_id ||
      !full_name ||
      !username ||
      !password ||
      !phone_number ||
      !work_mail ||
      !personal_mail ||
      !home_address ||
      !nik ||
      !npwp ||
      !date_of_birth ||
      !join_date ||
      !holiday_quota ||
      !salary ||
      !added_by
    ) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing body value(s)." });
    }

    //  CHECK FOR ROLE
    const role = await roleService.getRole({ role_id: role_id });
    if (role.length < 1) {
      return res
        .status(400)
        .json({ status: 400, message: "Role does not exist!" });
    }

    // CHECK FOR CANDIDATE DETAIL
    // const candidateDetail = await candidateDetailService.getCandidateDetail({
    //   candidate_detail_id: candidate_detail_id,
    // });
    // if (candidateDetail.length < 1) {
    //   return res
    //     .status(400)
    //     .json({ status: 400, message: "Candidate detail does not exist!" });
    // }

    //CHECK FOR DUPLICATES
    const user = await userService.getUser({ username: username });
    if (user.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "User with the username already exist.",
      });
    }

    const hashedPass = bcrypt.hashSync(password, 10, (err, result) => {
      if (err) {
        console.log(err);
      }

      return result;
    });

    const postRes = await userService.postUser(
      role_id,
      candidate_detail_id,
      full_name,
      username,
      hashedPass,
      phone_number,
      work_mail,
      personal_mail,
      home_address,
      nik,
      npwp,
      date_of_birth,
      join_date,
      holiday_quota,
      salary,
      added_by,
    );

    if (!postRes) {
      return res
        .status(500)
        .json({ status: 500, message: "Failed to create new user." });
    }

    return res.status(201).json({
      status: 201,
      message: "Succesfully created new user.",
      data: {
        role_id: role_id,
        candidate_detail_id: candidate_detail_id,
        full_name: full_name,
        username: username,
        phone_number: phone_number,
        work_mail: work_mail,
        personal_mail: personal_mail,
        home_address: home_address,
        nik: nik,
        npwp: npwp,
        date_of_birth: date_of_birth,
        join_date: join_date,
        holiday_quota: holiday_quota,
        salary: salary,
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

const deleteUser = async (req, res) => {
  const { user_id, deleted_by } = req.params;
  try {
    //CHECK IF EXIST
    const user = await userService.getUser({
      user_id: user_id,
    });
    if (user.length < 1) {
      return res.status(204).json({ status: 204, message: "No user found!" });
    }

    const deleteRes = await userService.deleteUser(user_id, deleted_by);
    if (!deleteRes) {
      return res
        .status(500)
        .json({ status: 500, message: "Failed to delete user." });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Successfully deleted user." });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

const patchUser = async (req, res) => {
  const { user_id, edited_by } = req.params;

  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing body value(s)." });
    }

    //CHECK IF EXIST
    const ifExist = await userService.getUser({
      user_id: user_id,
    });
    if (ifExist.length < 1) {
      return res.status(404).json({ status: 404, message: "No user found!" });
    }

    //CHECK FOR ROLE
    if (Object.keys(req.body).includes("role_id")) {
      const ifDuplicateRole = await roleService.getRole({
        role_id: req.body.role_id,
      });
      if (ifDuplicateRole.length > 0) {
        return res.status(400).json({
          status: 400,
          message: "Role does not exist!.",
        });
      }
    }

    //CHECK FOR CADIDATE
    // if (Object.keys(req.body).includes("candidate_detail_id")) {
    //   const ifDuplicateCandidateDetail =
    //     await candidateDetailService.getCandidateDetail({
    //       candidate_detail_id: req.body.candidate_detail_id,
    //     });
    //   if (ifDuplicateCandidateDetail.length > 0) {
    //     return res.status(400).json({
    //       status: 400,
    //       message: "Candidate detail does not exist!.",
    //     });
    //   }
    // }

    //CHECK FOR DUPLICATES
    if (Object.keys(req.body).includes("username")) {
      const ifDuplicateUsername = await userService.getUser({
        username: req.body.username,
      });
      if (ifDuplicateUsername.length > 0) {
        return res.status(400).json({
          status: 400,
          message: "User with the username already exist.",
        });
      }
    }

    const patchRes = await userService.patchUser(user_id, edited_by, req.body);
    if (!patchRes) {
      return res
        .status(500)
        .json({ status: 500, message: "Failed to update user." });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Successfully update user." });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing body value(s)." });
    }

    const user = await userService.getUser({ username: username });
    if (user.length < 1) {
      return res.status(404).json({ status: 404, message: "No user found!" });
    }

    const isPassCorrect = bcrypt.compareSync(password, password);
    if (!isPassCorrect) {
      return res.status(400).json({ status: 400, message: "Wrong password!" });
    }

    const userToken = jwtHelper.createKey(user[0]);

    return res.status(200).json({
      status: 200,
      message: "Login successful.",
      token: userToken,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

module.exports = {
  getUser,
  postUser,
  deleteUser,
  patchUser,
  loginUser,
};

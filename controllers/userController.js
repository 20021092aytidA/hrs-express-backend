const service = require("../services/userService");
const bcrypt = require("bcrypt");
const jwtHelper = require("../helper/jwt");

const getUser = async (req, res) => {
  try {
    const data = await service.getUser(req.query);

    return res.status(200).json({
      status: 200,
      message: "Successfully retrieve users.",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
    });
  }
};

const postUser = async (req, res) => {
  const { full_name, username, password, added_by } = req.body;

  try {
    if (!full_name || !username || !password) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing body value(s)." });
    }

    //CHECK FOR DUPLICATES
    const users = await service.getUser({ username: username });
    if (users.length > 0) {
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

    const postRes = await service.postUser(
      full_name,
      username,
      hashedPass,
      is_super_user,
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
      data: { full_name: full_name, username: username },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
    });
  }
};

const deleteUser = async (req, res) => {
  const { user_id, deleted_by } = req.params;
  try {
    //CHECK IF EXIST
    const user = await service.getUser({
      user_id: user_id,
    });
    if (user.length < 1) {
      return res.status(204).json({ status: 204, message: "No user found!" });
    }

    const deleteRes = await service.deleteUser(user_id, deleted_by);
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
    const ifExist = await service.getUser({
      user_id: user_id,
    });
    if (ifExist.length < 1) {
      return res.status(404).json({ status: 404, message: "No user found!" });
    }

    //CHECK FOR DUPLICATES
    if (Object.keys(req.body).includes("username")) {
      const ifDuplicate = await service.getUser({
        username: req.body.username,
      });
      if (ifDuplicate.length > 0) {
        return res.status(400).json({
          status: 400,
          message: "User with the username already exist.",
        });
      }
    }

    const patchRes = await service.patchUser(user_id, edited_by, req.body);
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

    const user = await service.getUser({ username: username });
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

const service = require("../services/adminService");
const bcrypt = require("bcrypt");
const jwtHelper = require("../helper/jwt");

const getAdmin = async (req, res) => {
  try {
    const data = await service.getAdmin(req.query);

    return res.status(200).json({
      status: 200,
      message: "Successfully retrieve admins.",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
    });
  }
};

const postAdmin = async (req, res) => {
  const { full_name, username, password, is_super_admin, added_by } = req.body;

  try {
    if (!full_name || !username || !password) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing body value(s)." });
    }

    //CHECK FOR DUPLICATES
    const admins = await service.getAdmin({ username: username });
    if (admins.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Admin with the username already exist.",
      });
    }

    const hashedPass = bcrypt.hashSync(password, 10, (err, result) => {
      if (err) {
        console.log(err);
      }

      return result;
    });

    const postRes = await service.postAdmin(
      full_name,
      username,
      hashedPass,
      is_super_admin,
      added_by,
    );

    if (!postRes) {
      return res
        .status(500)
        .json({ status: 500, message: "Failed to create new admin." });
    }

    return res.status(201).json({
      status: 201,
      message: "Succesfully created new admin.",
      data: { full_name: full_name, username: username },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
    });
  }
};

const deleteAdmin = async (req, res) => {
  const { admin_id, deleted_by } = req.params;
  try {
    //CHECK IF EXIST
    const admin = await service.getAdmin({
      admin_id: admin_id,
    });
    if (admin.length < 1) {
      return res.status(404).json({ status: 404, message: "No admin found!" });
    }

    const deleteRes = await service.deleteAdmin(admin_id, deleted_by);
    if (!deleteRes) {
      return res
        .status(500)
        .json({ status: 500, message: "Failed to delete admin." });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Successfully deleted admin." });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
    });
  }
};

const patchAdmin = async (req, res) => {
  const { admin_id, edited_by } = req.params;

  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing body value(s)." });
    }

    //CHECK IF EXIST
    const ifExist = await service.getAdmin({
      admin_id: admin_id,
    });
    if (ifExist.length < 1) {
      return res.status(404).json({ status: 404, message: "No admin found!" });
    }

    //CHECK FOR DUPLICATES
    if (Object.keys(req.body).includes("username")) {
      const ifDuplicate = await service.getAdmin({
        username: req.body.username,
      });
      if (ifDuplicate.length > 0) {
        return res.status(400).json({
          status: 400,
          message: "Admin with the username already exist.",
        });
      }
    }

    const patchRes = await service.patchAdmin(admin_id, edited_by, req.body);
    if (!patchRes) {
      return res
        .status(500)
        .json({ status: 500, message: "Failed to update admin." });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Successfully update admin." });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
    });
  }
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing body value(s)." });
    }

    const user = await service.getAdmin({ username: username });
    if (user.length < 1) {
      return res.status(404).json({ status: 404, message: "No admin found!" });
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

module.exports = { getAdmin, postAdmin, deleteAdmin, patchAdmin, loginAdmin };

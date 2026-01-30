const service = require("../services/adminService");
const bcrypt = require("bcrypt");

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
        message: "User with the username already exist.",
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

module.exports = { getAdmin, postAdmin, deleteAdmin };

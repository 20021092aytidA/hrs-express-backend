const service = require("../services/roleService");

const getRole = async (req, res) => {
  try {
    const roles = await service.getRole(req.query);
    return res.status(200).json({
      status: 200,
      message: "Successfully retrieve role(s).",
      data: roles,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

const postRole = async (req, res) => {
  const { role_name } = req.body;
  try {
    if (!role_name) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing body value(s)!" });
    }

    const roles = await service.getRole({ role_name: role_name });
    if (roles.length > 0) {
      return res.status(400).json({
        status: 400,
        message: `Role with the name of [${role_name}] already exist!`,
      });
    }

    const postRes = await service.postRole(role_name);
    if (!postRes) {
      return res
        .status(500)
        .json({ status: 500, message: "Failed to create new role!" });
    }

    return res
      .status(201)
      .json({ status: 201, message: "Successfully created new role!" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

const patchRole = async (req, res) => {
  const { role_id, user_id } = req.param;

  try {
    if (!role_id || !user_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing param value(s)!" });
    }

    const role = await service.getRole({ role_id: role_id });
    if (role.length < 1) {
      return res.status(204).json({ status: 204, message: "Role not found!" });
    }

    const patchRes = await service.patchRole(role_id, req.body, user_id);
    if (!patchRes) {
      return res
        .status(500)
        .json({ status: 500, message: "Failed to update role!" });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Successfully update role!" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

const deleteRole = async (req, res) => {
  const { role_id, user_id } = req.params;
  try {
    if (!role_id || !admin_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Bad request, missing param value(s)!" });
    }

    const role = await service.getRole({ role_id: role_id });
    if (role.length < 1) {
      return res.status(204).json({ status: 204, message: "No role found!" });
    }

    const delRes = await service.deleteRole(role_id, user_id);
    if (!delRes) {
      return res
        .status(500)
        .json({ status: 500, message: "Failed to delete role!" });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Successfully deleted role!" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error,
    });
  }
};

module.exports = {
  getRole,
  postRole,
  patchRole,
  deleteRole,
};

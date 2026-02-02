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
    });
  }
};

module.exports = {
  getRole,
};

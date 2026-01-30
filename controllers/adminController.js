const service = require("../services/adminService");

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

module.exports = { getAdmin };

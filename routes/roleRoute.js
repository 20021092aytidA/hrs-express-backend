const express = require("express");
const router = express.Router();
const controller = require("../controllers/roleController");

router.get("/", controller.getRole);

module.exports = router;

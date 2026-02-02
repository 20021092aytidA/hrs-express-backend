const express = require("express");
const router = express.Router();
const controller = require("../controllers/roleController");

router.get("/", controller.getRole);

router.post("/", controller.postRole);

module.exports = router;

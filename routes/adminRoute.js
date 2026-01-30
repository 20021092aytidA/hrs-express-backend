const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", adminController.getAdmin);

router.post("/", adminController.postAdmin);

module.exports = router;

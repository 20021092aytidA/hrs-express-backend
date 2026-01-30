const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", adminController.getAdmin);

router.post("/", adminController.postAdmin);

router.delete("/:admin_id/:deleted_by", adminController.deleteAdmin);

module.exports = router;

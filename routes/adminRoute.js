const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", adminController.getAdmin);

router.post("/", adminController.postAdmin);

router.delete("/:admin_id/:deleted_by", adminController.deleteAdmin);

router.patch("/:admin_id/:edited_by", adminController.patchAdmin);

module.exports = router;

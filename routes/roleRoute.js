const express = require("express");
const router = express.Router();
const controller = require("../controllers/roleController");

router.get("/", controller.getRole);

router.post("/", controller.postRole);

router.patch("/:role_id/:user_id", controller.patchRole);

router.delete("/:role_id/:user_id", controller.deleteRole);

module.exports = router;

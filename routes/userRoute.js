const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getUser);

router.post("/", userController.postUser);
router.post("/login", userController.loginUser);

router.delete("/:user_id/:deleted_by", userController.deleteUser);

router.patch("/:user_id/:edited_by", userController.patchUser);

module.exports = router;

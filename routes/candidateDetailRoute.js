const express = require("express");
const router = express.Router();
const controller = require("../controllers/candidateDetailController");

router.get("/", controller.getCandidateDetail);

router.post("/", controller.postCandidateDetail);

router.patch("/:candidate_detail_id/:user_id", controller.patchCandidateDetail);

router.delete(
  "/:candidate_detail_id/:user_id",
  controller.deleteCandidateDetail,
);

module.exports = router;

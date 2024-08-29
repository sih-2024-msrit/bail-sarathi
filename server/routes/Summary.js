const { Router } = require("express");
const { getSummary, createSummary } = require("../controllers/summary");

const router = Router();

// sending bail application
router.route("/summary").post(getSummary);
router.route("/create-summary").get(createSummary);

module.exports = router;
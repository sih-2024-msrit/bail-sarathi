const { Router } = require("express");

const router = Router();

// sending bail application
router.route("/summary").post();

module.exports = router;
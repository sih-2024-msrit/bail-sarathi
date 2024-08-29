const { Router } = require("express");
const router = Router();

// for judge
router.route("/bailout").post();
// for user dashboard
router.route("/bailout-status").get();

module.exports = router;
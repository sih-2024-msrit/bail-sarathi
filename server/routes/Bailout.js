const { Router } = require("express");
const { Makebailout, bailoutStatus } = require("../controllers/bailout");
const router = Router();

// for judge
router.route("/bailout").post(Makebailout);
// for user dashboard
router.route("/bailout-status").get(bailoutStatus);

module.exports = router;
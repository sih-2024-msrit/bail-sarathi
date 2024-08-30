const { Router } = require("express");
// const { Makebailout, bailoutStatus } = require("../controllers/bailout");
const {createApplication}=require('../controllers/bailout')
const router = Router();

// for judge
// router.route("/bailout").post(Makebailout);
// // for user dashboard
// router.route("/bailout-status").get(bailoutStatus);

router.route("/bail-apply").post(createApplication);

module.exports = router;
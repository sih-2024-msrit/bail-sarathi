const { Router } = require("express");
// const { Makebailout, bailoutStatus } = require("../controllers/bailout");
const {createApplication,testFlask, bailSummary, getLawyerBail, getJudgeBail, testChatBot}=require('../controllers/bailout')
const router = Router();

// for judge
// router.route("/bailout").post(Makebailout);
// // for user dashboard
// router.route("/bailout-status").get(bailoutStatus);

router.route("/bail-apply").post(createApplication);
router.route("/test-flask").post(testFlask);
router.route("/bail-summary").post(bailSummary);
router.route("/get-lawyer-bails").post(getLawyerBail);
router.route("/get-judge-bails").post(getJudgeBail);
router.route("/test-chatbot").post(testChatBot);

module.exports = router;
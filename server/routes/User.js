const { Router } = require("express");
const { login, signup } = require("../controllers/auth");


const router = Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
module.exports = router;
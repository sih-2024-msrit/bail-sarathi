const { Router } = require("express");
const {  login } = require("../controllers/Auth")

const router = Router();

router.route("/login").post(login);

module.exports = router;
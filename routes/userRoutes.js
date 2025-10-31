const express = require("express");
const { userRegister, userLogin } = require("../controllers/userController");
const router = express.Router();
const validator = require("../middlewares/validator");

router.post("/register", validator("userRegister"), userRegister);
router.post("/login", validator("userLogin"), userLogin);

module.exports = router;
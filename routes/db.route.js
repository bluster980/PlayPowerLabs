const express = require("express");
const { checkDb } = require("../controllers/db.controller.js");
const { getUsers } = require("../controllers/userController.js");
const { signUp } = require("../controllers/authController.js");
const { logIn } = require("../controllers/authController.js");
// const express = require('express');
const cookieParser = require('cookie-parser')

const app = express();

app.use(cookieParser())

const router = express.Router();

router.get("/check", checkDb);
router.get("/users", getUsers);
router.get("/signup", signUp);
router.post("/login", logIn);

module.exports = router;

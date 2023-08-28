const express = require("express");
const { checkDb } = require("../controllers/db.controller.js");
const { getUsers } = require("../controllers/userController.js");
const { signUp } = require("../controllers/authController.js");
const { logIn } = require("../controllers/authController.js");
const { assignmentCreate} = require("../controllers/assignmentController.js");
const { assignmentUpdate} = require("../controllers/assignmentController.js");
const { assignmentDelete} = require("../controllers/assignmentController.js");
// const express = require('express');
const cookieParser = require('cookie-parser')

const app = express();

app.use(cookieParser())

const router = express.Router();

router.get("/check", checkDb);
router.get("/users", getUsers);
router.get("/signup", signUp);
router.post("/login", logIn);
router.post("/assignment-create", assignmentCreate);
router.post("/assignment-update", assignmentUpdate);
router.post("/assignment-delete", assignmentDelete);

module.exports = router;

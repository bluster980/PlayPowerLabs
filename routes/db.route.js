const express = require("express");
const { checkDb } = require("../controllers/db.controller.js");
const { getUsers } = require("../controllers/userController.js");
const { signUp } = require("../controllers/authController.js");
const { logIn } = require("../controllers/authController.js");
const { assignmentCreate} = require("../controllers/assignmentController.js");
const { assignmentUpdate} = require("../controllers/assignmentController.js");
const { assignmentDelete} = require("../controllers/assignmentController.js");
const { teacherOnly } = require("../middlewares/checkRole.js");
const { studentOnly } = require("../middlewares/checkRole.js");
const { assignmentSubmission } = require("../controllers/assignmentController.js");
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser())

const router = express.Router();

router.get("/check", checkDb);
router.get("/users", getUsers);
router.get("/signup", signUp);
router.post("/login", logIn);
router.post("/assignment-create", teacherOnly, assignmentCreate);
router.put("/assignment-update", teacherOnly, assignmentUpdate);
router.delete("/assignment-delete", teacherOnly, assignmentDelete);
router.post("/assignment-submission", studentOnly, assignmentSubmission);

module.exports = router;

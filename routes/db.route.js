const express = require("express");
const { checkDb } = require("../controllers/db.controller");
const { getUsers } = require("../controllers/userController");
const router = express.Router();

router.get("/check", checkDb);
router.get("/users", getUsers);

module.exports = router;

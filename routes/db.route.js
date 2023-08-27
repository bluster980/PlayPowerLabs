const express = require('express');
const { checkDb } = require('../controllers/db.controller.js');
const router = express.Router();

router.use('/db', require('./db.route.js'));
router.get('/check',checkDb);

module.exports = router;

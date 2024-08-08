const express = require('express');
const router = express.Router();
const { submitAnswer } = require('../controllers/gameController');

router.post('/submit', submitAnswer);

module.exports = router;

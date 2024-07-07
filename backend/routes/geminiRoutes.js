const express = require('express');
const geminiControllers = require('../controllers/geminiControllers');

const router = express.Router();

router.get('/:city', geminiControllers.geminiRequest);

module.exports = router;
// userRoutes.js
const express = require('express');
const router = express.Router();
const chatgptController = require('../controllers/chatgptController')

router.post('/', chatgptController.askQuestion);
module.exports = router;

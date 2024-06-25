// userRoutes.js
const express = require('express');
const router = express.Router();
const news = require('../controllers/newsControllers')

router.get('/',news.getNews);
router.post('/NewsCategoryWise',news.getNewsCategoryWise);
router.post('/NewsIdWise',news.getNewsIdWise);
module.exports = router;

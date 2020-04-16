var express = require('express');
var router = express.Router();

var {
  homeData,
  goodsData
} = require('../controller/homeController')

/* GET users listing. */
router.get('/multidata', homeData);
router.get('/data', goodsData);

module.exports = router;
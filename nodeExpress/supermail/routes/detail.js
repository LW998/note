var express = require('express');
var router = express.Router();

var {
    getRecommend
} = require('../controller/detailController')

router.get('/recommend', getRecommend);

module.exports = router;
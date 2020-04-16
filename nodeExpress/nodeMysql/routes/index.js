var express = require('express');
var router = express.Router();

var {
  findUser,
  getPostCate
} = require('../controller/postController')

/* GET home page. */
router.get('/', findUser);
router.get('/getPostCate', getPostCate);

module.exports = router;
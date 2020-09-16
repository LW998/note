var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function (req, res, next) {
  console.log(req.query)
  res.send('首页');
});

router.post('/index', function (req, res, next) {
  console.log(req.query)
  res.send('首页');
});

module.exports = router;
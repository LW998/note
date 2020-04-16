var express = require('express');
var router = express.Router();
var {
  login,
  sendCode,
  codePhoneLogin
} = require('../controller/userController')


router.post('/sendCode', sendCode)
router.post('/codeLogin', codePhoneLogin)
router.post('/login', login)

/* GET users listing. */


module.exports = router;
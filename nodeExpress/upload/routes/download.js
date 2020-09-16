var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.download('./uploads/0bfcc290931fd971d1f4f4eb742d7ed2.png')
});

module.exports = router;
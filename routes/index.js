var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send(process.env.APP_BASE_URL);
});

module.exports = router;
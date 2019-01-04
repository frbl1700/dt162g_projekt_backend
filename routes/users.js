const express = require('express');
const router = express.Router();

/*
 *  API-endpunkter för användare
 */ 

router.get('/', function(req, res, next) {
    res.send('Users ');
});

router.post('/', function(req, res, next) {
    res.send('Lägg till användare ');
});

module.exports = router;
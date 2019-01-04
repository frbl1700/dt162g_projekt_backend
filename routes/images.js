const express = require('express');
const router = express.Router();

/*
 *  API-endpunkter för bilder
 */

router.get('/', function(req, res, next) {
    //Alla bilder
    res.send('Alla bilder');
});

router.get('/:imageId', function(req, res, next) {
    //Enstaka bild
    res.send(req.params.imageId);
});

router.post('/', function(req, res, next) {
    //Ladda upp en bild
    res.send('ladda upp bild');
});

router.put('/:imageId', function(req, res, next) {
    //Uppdatera en bild
    res.send(req.params.imageId);
});

router.delete('/:imageId', function(req, res, next) {
    //Ta bort en bild
    res.send(req.params.imageId);
});

module.exports = router;
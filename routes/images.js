/* 
    API-endpunkter för bilder 
*/

const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/* Model */
const Image = require('../models/image');

/* Klipper ut filändelse */
function getFileExtension(name) {
    var pos = name.lastIndexOf('.');

    if (pos >= 0) {
        return name.substr(pos);
    }

    return '';
}

/* Alla bilder */
router.get('/', function(req, res, next) {
    Image.find().sort({ created: -1 }).exec().then(doc => {
        if (doc) {
            console.log(doc);
            res.status(200).json(doc);
        } else {
            res.status(404).json(404);
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

/* Bilder via söksträng */
router.get('/query', function(req, res, next) {
    let query = req.query.query;
    console.log(query);

    Image
        .find({ $or: [ {info: {$regex: '.*' + query + '.*'}}, { tags: {$regex: '.*' + query + '.*'}} ] })
        .sort({ created: -1 })
        .exec()
        .then(doc => {
            if (doc) {
                console.log(doc);
                res.status(200).json(doc);
            } else {
                res.status(404).json(404);
            }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

/* Alla bilder för en user */
router.get('/user/:userId', function(req, res, next) {
    let userId = req.params.userId;

    Image.find({ userId: userId }).sort({created: -1}).exec().then(doc => {
        if (doc) {
            console.log(doc);
            res.status(200).json(doc);
        } else {
            res.status(404).json(404);
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

/* Enstaka bild */
router.get('/:imageId', function(req, res, next) {
    let id = req.params.imageId;

    Image.findById(id).exec().then(doc => {
        if (doc) {
            console.log(doc);
            res.status(200).json(doc);
        } else {
            res.status(404).json(404);
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

/* Uppdatera en bild (Patch är till för att modifiera delar av ett dokument) */
router.patch('/:imageId', function(req, res, next) {
    let id = req.params.imageId;
    let updates = {};

    for (const key of Object.keys(req.body)) {
        console.log(key, req.body[key]);
        updates[key] = req.body[key];
    }

    Image.updateOne({ _id: id }, { $set: updates })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

/* Ta bort en bild */
router.delete('/:imageId', async function(req, res, next) {
    let id = req.params.imageId;
    let userId = req.body.userId;
    let image = await Image.findById(id);

    if (image) {
        Image.deleteOne({ _id: id, userId: userId }).exec().then(result => {
            /* Ta även bort filen */
            let path = './img/' + image.userId + '/' + image.fileName;
            fs.unlinkSync(path);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
    else {
        res.status(404).json(404);
    }
});

/* Ladda upp en bild */
router.post('/', function(req, res, next) {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).json(0);
    }

    let imageId = new mongoose.Types.ObjectId();
    let file = req.files.file;
    let newFileName = imageId + getFileExtension(file.name);
    let userId = req.body.user;
    let info = req.body.info || '';
    let tags = req.body.tags || '';
    let path = './img/' + userId;
    let filePath = path + '/' + newFileName;
    let urlPath = process.env.APP_BASE_URL + '/' + userId + '/' + newFileName;
    
    //Kontrollera user-katalog
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, '0744');
    }

    //Flytta filen till user-katalogen
    file.mv(filePath, function(err) {
        if (err) {
            return res.status(500).json(err);
        }
    });

    //Skapa ett dokument
    var image = new Image(
    {
        _id: imageId,
        fileName: newFileName,
        userId: userId,
        url: urlPath,
        name: file.name,
        tags: tags,
        info: info,
        created: Date.now()
    });

    //Spara i databasen
    image.save().then(result => {
        console.log(result);
        res.status(201).json(result);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router;
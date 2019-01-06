/* 
    API-endpunkter för användare 
*/

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/* Model */
const User = require('../models/user');

/* Hämta user via epost och validera lösen */
router.post('/validate', function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({email: email}).exec().then(result => {
        if (result) {
            //Hittad. Validera lösen
            if (result.password === password) {
                return res.status(200).json(result);
            }
        } 

        res.status(401).json(401);

        console.log(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

/* Lägg till användare */
router.post('/', function(req, res, next) {
    let userId = new mongoose.Types.ObjectId();
    let email = req.body.email;
    let password = req.body.password;

    User.find({ email: email }).exec().then(result => {
        if (result && result.length > 0) {
            //Fanns redan en användare med denna epost
            console.log('Användare fanns');
            res.status(409).json(result);
        } else {
            //OK skapa ny
            let user = new User({
                _id : userId,
                email: email,
                password: password
            });

            //Spara i databasen
            user.save().then(result => {
                console.log(result);
                res.status(201).json(result);
            })
            .catch(err => {
                res.status(500).json(err);
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
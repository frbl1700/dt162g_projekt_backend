const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    password: String
});

module.exports = mongoose.model('User', schema);
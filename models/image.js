const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    fileName: String,
    name: String,
    url: String,
    tags: String,
    info: String,
    created: Date
});

module.exports = mongoose.model('Image', schema);
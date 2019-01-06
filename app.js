/* Environment variables */
require('dotenv').config();

var path = require('path');
var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var imageRouter = require('./routes/images');
var mongoose = require('mongoose');

/*  Mongoose (MongoDB) */
mongoose.connect('mongodb://localhost/img', { useNewUrlParser: true });

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Filuppladdning */
app.use(fileUpload());

/* Routes */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/images', imageRouter);

/* Statiska filer (bilder) */
app.use(express.static(path.join(__dirname, 'img')));

/* Error */
app.use(function(req, res, next) {
	next(createError(404));
});

app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.send(err.message);
});

module.exports = app;
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileupload = require("express-fileupload");
const flash = require('express-flash');
const mongoose = require("./config/Connection");
const indexRouter = require('./routes/index');
// const git = require("./node_modules")
const helpers = require('./utility/helpers');
require('dotenv').config();
const catchServerError = helpers.catchServerError;
const PORT = process.env.PORT;

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 24 * 60 * 60 * 365 * 1000, },
}));
app.use(flash());
app.use('/', indexRouter);


app.use(function (req, res, next) {
  next(createError(404));
});

app.use(catchServerError);
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})

module.exports = app;

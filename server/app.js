require("dotenv").config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors= require("cors");
const { sendResponse, AppError } =require("./helpers/utils.js")
const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

const mongoose = require("mongoose");
/* DB connection*/
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log(`DB connected`))
  .catch((err) => console.log(err));

app.use('/', indexRouter);

app.use((req, res, next) => {
    const err = new AppError(404,"Not Found","Bad Request");
    next(err);
  });


app.use((req, res, next) => {
    res.header('https://grants-2023.netlify.app/');
    next();
  });

app.use((err, req, res, next) => {
    console.log("ERROR", err);
      return sendResponse(
        res,
        err.statusCode ? err.statusCode : 500,
        false,
        null,
        { message: err.message },
        err.isOperational ? err.errorType : "Internal Server Error"
      );
  });
module.exports = app;

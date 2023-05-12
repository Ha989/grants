const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("Welcome to Grants!")
});

// auth.api
const authApi = require('./auth.api');
router.use("/auth", authApi);

// user.api
const userApi = require('./user.api');
router.use("/user", userApi);

// creator.api
const creatorApi = require('./creator.api');
router.use("/creator", creatorApi);

// project.api
const projectApi = require('./project.api');
router.use("/project", projectApi);

// commnent.api
const commentApi = require('./comment.api');
router.use("/comment", commentApi);


module.exports = router;

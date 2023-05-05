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

// admin.api
// const adminApi = require('./admin.api');
// router.use("/admin", adminApi);

// donation.api
// const donationApi = require('./donation.api');
// router.use("/donation", donationApi);

module.exports = router;

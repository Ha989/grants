const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { param, body } = require("express-validator");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");


/**
@route GET /:userId
@description get all the notification with current user
@body
@access Login required
*/

router.get("/", 
authentication.loginRequired,
// validators.validate([
//     param("userId").exists().isString().custom(validators.checkObjectId)
// ]),
notificationController.getAllNotifications
);


module.exports = router;
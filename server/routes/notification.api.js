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
notificationController.getAllNotifications
);

/**
@route PUT /:notificationId 
@description update notification as read
@body
@access Login required
*/

router.put("/", 
authentication.loginRequired,
notificationController.updateNotifications
);

/**
@route GET /new
@description update notification as read
@body
@access Login required
*/

router.get("/new", 
authentication.loginRequired,
notificationController.getNewNotifications
);

module.exports = router;
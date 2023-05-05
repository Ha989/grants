const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller")
const { param, body } = require("express-validator");
const  authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");

router.get("/me", authentication.loginRequired, userController.getCurrentUser);

/**
@route PUT /settings/:userId
@description Update user profile avatar, bio, name
@body { name, bio, avatarUrl }
@access private
*/

router.put("/settings/:userId", 
authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId)
  ]),
  userController.updateProfile
);



module.exports = router;
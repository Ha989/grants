const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller")
const { body } = require("express-validator");
const  authentication = require("../middlewares/authentication");
const  validators  = require("../middlewares/validators");



/**
@route POST /register
@description Register new user
@body { name, email, password, user role }
@access public
*/


router.post('/',
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
    .exists()
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
    body("role", "Invalid role").notEmpty()
  ]),
  userController.register
);

// router.get('/:id/verify/:verifyCode',
//   userController.verifyEmail
// );

module.exports = router;
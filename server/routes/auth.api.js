const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");


/**
@route POST auth/register
@description Register with email, password, role
@body { name, email, password, role }
@public
 */

router.post("/register", validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
    .exists()
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
    body("role", "Invalid role").notEmpty()
]),
  authController.register
);

router.get("/:id/verify/:code",
  authController.verifyEmail
);


/**
@route POST auth/login
@description Login with email and password
@body { email, password }
@access public
*/


router.post("/login", validators.validate([
    body("email", "Invalid Email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid Password").exists().notEmpty(),
  ]),
  authController.loginwithEmail
);

module.exports = router;
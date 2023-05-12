const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { param, body } = require("express-validator");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");

/**
@route POST /comment
@description create a comment 
@body { content, image }
@access Login required
*/

router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("projectId", "Missing projectId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
    body("content", "Missing content").exists().notEmpty(),
  ]),
  commentController.createComment
);

/**
@route PUT /comment
@description edit a comment
@body { content, image }
@access Login required
*/

router.put(
    "/:commentId",
    authentication.loginRequired,
    validators.validate([
      param("commentId").exists().isString().custom(validators.checkObjectId),
      body("content", "Missing content").exists().notEmpty(),
    ]),
    commentController.updateSingleComment
  );


/**
@route DELETE /comment
@description delete a comment
@body 
@access Login required
*/
  router.delete(
    "/:commentId",
    authentication.loginRequired,
    validators.validate([
      param("commentId").exists().isString().custom(validators.checkObjectId)
    ]),
    commentController.deleteComment
  );


  module.exports = router;
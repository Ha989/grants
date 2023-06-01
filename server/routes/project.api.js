const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller")
const { param, body } = require("express-validator");
const  authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");


/**
@route GET /project
@description get a list of projects
@body 
@access public
*/
router.get("/", projectController.getListProject);


/**
@route GET /projects/:projectId
@description get detail of single project
@body 
@access public
*/

router.get("/:projectId", 
validators.validate([
    param("projectId").exists().isString().custom(validators.checkObjectId)
]),
projectController.getSingleProject
);


/**
@route POST /projects/:projectId/donation/:userId
@description donate project which user like
@body { amount, projectId, userId }
@access Login required
*/


router.post("/:projectId/donation/:userId", 
authentication.loginRequired,
validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
    param("projectId").exists().isString().custom(validators.checkObjectId)
]),
projectController.createDonation
);


/**
@route PUT /:projectId/bookmark
@description user can bookmark and remove bookmark
@body
@access Login required
*/

router.put("/:projectId/bookmark/:userId", 
authentication.loginRequired,
validators.validate([
   param("projectId").exists().isString().custom(validators.checkObjectId),
   param("userId").exists().isString().custom(validators.checkObjectId) 
]),
projectController.bookmarkProject);



/**
@route PUT /:projectId/comment
@description get all comment of the project
@body
@access Login required
*/

router.get("/:projectId/comment", 
authentication.loginRequired,
validators.validate([
   param("projectId").exists().isString().custom(validators.checkObjectId) 
]),
projectController.getCommentOfProject);

module.exports = router;


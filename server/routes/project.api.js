const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller")
const { param, body } = require("express-validator");
const  authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");


/**
@route GET /projects
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
    param("userId").exists().isString().custom(validators.checkObjectId)
]),
projectController.createDonation
);


module.exports = router;


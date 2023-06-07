const express = require("express");
const router = express.Router();
const creatorController = require("../controllers/creator.controller")
const { param, body } = require("express-validator");
const  authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");


/**
@route GET /:id
@description get current creator 
@body { }
@access Login required
 */

router.get("/me", authentication.loginRequired, creatorController.getCurrentCreator);


/**
@route PUT /settings/:id
@description update creator information
@body { name, avatarUrl, bio }
@access Login required
 */

router.put("/settings/:creatorId", 
authentication.loginRequired,
validators.validate([
    param("creatorId").exists().isString().custom(validators.checkObjectId)
]),
creatorController.updateProfile
);


/**
@route POST /:id/create
@description create project
@body { name, description, ... }
@access Login required
 */
router.post("/:creatorId/create",
authentication.loginRequired,
validators.validate([
  param("creatorId").exists().isString().custom(validators.checkObjectId)
]),
creatorController.createProject
);

/**
@route GET /project/:projectId
@description get all projects by creator
@body
@access Login required
 */

router.get("/projects", authentication.loginRequired, creatorController.getProjectsByCreator)
/**
@route PUT /project/:projectId
@description update project
@body { name, description, ... }
@access Login required
 */

router.put("/project/:projectId",  
  authentication.loginRequired,
  validators.validate([
    param("projectId").exists().isString().custom(validators.checkObjectId)
]),
creatorController.updateProject
);

/**
@route DELETE /project/:projectId
@description delete Project
@body 
@access Login required
 */

router.delete("/project/:projectId",  
  authentication.loginRequired,
  validators.validate([
    param("projectId").exists().isString().custom(validators.checkObjectId)
]),
creatorController.deleteProject
);



/**
@route POST /donation/:donationId
@description confirm money received from user
@body { status: pending or received }
@access Login required
*/

router.put("/donations/:donationId", 
authentication.loginRequired,
validators.validate([
  param("donationId").exists().isString().custom(validators.checkObjectId)
]),
creatorController.confirmDonation
);

/**
@route GET /donation/:donationId
@description get single donation
@body
@access Login required
*/

router.get("/donations/:donationId",
authentication.loginRequired,
validators.validate([
  param("donationId").exists().isString().custom(validators.checkObjectId)
]),
creatorController.getSingleDonation)

/**
@route GET /creator/donations
@description get all donations
@body { isConfirm: true or false }
@access Login required
*/


router.get("/donations", authentication.loginRequired, creatorController.getDonationByProjectCreator);



module.exports = router;
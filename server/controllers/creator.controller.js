const Creator = require("../models/Creator");
const Project = require("../models/Project");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const creatorController = {};

// get current creator

creatorController.getCurrentCreator = catchAsync(async(req, res, next) => {
    const currentCreatorId = req.userId;

    const creator = await Creator.findById(currentCreatorId);
    if (!creator) throw new AppError(400, "Creator not found", "Get current creator error")
     
    return sendResponse(res, 200, true, creator, null, "Get creator successful")
});



// update creator profile

creatorController.updateProfile = catchAsync(async(req, res, next) => {
   const currentCreatorId = req.userId;
   const creatorId = req.params.creatorId;

   if (currentCreatorId !== creatorId) throw new AppError(400, "Permisstion required", "Update profile error");

   let creator = await Creator.findById(creatorId);
   if (!creator)  throw new AppError(400, "Creator not found", "Update profile error");

   const allowList = ["name", "avatarUrl", "bio"];

   allowList.forEach((field) => {
    if (req.body[field] !== undefined) {
      creator[field] = req.body[field];
    }
  });
  await creator.save();

  return sendResponse(res, 200, true, { creator }, null, "Update profile successful" )
})



// create project
creatorController.createProject = catchAsync(async(req, res, next) => {

    const creatorId = req.params.creatorId;
    const { name, description } = req.body;

    const creator = await Creator.findById(creatorId);
    if (!creator) throw new AppError(400, "Creator not found", "Create project error");

    const project = await Project.create({ name, description, creator: creatorId });
    creator.projects.push(project);
    await creator.save();
    sendResponse(res, 200, true, { project }, null, "Create project successful")
});


// update project detail

creatorController.updateProject = catchAsync(async(req, res, next) => {

    const currentCreatorId = req.userId;
    const projectId = req.params.projectId;

    const creator = await Creator.findById(currentCreatorId);

    if (!creator) throw new AppError(400, "Creator not found", "update project error");

    const project = await Project.findById(projectId);

    if (!project) throw new AppError(400, "Project not found", "update project error");

    if (project.creator.toString() !== currentCreatorId) throw new AppError(403, "You are not authorized to update this project");

    const allowField = [ "name", "description", "team", "logo", "banner", "socialLink", "bankDetail" ];
    
    allowField.forEach((field) => {
        if (req.body[field] !== undefined) {
          project[field] = req.body[field];
        }
      });
      await project.save();

      return sendResponse(res, 200, true, { project }, null, "Update profile successful" )

})

// delete project

creatorController.deleteProject = catchAsync(async(req, res, next) => {
    const currentCreatorId = req.userId;
    const projectId = req.params.projectId;

    const creator = await Creator.findById(currentCreatorId);

    if (!creator) throw new AppError(400, "Creator not found", "delete project error");

    const project = await Project.findById(projectId);

    if (!project) throw new AppError(400, "Project not found", "delete project error");

    if (project.creator.toString() !== currentCreatorId) throw new AppError(403, "You are not authorized to delete this project");

    const updatedCreator = await Creator.findByIdAndUpdate(
        currentCreatorId,
        { $pull: { projects: projectId } },
        { new: true }
      );

    const deletedProject = await Project.findByIdAndUpdate(projectId, { $set: { isDeleted: true }});

    sendResponse(res, 200, true, { updatedCreator, deletedProject }, null, "Delete project successful")

})


module.exports = creatorController;
const Creator = require("../models/Creator");
const Project = require("../models/Project");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Donation = require("../models/Donation");
const Notification = require("../models/Notification");

const creatorController = {};

// get current creator

creatorController.getCurrentCreator = catchAsync(async (req, res, next) => {
  const currentCreatorId = req.userId;

  const creator = await Creator.findById(currentCreatorId);
  if (!creator)
    throw new AppError(400, "Creator not found", "Get current creator error");

  return sendResponse(res, 200, true, creator, null, "Get creator successful");
});

// update creator profile

creatorController.updateProfile = catchAsync(async (req, res, next) => {
  const currentCreatorId = req.userId;
  const creatorId = req.params.creatorId;

  if (currentCreatorId !== creatorId)
    throw new AppError(400, "Permisstion required", "Update profile error");

  let creator = await Creator.findById(creatorId);
  if (!creator)
    throw new AppError(400, "Creator not found", "Update profile error");

  const allowList = ["name", "avatarUrl", "bio"];

  allowList.forEach((field) => {
    if (req.body[field] !== undefined) {
      creator[field] = req.body[field];
    }
  });
  await creator.save();

  return sendResponse(
    res,
    200,
    true,
    { creator },
    null,
    "Update profile successful"
  );
});

// create project
creatorController.createProject = catchAsync(async (req, res, next) => {
  const creatorId = req.params.creatorId;
  const {
    name,
    title,
    description,
    website,
    team,
    logo,
    video,
    banner,
    clientID,
  } = req.body;
  const creator = await Creator.findById(creatorId);

  const project = await Project.create({
    name,
    title,
    description,
    website,
    team,
    logo,
    banner,
    video,
    clientID,
    creator: creatorId,
  });
  creator.projects.push(project);
  await creator.save();
  sendResponse(res, 200, true, { project }, null, "Create project successful");
});

// get all projects by creator

creatorController.getProjectsByCreator = catchAsync(async (req, res, next) => {
  const creatorId = req.userId;

  const creator = await Creator.findById(creatorId);

  const projects = await Project.find({
    creator: creatorId,
    isDeleted: false,
  })
    .populate("donations")
    .populate({
      path: "donations",
      populate: {
        path: "userId",
        model: "users",
      },
    })
    .populate({
      path: "donations",
      populate: {
        path: "projectId",
        model: "projects",
      },
    });
  if (!projects) throw new AppError(403, "Unauthorized");

  sendResponse(res, 200, true, projects, null, "Get projects successfully");
});

// update project detail

creatorController.updateProject = catchAsync(async (req, res, next) => {
  const currentCreatorId = req.userId;
  const projectId = req.params.projectId;

  const creator = await Creator.findById(currentCreatorId);

  if (!creator)
    throw new AppError(400, "Creator not found", "update project error");

  const project = await Project.findById(projectId);

  if (!project)
    throw new AppError(400, "Project not found", "update project error");

  if (project.creator.toString() !== currentCreatorId)
    throw new AppError(403, "You are not authorized to update this project");

  const allowField = [
    "name",
    "title",
    "description",
    "team",
    "logo",
    "banner",
    "website",
    "video",
    "clientID",
  ];

  let filteredBody = {};
  allowField.forEach((field) => {
    if (req.body.hasOwnProperty(field)) {
      filteredBody[field] = req.body[field];
    }
  });

  await project.updateOne(filteredBody);

  return sendResponse(
    res,
    200,
    true,
    { project },
    null,
    "Update project successfully"
  );
});

// delete project

creatorController.deleteProject = catchAsync(async (req, res, next) => {
  const currentCreatorId = req.userId;
  const projectId = req.params.projectId;

  const creator = await Creator.findById(currentCreatorId);

  if (!creator)
    throw new AppError(400, "Creator not found", "delete project error");

  const project = await Project.findById(projectId);

  if (!project)
    throw new AppError(400, "Project not found", "delete project error");

  if (project.creator.toString() !== currentCreatorId)
    throw new AppError(403, "You are not authorized to delete this project");

  const updatedCreator = await Creator.findByIdAndUpdate(
    currentCreatorId,
    { $pull: { projects: projectId } },
    { new: true }
  );

  const deletedProject = await Project.findByIdAndUpdate(projectId, {
    $set: { isDeleted: true },
  });

  sendResponse(
    res,
    200,
    true,
    { updatedCreator, deletedProject },
    null,
    "Delete project successful"
  );
});

// get single donation

creatorController.getSingleDonation = catchAsync(async (req, res, next) => {
  const creatorId = req.userId;
  const donationId = req.params.donationId;

  let creator = await Creator.findById(creatorId);

  if (!creator)
    throw new AppError(400, "Creator not found", "Confirm donation error");

  let donation = await Donation.findById(donationId)
    .populate("projectId")
    .populate("userId");

  if (!donation)
    throw new AppError(400, "Donation not found", "Confirm donation error");

  sendResponse(
    res,
    200,
    true,
    { donation },
    null,
    "Get Single Donation Success"
  );
});


// get all donations which belong to the projects of creator who is authorization

creatorController.getDonationByProjectCreator = catchAsync(
  async (req, res, next) => {
    const creatorId = req.userId;

    let creator = await Creator.findById(creatorId);

    const projects = await Project.find({ creator: creatorId });
    if (!projects) throw new AppError(403, "Unauthorized");

    const projectIds = projects.map((project) => project._id);

    const donations = await Donation.find({
      projectId: { $in: projectIds },
    })
      .populate("projectId")
      .populate("userId");

    return sendResponse(
      res,
      200,
      true,
      { donations },
      null,
      "Get donations successful"
    );
  }
);

module.exports = creatorController;

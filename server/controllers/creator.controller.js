const Creator = require("../models/Creator");
const Project = require("../models/Project");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Donation = require("../models/Donation");
const Notification = require("../models/Notification");

const creatorController = {};

// get current creator

creatorController.getCurrentCreator = catchAsync(async (req, res, next) => {
  const currentCreatorId = req.userId;
  console.log("current", currentCreatorId);

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
  const { name, title, description, website, team, logo, banner, bankDetail } =
    req.body;
  const creator = await Creator.findById(creatorId);
  if (!creator)
    throw new AppError(400, "Creator not found", "Create project error");

  const project = await Project.create({
    name,
    title,
    description,
    website,
    team,
    logo,
    banner,
    bankDetail,
    creator: creatorId,
  });
  creator.projects.push(project);
  await creator.save();
  sendResponse(res, 200, true, { project }, null, "Create project successful");
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
    "bankDetail",
  ];

  let filteredBody = {};
  allowField.forEach((field) => {
    if (req.body.hasOwnProperty(field)) {
      filteredBody[field] = req.body[field];
    }
  });
  if (Object.keys(req.body).includes("team")) {
    const currentTeam = project.team;
    const newTeam = [...currentTeam, req.body.team];

    filteredBody = { ...req.body, team: newTeam };
  }

  await project.updateOne(filteredBody);

  return sendResponse(
    res,
    200,
    true,
    { project },
    null,
    "Update project successful"
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

// confirm donation

creatorController.confirmDonation = catchAsync(async (req, res, next) => {
  const creatorId = req.userId;
  const donationId = req.params.donationId;

  let creator = await Creator.findById(creatorId);

  if (!creator)
    throw new AppError(400, "Creator not found", "Confirm donation error");

  let donation = await Donation.findById(donationId).populate("projectId");

  if (!donation)
    throw new AppError(400, "Donation not found", "Confirm donation error");

  const projectId = donation.projectId;
  const project = await Project.findById(projectId);
  if (!project)
    throw new AppError(400, "Project not found", "Confirm donation error");

  if (project.creator.toString() !== creatorId)
    throw new AppError(403, "Forbidden");

  donation.isConfirm = true;
  await donation.save();
  project.currentRaised += donation.amount;
  await project.save();

  const notification = await Notification.create({
    from: projectId.creator,
    to: donation.userId,
    type: 'donation',
    message: 'Your donation has been confirmed',
    donationId: donationId
 })

  return sendResponse(
    res,
    200,
    true,
    { donation, project, notification },
    null,
    "Confirm success"
  );
});

// get all donations which belong to the projects of creator who is authorization

creatorController.getDonationByProjectCreator = catchAsync(
  async (req, res, next) => {
    const creatorId = req.userId;

    let creator = await Creator.findById(creatorId);
    if (!creator)
      throw new AppError(400, "Creator not found", "Get donations list error");

    const projects = await Project.find({ creator: creatorId });
    if (!projects) throw new AppError(403, "Unauthorized");

    const projectIds = projects.map((project) => project._id);

    const donations = await Donation.find({
      projectId: { $in: projectIds },
    }).populate("projectId");

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

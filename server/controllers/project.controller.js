const Donation = require("../models/Donation");
const Project = require("../models/Project");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const projectController = {};

// get all list of project;

projectController.getListProject = catchAsync(async (req, res, next) => {
  let { page, limit } = req.body;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filter = { isDeleted: false };
  const listOfProject = await Project.find(filter)
    .skip(limit * (page - 1))
    .limit(limit);

  if (!listOfProject) throw new AppError(400, "No project found");

  return sendResponse(
    res,
    200,
    true,
    { projects: listOfProject, page: page },
    null,
    "Get Projects Success"
  );
});

// get single project

projectController.getSingleProject = catchAsync(async (req, res, next) => {
  const projectId = req.params.projectId;

  const singleProject = await Project.findById(projectId);
  if (!singleProject)
    throw new AppError(
      400,
      "Project not found",
      "Get single project detail error"
    );

  return sendResponse(
    res,
    200,
    true,
    singleProject,
    null,
    "Get single Project successful"
  );
});

// donation project

projectController.createDonation = catchAsync(async (req, res, next) => {
  const { projectId, userId } = req.params;
  const { amount } = req.body;

  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "user not found", "create donation error");

  let project = await Project.findById(projectId);

  if (!project)
    throw new AppError(400, "project not found", "create donation error");

  const donation = await Donation.create({
    projectId: projectId,
    userId: userId,
    amount: amount,
  });
   
  const notification = await Notification.create({
     from: donation.projectId,
     to: donation.userId,
     type: 'donation',
     message: 'Your donation receipt has been confirmed',
     donationId: donation._id
  })
  user.donations.push(donation);
  await user.save();

  project.donations.push(donation);
  await project.save();

  return sendResponse(
    res,
    200,
    true,
    { donation, project, user, notification },
    null,
    "Create donation successful"
  );
});


// bookmark and remove bookmark

projectController.bookmarkProject = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const projectId = req.params.projectId;

  const user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Bookmark error");

  let project = await Project.findById(projectId);
  if (!project) throw new AppError(400, "Project not found", "Bookmark error");

  const index = user.bookmarked.indexOf(projectId);
  const options = { new: true };
  if (index === -1) {
    user.bookmarked.push(projectId);
    user.save();

    project = await Project.findByIdAndUpdate(
      projectId,
      {
        $addToSet: { userBookmarked: userId },
        $inc: { totalBookmarks: 1 },
      },
      options
    ).populate("userBookmarked");

    const notification = await Notification.create({
      from: userId,
      to: projectId,
      type: 'bookmark',
      message: 'Your project got 1 new bookmark'
   });
    
    return sendResponse(
      res,
      200,
      true,
      { user, totalBookmarks: project.totalBookmarks, notification },
      null,
      "Bookmark successful"
    );
  } else {
    user.bookmarked.splice(index, 1);
    await user.save();

    project = await Project.findByIdAndUpdate(
      projectId,
      {
        $pull: { userBookmarked: userId },
        $inc: { totalBookmarks: -1 },
      },
      options
    ).populate("userBookmarked");

    return sendResponse(
      res,
      200,
      true,
      { user, totalBookmarks: project.totalBookmarks },
      null,
      "Remove bookmark successful"
    );
  }
});


// get all comments of project


projectController.getCommentOfProject = catchAsync(async(req, res, next) => {
  const projectId = req.params.projectId;
  
  const project = await Project.findById(projectId, { isDeleted: false })
   .populate({ path: 'comments', 
      populate: [
        { path: 'author', select: 'name' },
        {
          path: 'replies',
          populate: { path: 'author', select: 'name' },
        },
      ]
   }).exec();

  if (!project) throw new AppError(400, "Project not found");
   
  return sendResponse(res, 200, true, project.comments, null, "Get all comments successful");
   
});




module.exports = projectController;

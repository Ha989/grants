const User = require("../models/User");
const Donation = require("../models/Donation");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Project = require("../models/Project");

const userController = {};

// get current user
userController.getCurrentUser = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
  
    const user = await User.findById(currentUserId);
    if (!user)
      throw new AppError(400, "User not found", "Get current user error");
  
    return sendResponse(
      res,
      200,
      true,
      user,
      null,
      "Get current user successful"
    );
  });


// update user profile
userController.updateProfile = catchAsync(async(req, res, next) => {
    const currentUserId = req.userId;
    const  userId = req.params.userId;

    if (currentUserId !== userId ) throw new AppError(400, "Permission required", "Update profile error");

    let user = await User.findById(userId);
    if (!user) throw new AppError(400, "User not found", "Update profile error");

    const allowList = [ "name", "avatarUrl", "bio" ];

    allowList.forEach((field) => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });
      await user.save();
    
    return sendResponse(res, 200, true, { user }, null, "Update profile successful" )
    
});


// get list donated money to projects of user 
userController.getDonationsOfUser = catchAsync(async(req, res, next) => {
  const currentUserId = req.userId;
  let { page, limit, status } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;

  const user = await User.findById(currentUserId);
  if (!user) throw new AppError(400, "User not found", "Get donations list error");

  let filter = { userId: currentUserId };
  if (status) {
    if (status === 'pending') {
      // Filter for pending donations
      filter.isConfirm = false;
    } else if (status === 'completed') {
      // Filter for completed donations
      filter.isConfirm = true;
    }
  }
  
  const donations = await Donation.find(filter)
  .populate('userId')
  .populate('projectId')
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);


  const count = await Donation.countDocuments(filter);
  const totalPage = Math.ceil(count / limit);

  if(!donations) throw new AppError(400, "Unauthorized");

  return sendResponse(res, 200, true, { donations, totalPage: totalPage }, null, "Get donations list successful");
  });


userController.getBookmarksOfUser = catchAsync(async(req, res, next) => {
  const currentUserId = req.userId;

  const user = await User.findById(currentUserId).select('bookmarked').populate('bookmarked');
  if (!user) throw new AppError(400, "User not found", "Get donations list error");
  
  const bookmarkedProjectIds = user.bookmarked;

  const bookmarkedProjects = await Project.find({ _id: { $in: bookmarkedProjectIds }, isDeleted: false });
  
  sendResponse(res, 200, true, { bookmarkedProjects }, null, "Get bookmark of current user success")

});

module.exports = userController;
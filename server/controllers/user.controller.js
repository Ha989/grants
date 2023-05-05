const User = require("../models/User");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

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

    const allowList = [ "name", "avatartUrl", "bio" ];

    allowList.forEach((field) => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });
      await user.save();
    
    return sendResponse(res, 200, true, { user }, null, "Update profile successful" )
    
});



module.exports = userController;
const Notification = require("../models/Notification");
const User = require("../models/User");
const Creator = require("../models/Creator");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");


const notificationController = {};


// get all notifications

notificationController.getAllNotifications = catchAsync(async (req, res, next) => {
    const currentUserId = req.userId;
  
    const notifications = await Notification.find({ to: currentUserId })
    .sort({ createdAt: -1 })
    .populate({
        path: 'donationId',
        populate: {
          path: 'projectId',
          model: 'projects'
        }
      });

      console.log("noto", notifications)
      
  
    if (!notifications) {
      throw new AppError(400, 'Notifications not found', 'Get notification error');
    }
  
    return sendResponse(res, 200, true, { notifications }, null, 'Get notification successful');
  });
  

module.exports = notificationController;
const Notification = require("../models/Notification");
const User = require("../models/User");
const Creator = require("../models/Creator");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
// const nodemon = require("nodemon");
const { ObjectId } = require('mongodb');

const notificationController = {};

// get all notifications

notificationController.getAllNotifications = catchAsync(
  async (req, res, next) => {
    const currentUserId = req.userId;
    let { limit, page } = req.query; 
    // Get limit and skip values from query parameters

    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    const offset = limit * (page - 1);
     
    // const objectId = new ObjectId(currentUserId);
    const notifications = await Notification.find({ "to": currentUserId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate({
        path: "donationId",
        populate: {
          path: "projectId",
          model: "projects",
        },
      });
    const count = await Notification.countDocuments({ "to": currentUserId });
    console.log("count", count)
    const totalPage = Math.ceil(count / limit);
    console.log("totalPage", totalPage)

    if (!notifications) {
      throw new AppError(
        400,
        "Notifications not found",
        "Get notification error"
      );
    }

    return sendResponse(
      res,
      200,
      true,
      { notifications, totalPage },
      null,
      "Get notification successful"
    );
  }
);

notificationController.updateNotifications = catchAsync(
  async (req, res, next) => {
    const currentUserId = req.userId;

    const updatedNotifications = await Notification.updateMany(
      {
        to: currentUserId,
        read: false,
      },
      {
        read: true,
      }
    );

    if (!updatedNotifications) {
      throw new AppError(
        400,
        "Failed to update notifications",
        "Update notification error"
      );
    }

    return sendResponse(
      res,
      200,
      true,
      {},
      null,
      "Update notification successful"
    );
  }
);

notificationController.getNewNotifications = catchAsync(
  async (req, res, next) => {
    const currentUserId = req.userId;

    const newNotifications = await Notification.find({
      to: currentUserId,
      read: false,
    });
    const count = newNotifications.length;

    return sendResponse(
      res,
      200,
      true,
      { count, newNotifications },
      null,
      "Get new notifications success"
    );
  }
);

module.exports = notificationController;

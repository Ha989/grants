const Notification = require("../models/Notification");
const User = require("../models/User");
const Creator = require("../models/Creator");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const nodemon = require("nodemon");

const notificationController = {};

// get all notifications

notificationController.getAllNotifications = catchAsync(
  async (req, res, next) => {
    const currentUserId = req.userId;
    const { limit, skip } = req.query; // Get limit and skip values from query parameters

    // Convert limit and skip values to numbers
    const limitValue = parseInt(limit, 10);
    const skipValue = parseInt(skip, 10);

    const notifications = await Notification.find({ to: currentUserId })
      .sort({ createdAt: -1 })
      .skip(skipValue)
      .limit(limitValue)
      .populate({
        path: "donationId",
        populate: {
          path: "projectId",
          model: "projects",
        },
      });

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
      { notifications },
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

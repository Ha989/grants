const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const User = require("../models/User");
// const Creator = require("../models/Creator");

const notificationSchema = Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      refPath: "senderModal",
      require: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      refPath: "recipientModel",
      require: true,
    },
    senderModal: {
      type: String,
      enum: ["users", "creators"],
      require: true,
    },
    recipientModel: {
      type: String,
      enum: ["users", "creators"],
      require: true,
    },
    type: {
      type: String,
      enum: ["bookmark", "donation", "comment"],
      require: true,
    },
    message: {
      type: String,
      require: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    donationId: {
      type: Schema.Types.ObjectId,
      ref: "donations",
      default: null,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "comments",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamp: true,
  }
);

const Notification = mongoose.model("notifications", notificationSchema);

module.exports = Notification;

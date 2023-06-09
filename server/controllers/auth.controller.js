const mongoose = require("mongoose");
const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const Creator = require("../models/Creator");
const emailVerification = require("../middlewares/emailVerification");

const authController = {};

authController.register = catchAsync(async (req, res, next) => {
  let url;
  let { name, email, password, role } = req.body;

  let user = await User.findOne({ email, isDeleted: false });
  console.log("user", user);
  let creator = await Creator.findOne({ email, isDeleted: false });

  if (user || creator)
    throw new AppError(400, "User already exists", "Registration Error");

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  if (role === "user") {
    user = await User.create({ name, email, password, role });

    const code = crypto.randomBytes(32).toString("hex"),
      url = `${process.env.BASE_URL}/auth/${user._id}/verify/${code}`;
    console.log("url", url);
    console.log("email", emailVerification);

    await emailVerification.sendVerificationEmail(
      user.email,
      "Verify Your Email",
      url
    );
  }

  if (role === "creator") {
    user = await Creator.create({ name, email, password, role });
    const code = crypto.randomBytes(32).toString("hex");

    url = `${process.env.BASE_URL}/auth/${user._id}/verify/${code}`;

    await emailVerification.sendVerificationEmail(
      user.email,
      "Verify Your Email",
      url
    );
  }
  await sendResponse(
    res,
    200,
    true,
    { url },
    null,
    "Verification link has sent to your email"
  );
});

authController.verifyEmail = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.find({ _id: userId }, { isDeleted: false });
  const creator = await Creator.find({ _id: userId }, { isDeleted: false });

  if (!user && !creator) throw new AppError(400, "Invalid user");

  if (user) {
    await User.updateOne({ _id: userId }, { isVerified: true });
  }

  if (creator) {
    await Creator.updateOne({ _id: userId }, { isVerified: true });
  }

  sendResponse(
    res,
    200,
    true,
    { user, creator },
    null,
    "Email verified successfully"
  );
});

authController.loginwithEmail = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, "+password");
  const creator = await Creator.findOne({ email }, "+password");

  if (!user && !creator) throw new AppError(400, "Invalid User", "Login Error");

  let isMatch;
  let accessToken;

  if (creator) {
    isMatch = await bcrypt.compare(password, creator.password);
    if (!isMatch) {
      throw new AppError(400, "Wrong password", "Login Error");
    }

    if (!creator.isVerified) {
      throw new AppError(
        400,
        "Email not verified. Check your email to verify",
        "Login Error"
      );
    }

    accessToken = await creator.generateToken();
  }

  if (user) {
    isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(400, "Wrong password", "Login Error");
    }

    if (!user.isVerified) {
      throw new AppError(
        400,
        "Email not verified. Check your email to verify",
        "Login Error"
      );
    }

    accessToken = await user.generateToken();
  }

  return sendResponse(
    res,
    200,
    true,
    { user, creator, accessToken },
    null,
    "Login successful"
  );
});

authController.getCurrentUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const creator = await Creator.findById(currentUserId);
  const user = await User.findById(currentUserId);
  if (!user && !creator) throw new AppError(400, "Not found");
  return sendResponse(res, 200, true, { creator, user }, null, "success");
});

module.exports = authController;

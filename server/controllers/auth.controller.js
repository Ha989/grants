const mongoose = require("mongoose");
const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const Creator = require("../models/Creator");
const Verify = require("../models/Verify");
const emailVerification = require("../middlewares/emailVerification");
const { send } = require("process");

const authController = {};

authController.register = catchAsync(async (req, res, next) => {
  let verified;
  let url;
  let { name, email, password, role } = req.body;

  let user = await User.findOne({ email, isDeleted: false });
  let creator = await Creator.findOne({ email, isDeleted: false });

  if (user || creator)
    throw new AppError(400, "User already exists", "Registration Error");

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  if (role === "user") {
    user = await User.create({ name, email, password, role });

    verified = await Verify.create({
      code: crypto.randomBytes(32).toString("hex"),
      userId: user._id,
    });
    url = `${process.env.BASE_URL}/auth/${verified.userId}/verify/${verified.code}`;

    await emailVerification.sendVerificationEmail(
      user.email,
      "Verify Your Email",
      url
    );
  }

  if (role === "creator") {
    user = await Creator.create({ name, email, password, role });

    verified = await Verify.create({
      code: crypto.randomBytes(32).toString("hex"),
      creatorId: user._id,
    });
    url = `${process.env.BASE_URL}/auth/${verified.userId}/verify/${verified.code}`;

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
    { url, verified },
    null,
    "Verification link has sent to your email"
  );

  await sendResponse(res, 200, true, { user }, null, "Register Successfully");
});



authController.verifyEmail = catchAsync(async (req, res, next) => {
  const verified = req.params.code;
  const userId = req.params.id;

  const user = await User.find({ _id: userId }, { isDeleted: false });
  const creator = await Creator.find({ _id: userId }, { isDeleted: false });

  if (!user && !creator) throw new AppError(400, "Invalid user");

  const verifiedcode = await Verify.find({ code: verified });

  if (!verifiedcode) throw new AppError(400, "Invalid verification link");

  if ( Date.now() > verifiedcode.expiryTime) {
    throw new AppError(410, "Verification link has expired")
  }

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
    { verifiedcode },
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
    accessToken = await creator.generateToken();
  }

  if (user) {
    isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(400, "Wrong password", "Login Error");
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
   console.log("creator",creator);
   const user = await User.findById(currentUserId);
   console.log("user", user);
   if (!user && !creator) throw new AppError(400, "Not found");
   return sendResponse(res, 200, true, { creator, user }, null, "success");
    
  //  if (currentUserId.role === 'creator') {
  //   const creator = await Creator.findById(currentUserId);
  //   console.log('creator', creator);
  //   if (!creator) throw new AppError(400, "Creator not found");
  //   return sendResponse(res, 200, true, { creator }, null, 'get creator success')
  // };
  // if (currentUserId.role === 'user') {
  //   let user  = await User.findById(currentUserId);
  //   console.log('user', user)
  //   if (!user) throw new AppError(400, 'user not found');
  //   return sendResponse(res, 200, true, { user }, null, 'get creator success')
  // };
  
});

module.exports = authController;

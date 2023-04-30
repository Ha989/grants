const User = require("../models/User");
const Verify = require("../models/Verify");
const emailVerification = require("../middlewares/emailVerification");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

const userController = {};

// create user
// userController.register = catchAsync(async (req, res, next) => {
//     //get data from request;
//     let { name, email, password, role } = req.body;
    
//     let user = await User.findOne({ email, isDeleted: false }) 
//     if (user) {
//         throw new AppError(400, "User already exists", "Registration Error");
//     }
    
//     // password encryption
//     const salt = await bcrypt.genSalt(10);
//     password = await bcrypt.hash(password, salt);
//     user = await User.create({ name, email, password, role});
//     const accessToken = await user.generateToken;
    
    // const verify = await Verify.create({
    //     code: crypto.randomBytes(32).toString('hex'),
    //     userId: user._id
    // });

    // const url = `${process.env.BASE_URL}user/${user._id}/verify/${verify.code}`;

    // await emailVerification.sendVerificationEmail(user.email, "Verify Your Email", url);

    // await sendResponse (res, 200, true, { url, verify }, null, "Verification link has sent to your email");

//     sendResponse(res, 200, true, { user, accessToken }, null, "Create user successful")
// });

// userController.verifyEmail = catchAsync(async (req, res, next) => {
//         const  verify = req.params.verifyCode;

//         const  userId = req.params.id;
      

//         const user = await User.find({_id: userId}, {"isDeleted": false});
   
        
//         if (!user) throw new AppError(400, "Invalid user");
        
//         const verifycode = await Verify.find({ code: verify });

//         if (!verifycode) throw new AppError(400, "Invalid verification link");
        
//         await User.updateOne({ _id: userId },  {"isVerified": true });
        
//         sendResponse(res, 200, true, { user, verifycode }, null, "Email verified successfully")
  
// })

module.exports = userController;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


const userSchema = Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: 'user',
        require: true
    },
    avatarUrl: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: ""
    },
    bookmarked: [{
        type: Schema.Types.ObjectId,
        ref: "projects",
        default: null
    }],
    donations: [{
        type: Schema.Types.ObjectId,
        ref: "donation",
        default: null
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
{ 
    timeStamp: true
})

userSchema.methods.toJSON = function () {
    const user = this._doc;
    delete user.password;
    delete user.isDeleted;
    return user;
  };

  userSchema.methods.generateToken = async function () {
    const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    return accessToken;
  };

const User = mongoose.model("users", userSchema);

module.exports = User;
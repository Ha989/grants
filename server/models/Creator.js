const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const creatorSchema = Schema({
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
        default: 'creator',
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
    projects: [{
        type: Schema.Types.ObjectId,
        ref: "projects",
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
});

creatorSchema.methods.toJSON = function () {
    const creator = this._doc;
    delete creator.password;
    delete creator.isDeleted;
    return creator;
  };
  
  creatorSchema.methods.generateToken = async function () {
    try {
        const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
          expiresIn: "1d",
        });
        return accessToken;
      } catch (error) {
        // Handle the error appropriately (e.g., log, throw, or return an error response)
        console.error("Error generating token:", error);
        throw error;
      }
  };

const Creator = mongoose.model("creators", creatorSchema);
module.exports = Creator;
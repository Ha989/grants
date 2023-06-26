const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = Schema({
    name: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    logo: {
        type: String,
        default: null
    },
    description: {
        type: String,
        require: true
    },
    banner: {
        type: String,
        default: null
    },
    video: {
        type: String,
        default: null
    },
    team: {
        type: [],
        default: null
    },
    website: {
        type: String,
        require: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "creators",
        require: true
    },
    clientID: {
        type: String,
        default: null
    },
    currentRaised: {
        type: Number,
        default: 0
    },
    investor: {
        type: [String],
        default: null
    },
    donations: [{
        type: Schema.Types.ObjectId,
        ref: "donations",
        default: null
    }],
    totalDonations: {
        type: Number,
        default: 0
    },
    userBookmarked: [{
        type: Schema.Types.ObjectId,
        ref: "users"
    }],
    totalBookmarks: {
        type: Number,
        default: 0
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "comments",
        default: null
    }],
    commentCount: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
},
{
    timeStamp: true
})

const Project = mongoose.model("projects", projectSchema);
module.exports = Project;
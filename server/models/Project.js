const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = Schema({
    name: {
        type: String,
        require: true
    },
    logo: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    banner: {
        type: String,
        require: true
    },
    team: {
        type: [],
        default: null
    },
    socialLink: [
        {
            platform: String,
            link: String
        }
    ],
    creator: {
        type: Schema.Types.ObjectId,
        ref: "creators",
        require: true
    },
    bankDetail: {
        type: String,
        require: true
    },
    donationIds: {
        type: Schema.Types.ObjectId,
        ref: "donations",
        default: null
    },
    userBookmarked: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: "comments",
        default: null
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },   
},
{
    timeStamp: true
})

const Project = mongoose.model("projects", projectSchema);
module.exports = Project;
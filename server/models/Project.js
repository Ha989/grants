const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = Schema({
    name: {
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
    bankDetail: {
        type: String,
        default: null
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
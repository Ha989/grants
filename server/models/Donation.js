const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const donationSchema = Schema({
    amount: {
        type: Number,
        require: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        require: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "projects",
        require: true
    },
    isConfirm: {
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
});

const Donation = mongoose.model("donations", donationSchema);
module.exports = Donation; 
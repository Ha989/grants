const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const notificationSchema =  Schema({
    from: {
        type: Schema.Types.ObjectId,
        refPath: 'senderModal',
        require: true
    },
    to: {
        type: Schema.Types.ObjectId,
        refPath: 'recipientModel',
        require: true
    },
    senderModal: {
        type: String,
        enum: ["users", "projects"]
    },
    recipientModel: {
        type: String,
        enum: ["users", "projects"]
    },
    type: {
        type: String,
        enum: ['bookmark', 'donation', 'comment'],
        require: true
    },
    message: {
        type: String,
        require: true
    },
    read: { 
        type: Boolean, 
        default: false 
    },
    donationId: {
        type: Schema.Types.ObjectId,
        ref: "donations",
        default: null
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "comments",
        default: null
    }
}, 
{
    timestamp: true
});

const Notification = mongoose.model("notifications", notificationSchema);

module.exports = Notification;
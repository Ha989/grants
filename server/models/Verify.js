const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verifySchema = Schema({
    code: {
        type: String,
        required: true,
    },
    expiryTime: {
        type: Date,
        default: Date.now(),
        expire: 3600
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: "creators"
    }
},
{
    timeStamp: true
})



const Verify = mongoose.model("verifies", verifySchema);

module.exports = Verify;
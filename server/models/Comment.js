const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = Schema({
  content: {
    type: String,
    require: true
  },
  image: {
    type: String,
    default: ""
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    require: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'projects',
    require: true
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'comments'
  }],
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'comments',
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
},
{
    timeStamp: true
});


const Comment = mongoose.model("comments", commentSchema);
module.exports = Comment
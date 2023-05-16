const Comment = require("../models/Comment");
const Project = require("../models/Project");
const notification = require("../models/Notification");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Notification = require("../models/Notification");

const commentController = {};

const calculateCommentCount = async (projectId) => {
  const commentCount = await Comment.countDocuments({
    project: projectId,
    isDeleted: false,
  });
  await Project.findByIdAndUpdate(projectId, { commentCount });
};
// comment on project

commentController.createComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;

  const { projectId, content, image, parentId } = req.body;

  let project = await Project.findById(projectId);
  if (!project)
    throw new AppError(400, "Project not found", "Create comment error");

  let comment = await Comment.create({
    content,
    image,
    author: currentUserId,
    project: projectId,
    parentComment: parentId || null,
  });

  // if there is a parent comment so add new comment as the reply
  if (parentId) {
    parentCom = await Comment.findById(parentId);
    if (!parentCom) throw new AppError(400, "Parent comment not found");

    parentCom.replies.push(comment._id);
    await parentCom.save();
  }

  // add to project
  project = await Project.findByIdAndUpdate(
    projectId,
    { $push: { comments: comment } },
    { new: true }
  );
 
  const notification = await Notification.create({
      from: currentUserId,
      to: projectId,
      type: 'comment',
      message: `${currentUserId.name} mentioned you in a comment`
  });

  await calculateCommentCount(projectId);
  return sendResponse(
    res,
    200,
    true,
    { comment, project, notification },
    null,
    "Create comment successful"
  );
});

// edit comment

commentController.updateSingleComment = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const commentId = req.params.commentId;
  const { content, image } = req.body;

  const comment = await Comment.findByIdAndUpdate(
    {
      _id: commentId,
      author: userId,
    },
    { content, image },
    { new: true }
  );

  if (!comment)
    throw new AppError(
      400,
      "Comment not found or user not authorized",
      "Update comment error"
    );

  return sendResponse(res, 200, true, comment, null, "Update successful");
});



// delete comment

commentController.deleteComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;

  const { projectId } = req.body;
  const commentId = req.params.commentId;

  let comment = await Comment.findById(commentId);
  if (!comment)
    throw new AppError(400, "Comment not found", "Delete comment error");

  if (comment.author.toString() !== currentUserId) {
    throw new AppError(403, "You are not authorized to perform this action");
  }

  comment = await Comment.findByIdAndDelete(
    { _id: commentId }
  );

  const project = await Project.findByIdAndUpdate(
    projectId,
    { $pull: { comments: commentId } },
    { new: true }
  );

  await calculateCommentCount(comment.project);

  return sendResponse(res, 200, true, { comment, project }, null, "Delete successful");
});

module.exports = commentController;

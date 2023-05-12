const Comment = require("../models/Comment");
const Project = require("../models/Project");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");

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
  console.log("user", currentUserId);
  const { projectId, content, image, parentId } = req.body;

  let project = await Project.findById(projectId);
  if (!project)
    throw new AppError(400, "Project not found", "Create comment error");

  let comment = await Comment.create({
    content,
    image,
    author: currentUserId,
    project: projectId,
    parentId: parentId || null,
  });
  let parentComment;

  // if there is a parent comment so add new comment as the reply
  if (parentId) {
    parentComment = await Comment.findById(parentId);
    if (!parentComment) throw new AppError(400, "Parent comment not found");

    parentComment.replies.push(comment._id);
    await parentComment.save();
  }

  // add to project
  project = await Project.findByIdAndUpdate(
    projectId,
    { $push: { comments: comment } },
    { new: true }
  );

  await calculateCommentCount(projectId);
  return sendResponse(
    res,
    200,
    true,
    { comment, project },
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

  comment = await Comment.findOneAndUpdate(
    { _id: commentId },
    {
      isDeleted: true,
    }
  );

  const project = await Project.findByIdAndUpdate(
    projectId,
    { $pull: { comments: commentId } },
    { new: true }
  );

  await calculateCommentCount(comment.project);

  return sendResponse(
    res,
    200,
    true,
    { comment, project },
    null,
    "Delete successful"
  );
});

module.exports = commentController;

const { sendResponse } = require("../helpers/utils.js");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const validators = {};

validators.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const message = errors
    .array()
    .map((error) => error.msg)
    .join(" & ");

  return sendResponse(res, 422, false, null, { message }, "Validation Error");
};

validators.checkObjectId = (paramId) => {
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new Error("Invalid ObjectId");
  }
  return true;
};

// check role of user or admin or creator
validators.checkRole = (role) => {
    if (req.user && req.user.role === role ) {
       return next(); // authorized
    } else {
       return sendResponse(res, 403, false, null, { message }, "Forbidden"); // unauthorized
    }
}

module.exports = validators;
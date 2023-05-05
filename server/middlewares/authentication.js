const jwt = require('jsonwebtoken');
const express = require('express');
const { sendResponse, AppError } = require("../helpers/utils.js");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authentication = {};

authentication.loginRequired = (req, res, next) => {

    try {

    const tokenString = req.headers.authorization;
    if (!tokenString) throw new AppError(401, "Login Required", "Authentication Error");
    
    const token = tokenString.replace("Bearer ", "");

    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            throw new AppError("401", "Token Expired", "Authentication Error");
          } else {
            throw new AppError("401", "Token is invalid", "Authentication Error");
          }
        }
        req.userId = payload._id;

      });
  
      next();
    // check is user in our data.
    // when user login successfully backend will create a token in header of res. in the token will have all data of user. 
    // user dont need to login again, when make req to backend, backend can check token is correct so it is correct user.
    // token can be revoke. Delete token.   
    // expire time for token. 
      
    // Check if user role matches the required role for the route
    //user
    //creator
    //admin
    
} catch (error) {
    next(error)
}
};

module.exports = authentication;
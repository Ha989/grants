const jwt = require('jsonwebtoken');
const express = require('express');
const { sendResponse, AppError } = require("../helpers/utils.js");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authentication = {};

authentication.loginRequired = (req, res, next) => {

    try {

    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AppError(401, "Login Required", "Authentication Error");
    
    const token = authHeader.replace("Bearer", "");
    // check is user in our data.
    // when user login successfully backend will create a token in header of res. in the token will have all data of user. 
    // user dont need to login again, when make req to backend, backend can check token is correct so it is correct user.
    // token can be revoke. Delete token.   
    // expire time for token. 
    const  decodedToken = jwt.verify(token, JWT_SECRET_KEY); 
    if (error) throw new AppError(401, "Unauthorized");
      
    // Check if user role matches the required role for the route
    //user
    //creator
    //admin
    if (req.route.role !== decodedToken.role) {
        throw new AppError(403, "Forbidden");
    }
    
    req.user = decodedToken;
    next()
} catch (error) {
    next(error)
}
};

module.exports = authentication;
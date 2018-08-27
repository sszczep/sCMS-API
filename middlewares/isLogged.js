'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config.js');
const CustomError = require('../utils/CustomError.js');

module.exports = async(req, res, next) => {
  const header = req.get('Authorization');

  if(!header) {
    return next(new CustomError('NoAuthorizationHeader', 'No authorization header specified', 400));
  }

  const token = header.split(' ')[1];

  if(!token) {
    return next(new CustomError('NoToken', 'No token specified', 400));
  }

  try {
    const decoded = await jwt.verify(token, config.jwtSecret);

    if(decoded && decoded._id) {
      req.userID = decoded._id;

      return next();
    }

    return next(new CustomError('Unauthorized', 'Given token is invalid', 401));
  } catch(err) {
    return next(err);
  }
};

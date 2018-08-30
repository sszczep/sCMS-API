'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config.js');
const CustomError = require('../utils/CustomError.js');

/**
 * @apiDefine AuthorizationHeader
 * @apiHeader {String} Authorization Authorization header
 * @apiHeaderExample {json} Authorization example:
 *  {
 *    "Authorization": "Bearer <jwt token here>"
 *  }
 */

const checkAuthorizationHeaderAndReturnToken = header => {
  if(!header) {
    throw new CustomError('NoAuthorizationHeader', 'No authorization header specified', 400);
  }

  const token = header.split(' ')[1];

  if(!token) {
    throw new CustomError('NoToken', 'No token specified', 400);
  }

  return token;
};

module.exports = async(req, res, next) => {
  const header = req.get('Authorization');

  try {
    const token = checkAuthorizationHeaderAndReturnToken(header);
    const decoded = await jwt.verify(token, config.jwtSecret);

    if(!decoded && !decoded._id) {
      return next(new CustomError('Unauthorized', 'Given token is invalid', 401));
    }

    req.userID = decoded._id;

    return next();
  } catch(err) {
    return next(err);
  }
};

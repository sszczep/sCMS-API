'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config.js');
const CustomError = require('../utils/CustomError.js');

module.exports = async(req, res, next) => {
  const header = req.get('Authorization');
  const token = header.split(' ')[1];

  try {
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

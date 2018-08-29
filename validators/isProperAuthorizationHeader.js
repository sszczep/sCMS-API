'use strict';

const CustomError = require('../utils/CustomError.js');

module.exports = header => {
  if(!header) {
    throw new CustomError('NoAuthorizationHeader', 'No authorization header specified', 400);
  }

  const token = header.split(' ')[1];

  if(!token) {
    throw new CustomError('NoToken', 'No token specified', 400);
  }
};

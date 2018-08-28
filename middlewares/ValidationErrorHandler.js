'use strict';

const { validationResult } = require('express-validator/check');
const CustomError = require('../utils/CustomError.js');

// construct validation error handler
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  const errorsToReturn = [];

  if(!errors.isEmpty()) {
    for(const error of errors.array()) {
      errorsToReturn.push(new CustomError('ValidationError', `${error.param}: ${error.msg}`, 400));
    }

    return next(errorsToReturn);
  }

  return next();
};

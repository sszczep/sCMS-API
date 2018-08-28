'use strict';

/**
 * @apiDefine ErrorObject
 *
 * @apiError (Error 4xx/5xx) {Object[]} errors Array of errors
 * @apiError (Error 4xx/5xx) {String} errors.name Error name
 * @apiError (Error 4xx/5xx) {String} errors.message Error detailed message
 */

module.exports = (errors, req, res, next) => { // eslint-disable-line no-unused-vars
  const getStatusCode = error => {
    if(!error.status) {
      switch(error.name) { // eslint-disable-line padded-blocks

        // mongoose's schema validation errors
        case 'ValidationError':
          return 400;

        // mongoose's internal errors
        case 'MongoError':
          if(error.code === 11000) {
            return 409;
          }

          return 500;

        // other errors
        default:
          return 500;
      }
    } else {
      return error.status;
    }
  };

  // check if error object is an array or a single error
  if(Array.isArray(errors)) {
    // if all errors have the same status code - return it, if not then use 400 as default
    let statusCode;
    let return400 = false;
    const errorsToReturn = [];

    for(const error of errors) {
      // get error status code
      const status = getStatusCode(error);

      // if return400StatusCode === false and there is no statusCode yet then set it
      // if the statusCode is different than error.status, set flag return400 to true
      if(!return400 && !statusCode) {
        statusCode = status;
      } else if(statusCode !== status) {
        return400 = true;
      }

      // push error to array
      errorsToReturn.push({
        name: error.name,
        message: error.message
      });
    }

    // send response
    res
      .status(return400 ? 400 : statusCode)
      .json({
        errors: errorsToReturn
      });
  } else {
    const error = errors;

    // send response
    res
      .status(getStatusCode(error))
      .json({
        errors: [
          {
            name: error.name,
            message: error.message
          }
        ]
      });
  }
};

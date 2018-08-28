'use strict';

/**
 * @apiDefine ErrorObject
 *
 * @apiError (Error 4xx/5xx) {Object[]} errors Array of errors
 * @apiError (Error 4xx/5xx) {String} errors.name Error name
 * @apiError (Error 4xx/5xx) {String} errors.message Error detailed message
 */

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

module.exports = (errors, req, res, next) => { // eslint-disable-line no-unused-vars
  // Force errors to be an array for further processing:
  if(!Array.isArray(errors)) {
    errors = [ errors ];
  }

  const formatedErrors = [];

  // If all errors have the same status code - return it, 400 otherwise
  const statusCode = errors.reduce((a, b) =>
    getStatusCode(a) === getStatusCode(b) ? getStatusCode(a) : 400
  );

  for(const error of errors) {
    formatedErrors.push({
      name: error.name,
      message: error.message
    });
  }

  res
    .status(statusCode)
    .json({ errors: formatedErrors });
};

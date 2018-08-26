'use strict';

module.exports = class CustomError extends Error {
  constructor(name = 'Error', message = 'Error', code = 500) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    this.name = name;
    this.status = code;
  }
};

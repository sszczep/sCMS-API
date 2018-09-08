'use strict';

const UserController = require('../controllers/users.js');
const CustomError = require('../utils/CustomError.js');

module.exports = permissions => (req, res, next) => {
  if(UserController.hasPermissions(req.user.permissions, permissions)) {
    return next();
  }

  return next(new CustomError('NoPermission', 'You do not have permission to do that', 403));
};

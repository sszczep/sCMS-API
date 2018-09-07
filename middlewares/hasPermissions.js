'use strict';

const CustomError = require('../utils/CustomError.js');

module.exports = permissions => (req, res, next) => {
  const userPermissions = req.user.permissions;

  if(userPermissions.includes('*')) {
    return next();
  }

  for(const permission of permissions) {
    if(!userPermissions.includes(permission)) {
      return next(new CustomError('NoPermission', 'You do not have permission to do that', 403));
    }
  }

  return next();
};

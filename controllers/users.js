'use strict';

const UserModel = require('../models/users.js');

const getUser = async data =>
  await UserModel
    .findOne(data)
    .select(`-__v`)
    .lean()
    .exec();

const registerUser = async data => {
  const response = await UserModel
    .create(data);

  response.__v = undefined; // eslint-disable-line no-underscore-dangle

  return response;
};

const hasPermissions = (userPermissions, permissions) => {
  if(userPermissions.includes('*')) {
    return true;
  }

  for(const permission of permissions) {
    if(!userPermissions.includes(permission)) {
      return false;
    }
  }

  return true;
};

module.exports = {
  getUser,
  registerUser,
  hasPermissions
};

'use strict';

const { Types: { ObjectId: { isValid: isValidID }}} = require('mongoose');
const UserModel = require('../models/users.js');
const AuthController = require('./auth.js');

const getUser = async data =>
  await UserModel
    .findOne(data)
    .select(`-__v`)
    .lean()
    .exec();

const getUserByPhrase = async phrase =>
  await UserModel
    .findOne({ $or: [
      { username: phrase },
      { _id: isValidID(phrase) ? phrase : undefined }
    ]})
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

const canAccessSensitiveInfo = async(req, user) => {
  // get header with Token
  const header = req.get('Authorization');

  try {
    const token = await AuthController.checkAuthorizationHeaderAndReturnToken(header);
    const decoded = await AuthController.decodeToken(token);

    // if token belongs to user making request or user has permission to access others sensitive details
    if(decoded._id.toString() === user._id.toString() || hasPermissions(decoded.permissions, [ 'detailedInfoAboutOtherUsers' ])) {
      return true;
    }
  } catch(err) {
    return false;
  }
};

module.exports = {
  getUser,
  getUserByPhrase,
  registerUser,
  hasPermissions,
  canAccessSensitiveInfo
};

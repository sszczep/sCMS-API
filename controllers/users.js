'use strict';

const UserModel = require('../models/users.js');
const AuthController = require('./auth.js');
const filterObject = require('../utils/filterObject.js');

const findContaining = async data =>
  await UserModel
    .find({ username: { $regex: data.phrase, $options: 'i' }})
    .select(data.select || '')
    .setOptions(data.options || {})
    .populate(data.populate || [])
    .exec();

const getUser = async data =>
  await UserModel
    .findOne(data.conditions)
    .select(data.select || '')
    .setOptions(data.options || {})
    .populate(data.populate || [])
    .exec();

const registerUser = async data => {
  const user = await UserModel
    .create(data.toCreate);

  return {
    ...user.generateJWT(),
    user: filterObject(user, data.select)
  };
};

const addPost = async(userID, postID) => {
  await UserModel
    .findByIdAndUpdate(userID, {
      $push: { posts: postID }
    })
    .exec();
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
  try {
    const token = await AuthController.checkAuthorizationHeaderAndReturnToken(req);
    const decoded = await AuthController.decodeToken(token);

    // if token belongs to user making request or user has permission to access others sensitive details
    if(decoded.username.toString() === user.username.toString() || hasPermissions(decoded.permissions, [ 'detailedInfoAboutOtherUsers' ])) {
      return true;
    }
  } catch(err) {
    return false;
  }
};

module.exports = {
  findContaining,
  getUser,
  registerUser,
  addPost,
  hasPermissions,
  canAccessSensitiveInfo
};

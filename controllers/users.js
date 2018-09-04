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

module.exports = {
  getUser,
  registerUser
};

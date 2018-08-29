'use strict';

const UserModel = require('../models/users.js');

const getUser = async data =>
  await UserModel
    .findOne(data)
    .select(`-__v -password`)
    .lean()
    .exec();

const registerUser = async data =>
  await UserModel
    .create(data);

module.exports = {
  getUser,
  registerUser
};

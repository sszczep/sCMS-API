'use strict';

const UsersModel = require('../models/users.js');

const getUser = async _id =>
  await UsersModel
    .findOne({ _id })
    .select(`-__v -password`)
    .lean()
    .exec();

const registerUser = async data =>
  await UsersModel
    .create(data);

module.exports = {
  getUser,
  registerUser
};

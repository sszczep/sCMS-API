'use strict';

const UserModel = require('../models/users.js');
const CustomError = require('../utils/CustomError.js');

const validateCredentialsAndReturnJWT = async(email, password) => {
  try {
    const user = await UserModel.findOne({ email }).exec();

    if(!user || !await user.validatePassword(password)) {
      throw new CustomError('BadCredentials', 'Invalid email/password', 403);
    }

    return user.generateJWT();
  } catch(err) {
    throw err;
  }
};

module.exports = {
  validateCredentialsAndReturnJWT
};

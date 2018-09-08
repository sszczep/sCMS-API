'use strict';

const UserModel = require('../models/users.js');
const CustomError = require('../utils/CustomError.js');

const validateCredentialsAndReturnData = async(login, password) => {
  try {
    const user = await UserModel.findOne({ $or: [
      { email: { $regex: new RegExp(`^${login}$`), $options: 'i' }},
      { username: { $regex: new RegExp(`^${login}$`), $options: 'i' }}
    ]}).exec();

    if(!user || !await user.validatePassword(password)) {
      throw new CustomError('BadCredentials', 'Could not login - invalid credentials', 403);
    }

    return {
      ...user.generateJWT(),
      user
    };
  } catch(err) {
    throw err;
  }
};

module.exports = {
  validateCredentialsAndReturnData
};

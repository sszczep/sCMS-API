'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config.js');
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

const checkAuthorizationHeaderAndReturnToken = header => {
  if(!header) {
    throw new CustomError('NoAuthorizationHeader', 'No authorization header specified', 400);
  }

  const token = header.split(' ')[1];

  if(!token) {
    throw new CustomError('NoToken', 'No token specified', 400);
  }

  return token;
};

const decodeToken = async token => {
  const decoded = await jwt.verify(token, config.jwtSecret);

  if(!decoded && !decoded._id) {
    throw new CustomError('Unauthorized', 'Given token is invalid', 401);
  }

  return decoded;
};

module.exports = {
  validateCredentialsAndReturnData,
  checkAuthorizationHeaderAndReturnToken,
  decodeToken
};

'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config.js');
const UserModel = require('../models/users.js');
const CustomError = require('../utils/CustomError.js');

const refreshToken = async token => {
  try {
    const user = await UserModel.findOne({ refreshToken: token }).exec();

    if(!user) {
      throw new CustomError('InvalidRefreshToken', 'Given refresh token is not valid', 406);
    }

    return await user.refreshJWTToken();
  } catch(err) {
    throw err;
  }
};

const validateCredentialsAndReturnTokens = async data => {
  try {
    const user = await UserModel.findOne({ $or: [
      { email: { $regex: new RegExp(`^${data.credentials.login}$`), $options: 'i' }},
      { username: { $regex: new RegExp(`^${data.credentials.login}$`), $options: 'i' }}
    ]}).exec();

    if(!user || !await user.validatePassword(data.credentials.password)) {
      throw new CustomError('BadCredentials', 'Could not login - invalid credentials', 403);
    }

    return await user.generateJWTTokens();
  } catch(err) {
    throw err;
  }
};

const checkAuthorizationHeaderAndReturnToken = req => {
  const header = req.get('Authorization');

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

  if(!decoded) {
    throw new CustomError('Unauthorized', 'Given token is invalid', 401);
  }

  return decoded;
};

module.exports = {
  refreshToken,
  validateCredentialsAndReturnTokens,
  checkAuthorizationHeaderAndReturnToken,
  decodeToken
};

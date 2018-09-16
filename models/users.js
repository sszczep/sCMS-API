'use strict';

const mongoose = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config.js');
const CustomError = require('../utils/CustomError.js');

const User = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  permissions: {
    type: Array,
    default: []
  },
  refreshTokens: [ String ]
});

User.set('toObject', {
  transform(doc, ret) {
    delete ret.__v; // eslint-disable-line
  }
});

User.pre('save', async function(next) {
  if(this.isModified('password') || this.isNew) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch(err) {
      return next(err);
    }
  }

  return next();
});

User.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const generateAccessToken = that => {
  // expiration date set to 10 minutes
  const tokenExp = Math.floor(Date.now() / 1000) + (10 * 60);

  const token = jwt.sign({
    exp: tokenExp,
    _id: that._id,
    username: that.username,
    permissions: that.permissions
  }, config.jwtSecret);

  return { token, expiration: tokenExp * 1000 };
};

User.methods.refreshJWTToken = async function(refreshToken) {
  try {
    jwt.verify(refreshToken, config.jwtRefreshSecret);
  } catch(err) {
    const index = this.refreshTokens.indexOf(refreshToken);

    this.refreshTokens.splice(index, 1);
    await this.save();

    throw new CustomError('InvalidToken', 'Token invalid or expired!', 401);
  }

  const token = generateAccessToken(this);

  return token;
};

User.methods.generateJWTTokens = async function() {
  const token = generateAccessToken(this);

  const refreshToken = jwt.sign({
    _id: this._id
  }, config.jwtRefreshSecret, {
    expiresIn: '0.5y'
  });

  this.refreshTokens.push(refreshToken);

  // store refresh token in database
  await this.save();

  return { ...token, refreshToken };
};

module.exports = mongoose.model('User', User);

'use strict';

const mongoose = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config.js');

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
  refreshToken: String
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

User.methods.refreshJWTToken = function() {
  // expiration date set to 10 minutes
  const tokenExp = Math.floor(Date.now() / 1000) + (10 * 60);

  const token = jwt.sign({
    exp: tokenExp,
    _id: this._id,
    username: this.username,
    permissions: this.permissions
  }, config.jwtSecret);

  return { token, expiration: tokenExp * 1000 };
};

User.methods.generateJWTTokens = async function() {
  // expiration date set to 10 minutes
  const tokenExp = Math.floor(Date.now() / 1000) + (10 * 60);

  const token = jwt.sign({
    exp: tokenExp,
    _id: this._id,
    username: this.username,
    permissions: this.permissions
  }, config.jwtSecret);

  const refreshToken = jwt.sign({
    _id: this._id
  }, config.jwtRefreshSecret, {
    expiresIn: '0.5y'
  });

  this.refreshToken = refreshToken;

  // store refresh token in database
  await this.save();

  return { token, expiration: tokenExp * 1000, refreshToken };
};

module.exports = mongoose.model('User', User);

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
  permissions: {
    type: Array,
    default: []
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

User.methods.generateJWT = function() {
  return jwt.sign({
    _id: this._id,
    permissions: this.permissions
  }, config.jwtSecret, {
    expiresIn: 60 * 10
  });
};

module.exports = mongoose.model('User', User);

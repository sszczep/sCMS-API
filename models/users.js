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
  }
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

User.methods.generateJWT = function() {
  // expiration date set to 10 minutes
  const exp = Math.floor(Date.now() / 1000) + (10 * 60);

  const token = jwt.sign({
    exp,
    _id: this._id,
    username: this.username,
    permissions: this.permissions
  }, config.jwtSecret);

  return { token, expiration: exp * 1000 };
};

module.exports = mongoose.model('User', User);

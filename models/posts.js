'use strict';

const mongoose = require('../database');

const Post = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  }
});

Post.set('toObject', {
  transform(doc, ret) {
    delete ret.__v; // eslint-disable-line
  }
});

module.exports = mongoose.model('Post', Post);

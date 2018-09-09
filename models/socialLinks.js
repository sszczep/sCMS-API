'use strict';

const mongoose = require('../database');

const SocialLink = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

SocialLink.set('toObject', {
  transform(doc, ret) {
    delete ret.__v; // eslint-disable-line
  }
});

module.exports = mongoose.model('SocialLink', SocialLink);

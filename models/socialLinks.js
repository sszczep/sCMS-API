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

module.exports = mongoose.model('SocialLink', SocialLink);

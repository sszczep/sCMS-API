'use strict';

const mongoose = require('../database');

const Option = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: String,
    required: true
  }
});

Option.set('toObject', {
  transform(doc, ret) {
    delete ret.__v; // eslint-disable-line
  }
});

module.exports = mongoose.model('Option', Option);

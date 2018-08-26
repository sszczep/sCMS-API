'use strict';

const mongoose = require('mongoose');
const logger = require('../logger.js');
const { database: options } = require('../config.js');

mongoose.connect(`mongodb://${options.url}`, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
  logger.info('Mongoose successfully connected');
});

mongoose.connection.on('error', err => {
  throw err;
});

mongoose.connection.on('disconnected', () => {
  throw new Error('Mongoose disconnected! Check if your mongodb is running');
});

module.exports = mongoose;

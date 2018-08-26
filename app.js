'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const CustomError = require('./utils/CustomError.js');

const logger = require('./logger.js');

const { port } = require('./config.js');

app.use(morgan('dev', { stream: logger.stream }));

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors('*'));

// autoload routes

const fs = require('fs');
const path = require('path');
const routesPath = path.join(__dirname, 'routes');

fs.readdirSync(routesPath).forEach(file => { // eslint-disable-line no-sync
  app.use(`/${file.split('.')[0]}`, require(path.join(routesPath, file))); // eslint-disable-line global-require
});

// when route doesn't exist

app.use((req, res, next) => {
  next(new CustomError('NotFound', 'Page not found', 404));
});

// error handling

/**
 * @apiDefine ErrorObject
 *
 * @apiError (Error 4xx/5xx) {Object} error
 * @apiError (Error 4xx/5xx) {String} error.name Error name
 * @apiError (Error 4xx/5xx) {String} error.message Error detailed message
 */

app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
  if (!error.status) {
    switch (error.name) {
      case 'ValidationError':
        error.status = 400;
        break;
      case 'MongoError':
        if (error.code === 11000) {
          error.status = 409;
        }
        break;
      default:
        error.status = 500;
    }
  }

  res
    .status(error.status)
    .json({
      error: {
        name: error.name,
        message: error.message
      }
    });
});

// listen on given port

app.listen(port, () => {
  logger.info(`Server is up and running on port ${port}`);
});

// handle uncaught exceptions (log to transporters and then kill process)

process.on('uncaughtException', err => {
  logger.logAndExit('error', err.message, 1);
});

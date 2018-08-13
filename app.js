const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const CustomError = require('./utils/CustomError.js');

const logger = require('./logger.js');

app.use(morgan('dev', { stream: logger.stream }))

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors('*'));

/* ROUTES */

// autoload routes

const fs = require('fs')
const path = require('path')
const routesPath = path.join(__dirname, 'routes');

fs.readdirSync(routesPath).forEach(file => {
  app.use(`/${file.split('.')[0]}`, require(path.join(routesPath, file)));
})

// when route doesn't exist

app.use((req, res, next) => {
  next(new CustomError('NotFound', 'Page not found', 404));
})

// error handling

/**
 * @apiDefine ErrorObject
 *
 * @apiError (Error 4xx/5xx) {Object} error
 * @apiError (Error 4xx/5xx) {String} error.name Error name
 * @apiError (Error 4xx/5xx) {String} error.message Error detailed message
 */

app.use((error, req, res, next) => {
  if(!error.status) {
    switch(error.name) {
      case 'ValidationError':
        error.status = 400;
        break;
      case 'MongoError':
        if(error.code == 11000) error.status = 409;
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
    })
})

/* LISTEN ON GIVEN PORT */

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server is up and running on port ${port}`)
});

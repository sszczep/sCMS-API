'use strict';

const winston = require('winston');
const { env } = require('./config.js');

require('winston-daily-rotate-file');

const transports = {
  file: new winston.transports.DailyRotateFile({
    level: env === 'development' ? 'debug' : 'info',
    filename: '%DATE%.log',
    dirname: 'logs',
    dataPattern: 'yyyy-MM',
    prepend: true,

    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => {
        const { level, timestamp, message } = info;

        return JSON.stringify({ level, timestamp, message });
      })
    )
  }),

  console: new winston.transports.Console({
    level: 'debug',

    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(info => {
        const dateObj = new Date(info.timestamp);
        const timestamp = dateObj.toLocaleString();

        return `[${info.level}] [${timestamp}] ${info.message}`;
      })
    )
  })
};

const logger = winston.createLogger({
  transports: [
    transports.file,
    transports.console
  ]
});

logger.stream = {
  write: message => {
    logger.info(message);
  }
};

logger.logAndExit = (level, message, exitCode) => {
  logger.log(level, message);
  logger.end();

  transports.file.on('finish', () => {
    process.exit(exitCode); // eslint-disable-line no-process-exit
  });
};

module.exports = logger;

const winston = require('winston')
require('winston-daily-rotate-file')

let logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(info => {
          const dateObj = new Date(info.timestamp);
          const timestamp = dateObj.toLocaleString()
          return `[${info.level}] [${timestamp}] ${info.message}`
        })
      )
    }),
    new winston.transports.DailyRotateFile({
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      filename: '%DATE%.log',
      dirname: 'logs',
      dataPattern: 'yyyy-MM',
      prepend: true,

      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
          const obj = { level, timestamp, message } = info
          return JSON.stringify(obj);
        })
      )
    })
  ]
});

logger.stream = {
  write: (message, encoding) => {
    logger.info(message)
  }
}

module.exports = logger

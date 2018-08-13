const mongoose = require('mongoose');
const logger = require('../logger.js')

const options = {
  address: process.env.DATABASE_ADDRESS || 'localhost:27017/blog',
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD
}

mongoose.connect(`mongodb://${options.address}`, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
  logger.info('Mongoose successfully connected')
})

mongoose.connection.on('error', err => {
  logger.error(`Mongoose error: ${err}`)
  process.exit(1)
})

mongoose.connection.on('disconnected', () => {
  logger.error('Mongoose disconnected! Check if your mongodb is running')
  process.exit(1)
})

module.exports = mongoose;

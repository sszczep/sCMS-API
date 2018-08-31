'use strict';

/* eslint no-process-env: "off"*/

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DATABASE_URL || (process.env.NODE_ENV !== 'test' ? 'localhost:27017/blog' : 'localhost:27017/test'),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
  },
  jwtSecret: process.env.JWT_SECRET || 'secret'
};

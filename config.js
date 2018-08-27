'use strict';

/* eslint no-process-env: "off"*/

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DATABASE_URL || 'localhost:27017/blog',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
  },
  jwtSecret: process.env.JWT_SECRET || 'secret'
};

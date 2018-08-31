'use strict';

const mongoose = require('../database/index.js');

before(done => {
  mongoose.connection.dropDatabase(done);
});

require('./auth.test.js');

'use strict';

const mongoose = require('../database/index.js');

before(done => {
  mongoose.connection.dropDatabase(done);
});

/* eslint global-require: "off"*/

(async function() {
  const token = await require('./auth.test.js');

  require('./me.test.js')(token);
  require('./posts.test.js')(token);
})();

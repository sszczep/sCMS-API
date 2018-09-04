'use strict';

const mongoose = require('../database/index.js');

before(done => {
  mongoose.connection.dropDatabase(done);
});

/* eslint global-require: "off"*/

(async function() {
  const token = await require('./auth.test.js');

  require('./me.test.js')(token);

  const posts = await require('./posts.test.js')(token);

  require('./autocomplete.test.js')(posts);

  require('./socials.test.js')(token);

  require('./options.test.js')(token);
})();

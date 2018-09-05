'use strict';

const mongoose = require('../database/index.js');
const UserController = require('../controllers/users.js');

before(async() => {
  // drop database
  await mongoose.connection.dropDatabase();

  // create admin account
  await UserController.registerUser({
    email: 'admin@domain.com',
    password: 'adminPassword',
    permissions: [ '*' ]
  });
});

/* eslint global-require: "off"*/

(async function() {
  const tokens = await require('./auth.test.js');

  require('./me.test.js')(tokens.user);

  const posts = await require('./posts.test.js')(tokens);

  require('./autocomplete.test.js')(posts);

  require('./socials.test.js')(tokens);

  require('./options.test.js')(tokens);
})();

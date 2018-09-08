'use strict';

const mongoose = require('../database/index.js');
const UserController = require('../controllers/users.js');

before(async() => {
  // drop database
  await mongoose.connection.dropDatabase();

  // create admin account
  await UserController.registerUser({
    email: 'admin@domain.com',
    username: 'admin',
    password: 'adminPassword',
    fullname: 'Admin account',
    permissions: [ '*' ]
  });
});

/* eslint global-require: "off"*/

(async function() {
  const tokens = await require('./auth.test.js');

  const users = await require('./users.test.js')(tokens);

  const posts = await require('./posts.test.js')(users);

  require('./autocomplete.test.js')(posts);

  require('./socials.test.js')(users);

  require('./options.test.js')(users);
})();

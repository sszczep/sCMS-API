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
  const users = await require('./auth.test.js');

  require('./users.test.js')(users);

  const posts = await require('./posts.test.js')(users);

  require('./autocomplete.test.js')(posts);

  require('./socials.test.js')(users);

  require('./options.test.js')(users);
})();

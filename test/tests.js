'use strict';

const mongoose = require('../database/index.js');
const UserController = require('../controllers/users.js');

const usersToCreate = {
  admin: {
    email: 'admin@domain.com',
    username: 'admin',
    password: 'adminPassword',
    fullname: 'Admin account',
    permissions: [ '*' ]
  },

  user: {
    email: 'test@domain.com',
    username: 'test',
    password: 'userPassword',
    fullname: 'User account',

    // shouldn't be put in database
    permissions: [ '*' ]
  }
};

const postsToCreate = [
  {
    title: 'Testing posts 1',
    description: 'Short description 1',
    content: 'Lorem ipsum...',
    thumbnail: '/images/test.png',
    created: Date.now()
  },
  {
    title: 'Testing posts 2',
    description: 'Short description 2',
    content: 'Lorem ipsum...',
    thumbnail: '/images/test.png',
    created: Date.now() + 1
  },
  {
    title: 'Testing posts 3',
    description: 'Short description 3',
    content: 'Lorem ipsum...',
    thumbnail: '/images/test.png',
    created: Date.now() + 2
  },
  {
    title: 'Testing posts 4',
    description: 'Short description 4',
    content: 'Lorem ipsum...',
    thumbnail: '/images/test.png',
    created: Date.now() + 3
  },
  {
    title: 'Testing posts 5',
    description: 'Short description 5',
    content: 'Lorem ipsum...',
    thumbnail: '/images/test.png',
    created: Date.now() + 4
  }
];

const socialsToCreate = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com',
    icon: 'fab fa-facebook'
  },
  {
    name: 'Github',
    url: 'https://www.github.com',
    icon: 'fab fa-github'
  }
];

const optionsToCreate = [
  {
    key: 'Option1',
    value: 'Value1'
  },
  {
    key: 'Option2',
    value: 'Value2'
  }
];

before(async() => {
  // drop database
  await mongoose.connection.dropDatabase();

  // create admin account
  await UserController.registerUser({
    toCreate: usersToCreate.admin
  });
});

/* eslint global-require: "off"*/

(async function() {
  const users = await require('./auth.test.js')(usersToCreate);

  require('./users.test.js')(users);

  const posts = await require('./posts.test.js')(postsToCreate, users);

  require('./autocomplete.test.js')(posts, users);

  require('./socials.test.js')(socialsToCreate, users);

  require('./options.test.js')(optionsToCreate, users);
})();

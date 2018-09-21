'use strict';

const mongoose = require('../database/index.js');
const UserController = require('../controllers/users.js');
const { expect } = require('chai');

const usersToCreate = {
  admin: {
    email: 'admin@domain.com',
    username: 'admin',
    password: 'adminPassword',
    fullname: 'Admin account',
    permissions: [ '*' ]
  },

  blogger: {
    email: 'blogger@domain.com',
    username: 'blogger',
    password: 'bloggerPassword',
    fullname: 'Blogger account',
    permissions: [ 'createPosts' ]
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

  // create blogger account
  await UserController.registerUser({
    toCreate: usersToCreate.blogger
  });
});

/* eslint global-require: "off"*/

(async function() {
  describe('Checking test data...', () => {
    it('There should be users named: user, blogger, admin', () => {
      expect(usersToCreate).to.have.property('user');
      expect(usersToCreate).to.have.property('blogger');
      expect(usersToCreate).to.have.property('admin');
    });

    it('There should be exactly 5 posts', () => {
      expect(postsToCreate.length).to.equal(5);
    });

    it('There should be exactly 2 social links', () => {
      expect(socialsToCreate.length).to.equal(2);
    });

    it('There should be exactly 2 options', () => {
      expect(optionsToCreate.length).to.equal(2);
    });
  });

  const tokens = await require('./auth.test.js')(usersToCreate);

  const users = await require('./me.test.js')(usersToCreate, tokens);

  require('./users.test.js')(users);

  const posts = await require('./posts.test.js')(postsToCreate, users);

  require('./autocomplete.test.js')(posts, users);

  require('./socials.test.js')(socialsToCreate, users);

  require('./options.test.js')(optionsToCreate, users);
})();

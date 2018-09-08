'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

module.exports = users => {
  describe('Testing /users', () => {
    describe('#GET /users/:phrase', () => {
      it('Shouldn\'t get user data by username - no user found', async() => {
        const { body } = await request(app)
          .get('/users/lulz')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should get user data by username - without Authentication Header', async() => {
        const { body } = await request(app)
          .get(`/users/${users.user.username}`)
          .send();

        expect(body.data.username).to.equal(users.user.username);
        expect(body.data).not.to.have.property('email');
      });

      it('Should get user data by username - with Authentication Header', async() => {
        const { body } = await request(app)
          .get(`/users/${users.user.username}`)
          .set('Authorization', `Bearer ${users.user.token}`)
          .send();

        expect(body.data.username).to.equal(users.user.username);
        expect(body.data).to.have.property('email');
      });

      it('Shouldn\'t get user data by _id - no user found', async() => {
        const { body } = await request(app)
          .get('/users/invalid_id')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should get user data by _id - without Authentication Header', async() => {
        const { body } = await request(app)
          .get(`/users/${users.user._id}`)
          .send();

        expect(body.data.username).to.equal(users.user.username);
        expect(body.data).not.to.have.property('email');
      });

      it('Should get user data by _id - with Authentication Header', async() => {
        const { body } = await request(app)
          .get(`/users/${users.user._id}`)
          .set('Authorization', `Bearer ${users.user.token}`)
          .send();

        expect(body.data.username).to.equal(users.user.username);
        expect(body.data).to.have.property('email');
      });
    });
  });
};

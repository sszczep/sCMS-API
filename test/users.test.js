'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

module.exports = tokens => new Promise(resolve => {
  describe('Testing /users', () => {
    describe('#GET /users/username/:username', () => {
      it('Shouldn\'t get user data - no user found', async() => {
        const { body } = await request(app)
          .get('/users/username/lulz')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should get user data - without Authentication Header', async() => {
        const { body } = await request(app)
          .get('/users/username/test')
          .send();

        expect(body.data.username).to.equal('test');
      });

      it('Should get user data - with Authentication Header', async() => {
        const { body } = await request(app)
          .get('/users/username/test')
          .set('Authorization', `Bearer ${tokens.user}`)
          .send();

        expect(body.data).to.have.property('email');
      });

      it('Should return both user and admin data', async() => {
        const getData = async data => {
          const { body } = await request(app)
            .get(`/users/username/${data.username}`)
            .set('Authorization', `Bearer ${data.token}`)
            .send();

          expect(body.data.username).to.equal(data.username);

          return body.data;
        };

        const user = await getData({
          token: tokens.user,
          username: 'test'
        });

        const admin = await getData({
          token: tokens.admin,
          username: 'admin'
        });

        return resolve({
          user: {
            ...user,
            token: tokens.user
          },

          admin: {
            ...admin,
            token: tokens.admin
          }
        });
      });
    });
  });
});

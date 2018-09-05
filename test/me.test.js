'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

module.exports = tokens => new Promise(resolve => {
  describe('Testing /me', () => {
    describe('#GET /me', () => {
      it('Shouldn\'t return user data - no Authorization Header', async() => {
        const { body } = await request(app)
          .get('/me')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t return user data - outdated/wrong token', async() => {
        const { body } = await request(app)
          .get('/me')
          .set('Authorization', 'Bearer blah_blah_blah')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should return both user and admin data', async() => {
        const getData = async data => {
          const { body } = await request(app)
            .get('/me')
            .set('Authorization', `Bearer ${data.token}`)
            .send();

          expect(body.data.email).to.equal(data.email);

          return body.data;
        };

        const user = await getData({
          token: tokens.user,
          email: 'test@domain.com'
        });

        const admin = await getData({
          token: tokens.admin,
          email: 'admin@domain.com'
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

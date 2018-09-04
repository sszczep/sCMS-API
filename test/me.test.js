'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

module.exports = token => {
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

      it('Should return user data', async() => {
        const { body } = await request(app)
          .get('/me')
          .set('Authorization', `Bearer ${token}`)
          .send();

        expect(body.data.email).to.equal('test@domain.com');
      });
    });
  });
};

'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

module.exports = token => {
  describe('Testing /me', () => {
    describe('#GET /me', () => {
      it('Shouldn\'t return user data - no Authorization Header', done => {
        request(app)
          .get('/me')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');
            done();
          });
      });

      it('Shouldn\'t return user data - outdated/wrong token', done => {
        request(app)
          .get('/me')
          .set('Authorization', 'Bearer blah_blah_blah')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');
            done();
          });
      });

      it('Should return user data', done => {
        request(app)
          .get('/me')
          .set('Authorization', `Bearer ${token}`)
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body.user.email).to.equal('test@domain.com');
            done();
          });
      });
    });
  });
};

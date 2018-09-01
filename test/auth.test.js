'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

module.exports = new Promise(resolve => {
  describe('Testing /auth', () => {
    describe('#POST /auth/register', () => {
      it('Shouldn\'t register new user - empty payload', done => {
        request(app)
          .post('/auth/register')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');
            done();
          });
      });

      it('Shouldn\'t register new user - password too short', done => {
        request(app)
          .post('/auth/register')
          .send({
            email: 'test@domain.com',
            password: 'short'
          })
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');
            done();
          });
      });

      it('Shouldn\'t register new user - wrong email format', done => {
        request(app)
          .post('/auth/register')
          .send({
            email: 'test.domain.com',
            password: 'password'
          })
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');
            done();
          });
      });

      it('Should register new user', done => {
        request(app)
          .post('/auth/register')
          .send({
            email: 'test@domain.com',
            password: 'password'
          })
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body.token).to.be.a('string');
            done();
          });
      });

      it('Shouldn\'t register new user - email in use', done => {
        request(app)
          .post('/auth/register')
          .send({
            email: 'test@domain.com',
            password: 'password'
          })
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');
            done();
          });
      });
    });

    describe('#POST /auth/login', () => {
      it('Shouldn\'t login - empty payload', done => {
        request(app)
          .post('/auth/login')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');
            done();
          });
      });

      it('Shouldn\'t login - wrong email', done => {
        request(app)
          .post('/auth/login')
          .send({
            email: 'test1@domain.com',
            password: 'password'
          })
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');
            done();
          });
      });

      it('Shouldn\'t login - wrong password', done => {
        request(app)
          .post('/auth/login')
          .send({
            email: 'test@domain.com',
            password: 'wrongPassword'
          })
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');
            done();
          });
      });

      it('Should login successfully and return token', done => {
        request(app)
          .post('/auth/login')
          .send({
            email: 'test@domain.com',
            password: 'password'
          })
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body.token).to.be.a('string');
            done();

            // return token
            return resolve(body.token);
          });
      });
    });
  });
});

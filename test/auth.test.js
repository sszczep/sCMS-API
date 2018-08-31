'use strict';

const app = require('../app.js');
const chai = require('chai');
const request = require('supertest');

const { expect } = chai;

describe('Testing /auth', () => {
  describe('#POST /auth/register', () => {
    it('Should register new user', done => {
      request(app)
        .post('/auth/register')
        .send({
          email: 'test@gmail.com',
          password: 'test1234'
        })
        .end((err, { body }) => {
          if(err) {
            return done(err);
          }

          expect(body.token).to.be.a('string');
          done();
        });
    });
  });

  describe('#POST /auth/login', () => {
    it('Should login successfully and return token', done => {
      request(app)
        .post('/auth/login')
        .send({
          email: 'test@gmail.com',
          password: 'test1234'
        })
        .end((err, { body }) => {
          if(err) {
            return done(err);
          }

          expect(body.token).to.be.a('string');
          done();
        });
    });
  });
});

'use strict';

const app = require('../app.js');
const chai = require('chai');
const chaiJWT = require('chai-jwt');
const request = require('supertest');

chai.use(chaiJWT);

const { expect } = chai;

module.exports = new Promise(resolve => {
  describe('Testing /auth', () => {
    describe('#POST /auth/register', () => {
      it('Shouldn\'t register new user - some required fields are empty', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t register new user - password too short', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            email: 'test@domain.com',
            password: 'short',
            fullname: 'Testing account'
          });

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t register new user - wrong email format', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            email: 'test.domain.com',
            password: 'password',
            fullname: 'Testing account'
          });

        expect(body).to.have.property('errors');
      });

      it('Should register new user', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            email: 'test@domain.com',
            password: 'password',
            fullname: 'Testing account'
          });

        expect(body.data.token).to.be.a.jwt; // eslint-disable-line no-unused-expressions
      });

      it('Shouldn\'t register new user - email in use', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            email: 'test@domain.com',
            password: 'password'
          });

        expect(body).to.have.property('errors');
      });
    });

    describe('#POST /auth/login', () => {
      it('Shouldn\'t login - empty payload', async() => {
        const { body } = await request(app)
          .post('/auth/login')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t login - wrong email', async() => {
        const { body } = await request(app)
          .post('/auth/login')
          .send({
            email: 'test1@domain.com',
            password: 'password'
          });

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t login - wrong password', async() => {
        const { body } = await request(app)
          .post('/auth/login')
          .send({
            email: 'test@domain.com',
            password: 'wrongPassword'
          });

        expect(body).to.have.property('errors');
      });

      it('Should login both user and admin successfully and return tokens', async() => {
        const login = async data => {
          const { body } = await request(app)
            .post('/auth/login')
            .send(data);

          expect(body.data.token).to.be.a.jwt; // eslint-disable-line no-unused-expressions

          return body.data.token;
        };

        const user = await login({
          email: 'test@domain.com',
          password: 'password'
        });

        const admin = await login({
          email: 'admin@domain.com',
          password: 'adminPassword'
        });

        return resolve({ user, admin });
      });
    });
  });
});

'use strict';

const app = require('../app.js');
const chai = require('chai');
const chaiJWT = require('chai-jwt');
const request = require('supertest');

chai.use(chaiJWT);

const { expect } = chai;

const pokemonize = string =>
  string.split('')
    .map((char, index) => (index % 2 ? char : char.toUpperCase())) // eslint-disable-line no-confusing-arrow
    .join('');

// will be filled later
let tokens = {};

module.exports = ({ user, admin }) => new Promise(resolve => {
  describe('Testing /auth', () => {
    describe('#POST /auth/register', () => {
      it('Should not register - empty payload', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not register new user - some required fields are empty', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            ...user,
            username: undefined
          });

        expect(body).to.have.property('errors');
      });

      it('Should not register new user - username too short', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            ...user,
            username: 'srt'
          });

        expect(body).to.have.property('errors');
      });

      it('Should not register new user - password too short', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            ...user,
            password: 'short'
          });

        expect(body).to.have.property('errors');
      });

      it('Should not register new user - wrong email format', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            ...user,
            email: 'wrong.email.com'
          });

        expect(body).to.have.property('errors');
      });

      it('Should not register new user - wrong username format', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            ...user,
            username: '.:user:.'
          });

        expect(body).to.have.property('errors');
      });

      it('Should not register new user - email in use', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            ...admin,
            username: 'uniqueUsername'
          });

        expect(body).to.have.property('errors');
      });

      it('Should not register new user - username in use', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            ...admin,
            email: 'unique@email.com'
          });

        expect(body).to.have.property('errors');
      });

      it('Should register new user', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send(user);

        // token should be a valid token
        expect(body.data.token).to.be.a.jwt; // eslint-disable-line no-unused-expressions
        expect(body.data.refreshToken).to.be.a.jwt; // eslint-disable-line no-unused-expressions
        expect(body.data).to.have.property('expiration');
      });
    });

    describe('#POST /auth/login', () => {
      it('Should not login - empty payload', async() => {
        const { body } = await request(app)
          .post('/auth/login')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not login - some required fields are empty', async() => {
        const { body } = await request(app)
          .post('/auth/login')
          .send({
            username: user.username
          });

        expect(body).to.have.property('errors');
      });

      it('Should not login - no user with given username/email', async() => {
        const { body } = await request(app)
          .post('/auth/login')
          .send({
            login: 'test1@domain.com',
            password: 'password'
          });

        expect(body).to.have.property('errors');
      });

      it('Should not login - wrong password', async() => {
        const { body } = await request(app)
          .post('/auth/login')
          .send({
            login: user.username,
            password: 'wrongPassword'
          });

        expect(body).to.have.property('errors');
      });

      it('Should login with email', async() => {
        const { body } = await request(app)
          .post('/auth/login')
          .send({
            login: user.email,
            password: user.password
          });

        // token should be a valid token
        expect(body.data.token).to.be.a.jwt; // eslint-disable-line no-unused-expressions
        expect(body.data.refreshToken).to.be.a.jwt; // eslint-disable-line no-unused-expressions
        expect(body.data).to.have.property('expiration');
      });

      it('Should login with username', async() => {
        const { body } = await request(app)
          .post('/auth/login')
          .send({
            login: user.username,
            password: user.password
          });

        // token should be a valid token
        expect(body.data.token).to.be.a.jwt; // eslint-disable-line no-unused-expressions
        expect(body.data.refreshToken).to.be.a.jwt; // eslint-disable-line no-unused-expressions
        expect(body.data).to.have.property('expiration');
      });

      it('Should login with username with some letters capitalized', async() => {
        const { body } = await request(app)
          .post('/auth/login')
          .send({
            login: pokemonize(user.username),
            password: user.password
          });

        // token should be a valid token
        expect(body.data.token).to.be.a.jwt; // eslint-disable-line no-unused-expressions
        expect(body.data.refreshToken).to.be.a.jwt; // eslint-disable-line no-unused-expressions
        expect(body.data).to.have.property('expiration');
      });

      it('Should login with email with some letters capitalized', async() => {
        const { body } = await request(app)
          .post('/auth/login')
          .send({
            login: pokemonize(user.email),
            password: user.password
          });

        // token should be a valid token
        expect(body.data.token).to.be.a.jwt; // eslint-disable-line no-unused-expressions
        expect(body.data.refreshToken).to.be.a.jwt; // eslint-disable-line no-unused-expressions
        expect(body.data).to.have.property('expiration');
      });

      it('Should login both user and admin successfully and return tokens', async() => {
        const login = async data => {
          const { body } = await request(app)
            .post('/auth/login')
            .send({
              login: data.username,
              password: data.password
            });

          // token should be a valid token
          expect(body.data.token).to.be.a.jwt; // eslint-disable-line no-unused-expressions
          expect(body.data.refreshToken).to.be.a.jwt; // eslint-disable-line no-unused-expressions
          expect(body.data).to.have.property('expiration');

          return {
            token: body.data.token,
            refreshToken: body.data.refreshToken,
            expiration: body.data.expiration
          };
        };

        const userTokens = await login(user);
        const adminTokens = await login(admin);

        tokens = { userTokens, adminTokens };

        return resolve({
          userToken: userTokens.token,
          adminToken: adminTokens.token
        });
      });
    });

    describe('#POST /auth/refresh-token', () => {
      it('Should not refresh token - empty payload', async() => {
        const { body } = await request(app)
          .post('/auth/refresh-token')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not refresh token - invalid refresh token', async() => {
        const { body } = await request(app)
          .post('/auth/refresh-token')
          .send({
            refreshToken: 'blablabla'
          });

        expect(body).to.have.property('errors');
      });

      it('Should not refresh token - outdated/wrong refresh token', async() => {
        const { body } = await request(app)
          .post('/auth/refresh-token')
          .send({
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzcwMDI2MTQsImV4cCI6MTU1Mjc4MTQxNH0.euubuVcQKOiNdTlCqPllSry2ZsZx7amVAfMq9EaXqxE'
          });

        expect(body).to.have.property('errors');
      });

      it('Should refresh token', async() => {
        const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

        // wait for one second to be sure that generated tokens will be different
        await timeout(1000);

        const { body } = await request(app)
          .post('/auth/refresh-token')
          .send({
            refreshToken: tokens.userTokens.refreshToken
          });

        // token should be a valid token
        expect(body.data.token).to.be.a.jwt; // eslint-disable-line no-unused-expressions
        expect(body.data).to.have.property('expiration');

        // tokens should differ
        expect(body.data.token).not.to.equal(tokens.userTokens.token);
      });
    });

    describe('#POST /auth/logout', () => {
      it('Should not remove refresh token - empty payload', async() => {
        const { body } = await request(app)
          .post('/auth/logout')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not remove refresh token - invalid refresh token', async() => {
        const { body } = await request(app)
          .post('/auth/logout')
          .send({
            refreshToken: 'blablabla'
          });

        expect(body).to.have.property('errors');
      });

      it('Should not remove refresh token - outdated/wrong refresh token', async() => {
        const { body } = await request(app)
          .post('/auth/logout')
          .send({
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzcwMDI2MTQsImV4cCI6MTU1Mjc4MTQxNH0.euubuVcQKOiNdTlCqPllSry2ZsZx7amVAfMq9EaXqxE'
          });

        expect(body).to.have.property('errors');
      });

      it('Should remove refresh token', async() => {
        const { body } = await request(app)
          .post('/auth/logout')
          .send({
            refreshToken: tokens.userTokens.refreshToken
          });

        expect(body).not.to.have.property('errors');
      });
    });

    describe('#POST /auth/refresh-token', () => {
      it('Should not refresh token - given token has been already deleted', async() => {
        const { body } = await request(app)
          .post('/auth/refresh-token')
          .send({
            refreshToken: tokens.userTokens.refreshToken
          });

        expect(body).to.have.property('errors');
      });
    });
  });
});

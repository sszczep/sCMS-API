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
        expect(body.data).to.have.property('expiration');

        // user should not have permissions
        expect(body.data.user.permissions.length).to.equal(0);

        // all other datas should match
        expect(body.data.user.username).to.equal(user.username);
        expect(body.data.user.email).to.equal(user.email);
        expect(body.data.user.fullname).to.equal(user.fullname);

        // response should not contain _id and __v
        expect(body.data.user).not.to.have.property('_id');
        expect(body.data.user).not.to.have.property('__v');
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
        expect(body.data).to.have.property('expiration');

        expect(body.data.user.username).to.equal(user.username);
        expect(body.data.user.email).to.equal(user.email);
        expect(body.data.user.fullname).to.equal(user.fullname);

        // response should not contain _id and __v
        expect(body.data.user).not.to.have.property('_id');
        expect(body.data.user).not.to.have.property('__v');
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
        expect(body.data).to.have.property('expiration');

        expect(body.data.user.username).to.equal(user.username);
        expect(body.data.user.email).to.equal(user.email);
        expect(body.data.user.fullname).to.equal(user.fullname);

        // response should not contain _id and __v
        expect(body.data.user).not.to.have.property('_id');
        expect(body.data.user).not.to.have.property('__v');
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
        expect(body.data).to.have.property('expiration');

        expect(body.data.user.username).to.equal(user.username);
        expect(body.data.user.email).to.equal(user.email);
        expect(body.data.user.fullname).to.equal(user.fullname);

        // response should not contain _id and __v
        expect(body.data.user).not.to.have.property('_id');
        expect(body.data.user).not.to.have.property('__v');
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
        expect(body.data).to.have.property('expiration');

        expect(body.data.user.username).to.equal(user.username);
        expect(body.data.user.email).to.equal(user.email);
        expect(body.data.user.fullname).to.equal(user.fullname);

        // response should not contain _id and __v
        expect(body.data.user).not.to.have.property('_id');
        expect(body.data.user).not.to.have.property('__v');
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
          expect(body.data).to.have.property('expiration');

          expect(body.data.user.username).to.equal(data.username);
          expect(body.data.user.email).to.equal(data.email);
          expect(body.data.user.fullname).to.equal(data.fullname);

          // response should not contain _id and __v
          expect(body.data.user).not.to.have.property('_id');
          expect(body.data.user).not.to.have.property('__v');

          return { token: body.data.token, ...body.data.user };
        };

        const loggedUser = await login(user);
        const loggedAdmin = await login(admin);

        return resolve({
          user: loggedUser,
          admin: loggedAdmin
        });
      });
    });
  });
});

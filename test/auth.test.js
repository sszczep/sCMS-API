'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

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
            password: 'short'
          });

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t register new user - wrong email format', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            email: 'test.domain.com',
            password: 'password'
          });

        expect(body).to.have.property('errors');
      });

      it('Should register new user', async() => {
        const { body } = await request(app)
          .post('/auth/register')
          .send({
            email: 'test@domain.com',
            password: 'password'
          });

        expect(body.token).to.be.a('string');
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

      return it('Should login successfully and return token', async() => {
        const { body } = await request(app)
          .post('/auth/login')
          .send({
            email: 'test@domain.com',
            password: 'password'
          });

        expect(body.token).to.be.a('string');

        // return token
        return resolve(body.token);
      });
    });
  });
});

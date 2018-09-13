'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

module.exports = users => {
  describe('Testing /users', () => {
    describe('#GET /users/:username', () => {
      it('Should not get user data - no user with given username', async() => {
        const { body } = await request(app)
          .get('/users/lulz')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should get user data - no Authorization Header', async() => {
        const { body } = await request(app)
          .get(`/users/${users.user.username}`)
          .send();

        expect(body.data.username).to.equal(users.user.username);
        expect(body.data.fullname).to.equal(users.user.fullname);
        expect(body.data.avatar).to.equal(users.user.avatar);

        // we cannot compare posts - they are not populated in auth responses but here they are
        expect(body.data).to.have.property('posts');

        // should not be in response - considered as sensitive data
        expect(body.data).not.to.have.property('email');
        expect(body.data).not.to.have.property('permissions');

        // response should not contain _id and __v
        expect(body.data).not.to.have.property('_id');
        expect(body.data).not.to.have.property('__v');
      });

      it('Should get user data - invalid token', async() => {
        const { body } = await request(app)
          .get(`/users/${users.user.username}`)
          .set('Authorization', 'Bearer blablabla')
          .send();

        expect(body.data.username).to.equal(users.user.username);
        expect(body.data.fullname).to.equal(users.user.fullname);
        expect(body.data.avatar).to.equal(users.user.avatar);

        // we cannot compare posts - they are not populated in auth responses but here they are
        expect(body.data).to.have.property('posts');

        // should not be in response - considered as sensitive data
        expect(body.data).not.to.have.property('email');
        expect(body.data).not.to.have.property('permissions');

        // response should not contain _id and __v
        expect(body.data).not.to.have.property('_id');
        expect(body.data).not.to.have.property('__v');
      });

      it('Should get user data - outdated/wrong token', async() => {
        const { body } = await request(app)
          .get(`/users/${users.user.username}`)
          .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzY1MTI4NjMsInVzZXJuYW1lIjoidXNlciIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNTM2NTEyMjYzfQ.jAWMZ8x-cXQfiOL689omiOq8JU1E8JteYYFyhVtjUdo')
          .send();

        expect(body.data.username).to.equal(users.user.username);
        expect(body.data.fullname).to.equal(users.user.fullname);
        expect(body.data.avatar).to.equal(users.user.avatar);

        // we cannot compare posts - they are not populated in auth responses but here they are
        expect(body.data).to.have.property('posts');

        // should not be in response - considered as sensitive data
        expect(body.data).not.to.have.property('email');
        expect(body.data).not.to.have.property('permissions');

        // response should not contain _id and __v
        expect(body.data).not.to.have.property('_id');
        expect(body.data).not.to.have.property('__v');
      });

      it('Should get user data (with sensitive) - User token (his account)', async() => {
        const { body } = await request(app)
          .get(`/users/${users.user.username}`)
          .set('Authorization', `Bearer ${users.user.token}`)
          .send();

        expect(body.data.username).to.equal(users.user.username);
        expect(body.data.fullname).to.equal(users.user.fullname);
        expect(body.data.avatar).to.equal(users.user.avatar);

        // we cannot compare posts - they are not populated in auth responses but here they are
        expect(body.data).to.have.property('posts');

        // sensitive data should now be accessible
        expect(body.data.email).to.equal(users.user.email);
        expect(body.data).to.have.property('permissions');

        // response should not contain _id and __v
        expect(body.data).not.to.have.property('_id');
        expect(body.data).not.to.have.property('__v');
      });

      it('Should get user data (with sensitive) - Admin token (admin has permission to do that)', async() => {
        const { body } = await request(app)
          .get(`/users/${users.user.username}`)
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send();

        expect(body.data.username).to.equal(users.user.username);
        expect(body.data.fullname).to.equal(users.user.fullname);
        expect(body.data.avatar).to.equal(users.user.avatar);

        // we cannot compare posts - they are not populated in auth responses but here they are
        expect(body.data).to.have.property('posts');

        // sensitive data should now be accessible
        expect(body.data.email).to.equal(users.user.email);
        expect(body.data).to.have.property('permissions');

        // response should not contain _id and __v
        expect(body.data).not.to.have.property('_id');
        expect(body.data).not.to.have.property('__v');
      });

      it('Should get admin data - User token (user does not have permission to do that, no sensitive data will be send)', async() => {
        const { body } = await request(app)
          .get(`/users/${users.admin.username}`)
          .set('Authorization', `Bearer ${users.user.token}`)
          .send();

        expect(body.data.username).to.equal(users.admin.username);
        expect(body.data.fullname).to.equal(users.admin.fullname);
        expect(body.data.avatar).to.equal(users.admin.avatar);

        // we cannot compare posts - they are not populated in auth responses but here they are
        expect(body.data).to.have.property('posts');

        // should not be in response - considered as sensitive data
        expect(body.data).not.to.have.property('email');
        expect(body.data).not.to.have.property('permissions');

        // response should not contain _id and __v
        expect(body.data).not.to.have.property('_id');
        expect(body.data).not.to.have.property('__v');
      });
    });
  });
};

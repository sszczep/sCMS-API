'use strict';

const app = require('../app.js');
const chai = require('chai');
const chaiJWT = require('chai-jwt');
const request = require('supertest');

chai.use(chaiJWT);

const { expect } = chai;

module.exports = (usersToCreate, { userToken, adminToken }) => new Promise(resolve => {
  describe('Testing /me', () => {
    describe('#GET /me', () => {
      it('Should not get user details - no Authorization Hedaer', async() => {
        const { body } = await request(app)
          .get('/me')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not get user details - invalid token', async() => {
        const { body } = await request(app)
          .get('/me')
          .set('Authorization', 'Bearer blablabla')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not get user details - outdated/wrong token', async() => {
        const { body } = await request(app)
          .get('/me')
          .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzY1MTI4NjMsInVzZXJuYW1lIjoidXNlciIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNTM2NTEyMjYzfQ.jAWMZ8x-cXQfiOL689omiOq8JU1E8JteYYFyhVtjUdo')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should get both users details', async() => {
        const getDetails = async data => {
          const { body } = await request(app)
            .get('/me')
            .set('Authorization', `Bearer ${data.token}`)
            .send();

          expect(body.data.username).to.equal(data.username);
          expect(body.data.email).to.equal(data.email);
          expect(body.data.fullname).to.equal(data.fullname);

          // response should not contain _id and __v
          expect(body.data).not.to.have.property('_id');
          expect(body.data).not.to.have.property('__v');

          return {
            token: data.token,
            ...body.data
          };
        };

        const user = await getDetails({
          token: userToken,
          ...usersToCreate.user
        });

        const admin = await getDetails({
          token: adminToken,
          ...usersToCreate.admin
        });

        return resolve({
          user,
          admin
        });
      });
    });
  });
});

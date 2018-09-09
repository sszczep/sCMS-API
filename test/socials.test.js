'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

// created socials using POST /socials request, will be filled later
let createdSocials = [];

module.exports = (socialsToCreate, users) => {
  describe('Testing /socials', () => {
    describe('#GET /socials', () => {
      it('Should return empty array of social links', async() => {
        const { body } = await request(app)
          .get('/socials')
          .send();

        expect(body.data.length).to.equal(0);
      });
    });

    describe('#POST /socials', () => {
      it('Should not create new social link - empty payload', async() => {
        const { body } = await request(app)
          .post('/socials')
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not create new social link - some required fields are empty', async() => {
        const { body } = await request(app)
          .post('/socials')
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send({
            ...socialsToCreate[0],
            name: undefined
          });

        expect(body).to.have.property('errors');
      });

      it('Should not create new social link - no Authorization Header', async() => {
        const { body } = await request(app)
          .post('/socials')
          .send(socialsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it('Should not create new social link - invalid token', async() => {
        const { body } = await request(app)
          .post('/socials')
          .set('Authorization', 'Bearer blablabla')
          .send(socialsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it('Should not create new social link - outdated/wrong token', async() => {
        const { body } = await request(app)
          .post('/socials')
          .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzY1MTI4NjMsInVzZXJuYW1lIjoidXNlciIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNTM2NTEyMjYzfQ.jAWMZ8x-cXQfiOL689omiOq8JU1E8JteYYFyhVtjUdo')
          .send(socialsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it('Should not create new social link - user has no permission', async() => {
        const { body } = await request(app)
          .post('/socials')
          .set('Authorization', `Bearer ${users.user.token}`)
          .send(socialsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it(`Should create ${socialsToCreate.length} new social links`, async() => {
        const publish = async data => {
          const { body } = await request(app)
            .post('/socials')
            .set('Authorization', `Bearer ${users.admin.token}`)
            .send(data);

          expect(body.data.name).to.equal(data.name);
          expect(body.data.url).to.equal(data.url);
          expect(body.data.icon).to.equal(data.icon);

          // response should not contain _id and __v
          expect(body.data).not.to.have.property('_id');
          expect(body.data).not.to.have.property('__v');

          return body.data;
        };

        const promises = socialsToCreate.map(elem => publish(elem));

        createdSocials = await Promise.all(promises);
      });

      it('Should not create new social link - there is a link with given name', async() => {
        const { body } = await request(app)
          .post('/socials')
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send(socialsToCreate[0]);

        expect(body).to.have.property('errors');
      });
    });

    describe('#GET /socials', () => {
      it('Should return array of social links', async() => {
        const { body } = await request(app)
          .get('/socials')
          .send();

        for(let i = 0; i < body.data.length; i++) {
          expect(body.data[i].name).to.equal(createdSocials[i].name);
          expect(body.data[i].url).to.equal(createdSocials[i].url);
          expect(body.data[i].icon).to.equal(createdSocials[i].icon);

          // response should not contain _id and __v
          expect(body.data[i]).not.to.have.property('_id');
          expect(body.data[i]).not.to.have.property('__v');
        }
      });
    });
  });
};

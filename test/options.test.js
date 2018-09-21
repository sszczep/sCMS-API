'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

// created options using POST /options request, will be filled later
let createdOptions = [];

module.exports = (optionsToCreate, users) => {
  describe('Testing /options', () => {
    describe('#GET /options', () => {
      it('Should return empty erray', async() => {
        const { body } = await request(app)
          .get('/options')
          .send();

        expect(body.data.length).to.equal(0);
      });
    });

    describe('#POST /options', () => {
      it('Should not create new option - empty payload', async() => {
        const { body } = await request(app)
          .post('/options')
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not create new option - some required fields are empty', async() => {
        const { body } = await request(app)
          .post('/options')
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send({
            ...optionsToCreate[0],
            key: undefined
          });

        expect(body).to.have.property('errors');
      });

      it('Should not create new option - no Authorization Header', async() => {
        const { body } = await request(app)
          .post('/options')
          .send(optionsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it('Should not create new option - outdated/wrong token', async() => {
        const { body } = await request(app)
          .post('/options')
          .set('Authorization', 'Bearer blablabla')
          .send(optionsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it('Should not create new option - outdated/wrong token', async() => {
        const { body } = await request(app)
          .post('/options')
          .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzY1MTI4NjMsInVzZXJuYW1lIjoidXNlciIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNTM2NTEyMjYzfQ.jAWMZ8x-cXQfiOL689omiOq8JU1E8JteYYFyhVtjUdo')
          .send(optionsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it('Should not create new option - user has no permission', async() => {
        const { body } = await request(app)
          .post('/options')
          .set('Authorization', `Bearer ${users.user.token}`)
          .send(optionsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it(`Should create ${optionsToCreate.length} new options`, async() => {
        const publish = async data => {
          const { body } = await request(app)
            .post('/options')
            .set('Authorization', `Bearer ${users.admin.token}`)
            .send(data);

          expect(body.data.key).to.equal(data.key);
          expect(body.data.value).to.equal(data.value);

          // response should not contain _id and __v
          expect(body.data).not.to.have.property('_id');
          expect(body.data).not.to.have.property('__v');

          return body.data;
        };

        const promises = optionsToCreate.map(elem => publish(elem));

        createdOptions = await Promise.all(promises);
      });

      it('Should not create new option - there is an option with this title', async() => {
        const { body } = await request(app)
          .post('/options')
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send(optionsToCreate[0]);

        expect(body).to.have.property('errors');
      });
    });

    describe('#GET /options', () => {
      it('Should get list of options', async() => {
        const { body } = await request(app)
          .get('/options')
          .send();

        for(let i = 0; i < body.data.length; i++) {
          expect(body.data[i].key).to.equal(createdOptions[i].key);
          expect(body.data[i].value).to.equal(createdOptions[i].value);

          // response should not contain _id and __v
          expect(body.data[i]).not.to.have.property('_id');
          expect(body.data[i]).not.to.have.property('__v');
        }
      });
    });

    describe('#DELTE /options/:key', () => {
      it('Should not delete option - key not specified', async() => {
        const { body } = await request(app)
          .delete('/options/')
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not delete option - no Authorization Header', async() => {
        const { body } = await request(app)
          .delete(`/options/${createdOptions[0].key}`)
          .send();

        expect(body).to.have.property('errors');
      });
      it('Should not delete option - invalid token', async() => {
        const { body } = await request(app)
          .delete(`/options/${createdOptions[0].key}`)
          .set('Authorization', 'Bearer blablabla')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not delete option - outdated/wrong token', async() => {
        const { body } = await request(app)
          .delete(`/options/${createdOptions[0].key}`)
          .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzY1MTI4NjMsInVzZXJuYW1lIjoidXNlciIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNTM2NTEyMjYzfQ.jAWMZ8x-cXQfiOL689omiOq8JU1E8JteYYFyhVtjUdo')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not delete option - no option with given key', async() => {
        const { body } = await request(app)
          .delete('/options/NOT_EXISTING')
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not delete option - user has no permission', async() => {
        const { body } = await request(app)
          .delete(`/options/${createdOptions[0].key}`)
          .set('Authorization', `Bearer ${users.user.token}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should delete option', async() => {
        const { body } = await request(app)
          .delete(`/options/${createdOptions[0].key}`)
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send();

        expect(Object.keys(body).length).to.equal(0);

        createdOptions.splice(0, 1);
      });
    });

    describe('#PUT /options/:key', () => {
      it('Should not change option - empty payload', async() => {
        const { body } = await request(app)
          .put(`/options/${createdOptions[0].key}`)
          .set('Authorization', `Bearer ${users.user.token}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not change option - no Authorization Header', async() => {
        const { body } = await request(app)
          .put(`/options/${createdOptions[0].key}`)
          .send({
            newValue: 'New Value!'
          });

        expect(body).to.have.property('errors');
      });

      it('Should not change option - invalid token', async() => {
        const { body } = await request(app)
          .put(`/options/${createdOptions[0].key}`)
          .set('Authorization', 'Bearer blablabla')
          .send({
            newValue: 'New Value!'
          });

        expect(body).to.have.property('errors');
      });

      it('Should not change option - outdated/wrong token', async() => {
        const { body } = await request(app)
          .put(`/options/${createdOptions[0].key}`)
          .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzY1MTI4NjMsInVzZXJuYW1lIjoidXNlciIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNTM2NTEyMjYzfQ.jAWMZ8x-cXQfiOL689omiOq8JU1E8JteYYFyhVtjUdo')
          .send({
            newValue: 'New Value!'
          });

        expect(body).to.have.property('errors');
      });

      it('Should not change option - user has no permission', async() => {
        const { body } = await request(app)
          .put(`/options/${createdOptions[0].key}`)
          .set('Authorization', `Bearer ${users.user.token}`)
          .send({
            newValue: 'New Value!'
          });

        expect(body).to.have.property('errors');
      });

      it('Should change option', async() => {
        const { body } = await request(app)
          .put(`/options/${createdOptions[0].key}`)
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send({
            newValue: 'New Value!'
          });

        createdOptions[0].value = 'New Value!';

        expect(body.data.key).to.equal(createdOptions[0].key);
        expect(body.data.value).to.equal(createdOptions[0].value);

        // response should not contain _id and __v
        expect(body.data).not.to.have.property('_id');
        expect(body.data).not.to.have.property('__v');
      });
    });
  });
};

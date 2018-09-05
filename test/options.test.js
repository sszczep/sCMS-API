'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

// created options using POST /options request, will be filled later
let createdOptions = [];

// options which will be created
const optionsToCreate = [
  {
    key: 'Option1',
    value: 'Value1'
  },
  {
    key: 'Option2',
    value: 'Value2'
  }
];

module.exports = tokens => {
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
      it('Shouldn\'t create new option - some required fields are empty', async() => {
        const { body } = await request(app)
          .post('/options')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t create new option - outdated/wrong token', async() => {
        const { body } = await request(app)
          .post('/options')
          .set('Authorization', 'Bearer blah_blah_blah')
          .send(optionsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t create new option - user has no permission', async() => {
        const { body } = await request(app)
          .post('/options')
          .set('Authorization', `Bearer ${tokens.user}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it(`Should create ${optionsToCreate.length} new options`, async() => {
        const publish = async data => {
          const { body } = await request(app)
            .post('/options')
            .set('Authorization', `Bearer ${tokens.admin}`)
            .send(data);

          expect(body.data.key).to.equal(data.key);
          expect(body.data.value).to.equal(data.value);

          return body.data;
        };

        const promises = optionsToCreate.map(elem => publish(elem));

        createdOptions = await Promise.all(promises);
      });

      it('Shouldn\'t create new option - there is an option with this title', async() => {
        const { body } = await request(app)
          .post('/options')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .send(optionsToCreate[0]);

        expect(body).to.have.property('errors');
      });
    });

    describe('#GET /options/:key', () => {
      it('Shouldn\'t get option - there is no option with given key', async() => {
        const { body } = await request(app)
          .get('/options/NOT_EXISTING')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should get option', async() => {
        const { body } = await request(app)
          .get(`/options/${createdOptions[0]._id}`)
          .send();

        expect(JSON.stringify(body.data)).to.equal(JSON.stringify(createdOptions[0]));
      });
    });

    describe('#GET /options', () => {
      it('Should get list of options', async() => {
        const { body } = await request(app)
          .get('/options')
          .send();

        expect(JSON.stringify(body.data)).to.equal(JSON.stringify(createdOptions));
      });
    });

    describe('#DELTE /options/:key', () => {
      it('Shouldn\'t delete option - outdated/wrong token', async() => {
        const { body } = await request(app)
          .delete(`/options/${createdOptions[0]._id}`)
          .set('Authorization', 'Bearer blah_blah_blah')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t delete option - no option with given key', async() => {
        const { body } = await request(app)
          .delete('/options/NOT_EXISTING')
          .set('Authorization', `Bearer ${tokens.admin}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t delete option - user has no permission', async() => {
        const { body } = await request(app)
          .delete(`/options/${createdOptions[0]._id}`)
          .set('Authorization', `Bearer ${tokens.user}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should delete option', async() => {
        const { body } = await request(app)
          .delete(`/options/${createdOptions[0]._id}`)
          .set('Authorization', `Bearer ${tokens.admin}`)
          .send();

        expect(Object.keys(body).length).to.equal(0);
      });
    });

    describe('#PUT /options/:key', () => {
      it('Shouldn\'t change option - outdated/wrong token', async() => {
        const { body } = await request(app)
          .put(`/options/${createdOptions[1]._id}`)
          .set('Authorization', 'Bearer blah_blah_blah')
          .send({
            newValue: 'New Value!'
          });

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t change option - user has no permission', async() => {
        const { body } = await request(app)
          .put(`/options/${createdOptions[1]._id}`)
          .set('Authorization', `Bearer ${tokens.user}`)
          .send({
            newValue: 'New Value!'
          });

        expect(body).to.have.property('errors');
      });

      it('Should change option', async() => {
        const { body } = await request(app)
          .put(`/options/${createdOptions[1]._id}`)
          .set('Authorization', `Bearer ${tokens.admin}`)
          .send({
            newValue: 'New Value!'
          });

        createdOptions[1].value = 'New Value!';

        expect(JSON.stringify(body.data)).to.equal(JSON.stringify(createdOptions[1]));
      });
    });
  });
};

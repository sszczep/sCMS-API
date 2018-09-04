'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

module.exports = posts => {
  describe('Testing /autocomplete', () => {
    describe('#GET /autocomplete/:phrase', () => {
      it('Shouldn\'t return data - no phrase', async() => {
        const { body } = await request(app)
          .get('/autocomplete')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t return data - phrase too short', async() => {
        const { body } = await request(app)
          .get('/autocomplete/Te')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t return data - phrase not occuring anywhere', async() => {
        const { body } = await request(app)
          .get('/autocomplete/You won\'t find me')
          .send();

        expect(body.data.length).to.equal(0);
      });

      it('Should return one post', async() => {
        const { body } = await request(app)
          .get(`/autocomplete/${posts[0].title}`)
          .send();

        expect(body.data.length).to.equal(1);

        expect(body.data[0].name).to.equal(posts[0].title);
        expect(body.data[0].subtext).to.equal(posts[0].description);
        expect(body.data[0].avatar).to.equal(posts[0].thumbnail);
        expect(body.data[0].url).to.equal(posts[0].friendlyUrl);
      });

      it('Should return five posts', async() => {
        const { body } = await request(app)
          .get(`/autocomplete/Testing posts`)
          .send();

        expect(body.data.length).to.equal(5);

        body.data.reverse();

        for(let i = 0; i < body.data.length; i++) {
          expect(body.data[i].name).to.equal(posts[i].title);
          expect(body.data[i].subtext).to.equal(posts[i].description);
          expect(body.data[i].avatar).to.equal(posts[i].thumbnail);
          expect(body.data[i].url).to.equal(posts[i].friendlyUrl);
        }
      });
    });
  });
};

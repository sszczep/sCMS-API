'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

const compareResponseToPost = (response, post) => {
  expect(response.name).to.equal(post.title);
  expect(response.subtext).to.equal(post.description);
  expect(response.avatar).to.equal(post.thumbnail);
  expect(response.url).to.equal(post.friendlyUrl);
};

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

        compareResponseToPost(body.data[0], posts[0]);
      });

      it('Should return five posts', async() => {
        const { body } = await request(app)
          .get(`/autocomplete/Testing posts`)
          .send();

        expect(body.data.length).to.equal(5);

        body.data.reverse();

        for(let i = 0; i < body.data.length; i++) {
          compareResponseToPost(body.data[i], posts[i]);
        }
      });
    });
  });
};

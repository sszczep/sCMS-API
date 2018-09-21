'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

module.exports = (posts, users) => {
  describe('Testing /autocomplete', () => {
    describe('#GET /autocomplete/:phrase', () => {
      it('Should not return data - no phrase', async() => {
        const { body } = await request(app)
          .get('/autocomplete')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not return data - phrase too short', async() => {
        const { body } = await request(app)
          .get('/autocomplete/Te')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not return data - phrase not occuring anywhere', async() => {
        const { body } = await request(app)
          .get('/autocomplete/You won\'t find me')
          .send();

        expect(body.data.posts.length).to.equal(0);
      });

      it('Should return one post', async() => {
        const { body } = await request(app)
          .get(`/autocomplete/${posts[0].title}`)
          .send();

        expect(body.data.posts.length).to.equal(1);

        expect(body.data.posts[0].title).to.equal(posts[0].title);
        expect(body.data.posts[0].description).to.equal(posts[0].description);
        expect(body.data.posts[0].thumbnail).to.equal(posts[0].thumbnail);
        expect(body.data.posts[0].url).to.equal(posts[0].url);

        // author testing
        expect(body.data.posts[0].author.fullname).to.equal(users.blogger.fullname);

        // response should not contain _id and __v
        expect(body.data.posts[0]).not.to.have.property('_id');
        expect(body.data.posts[0]).not.to.have.property('__v');
        expect(body.data.posts[0].author).not.to.have.property('_id');
        expect(body.data.posts[0].author).not.to.have.property('__v');
      });

      it(`Should return ${posts.length} posts and 1 user`, async() => {
        const { body } = await request(app)
          .get(`/autocomplete/test`)
          .send();

        expect(body.data.posts.length).to.equal(posts.length);
        expect(body.data.users.length).to.equal(1);

        body.data.posts.reverse();

        // testing posts
        for(let i = 0; i < body.data.length; i++) {
          expect(body.data.posts[i].title).to.equal(posts[i].title);
          expect(body.data.posts[i].description).to.equal(posts[i].description);
          expect(body.data.posts[i].thumbnail).to.equal(posts[i].thumbnail);
          expect(body.data.posts[i].url).to.equal(posts[i].url);

          // author testing
          expect(body.data.posts[i].author.fullname).to.equal(users.blogger.fullname);

          // response should not contain _id and __v
          expect(body.data.posts[i]).not.to.have.property('_id');
          expect(body.data.posts[i]).not.to.have.property('__v');
          expect(body.data.posts[i].author).not.to.have.property('_id');
          expect(body.data.posts[i].author).not.to.have.property('__v');
        }

        // testing users
        expect(body.data.users[0].fullname).to.equal(users.user.fullname);
        expect(body.data.users[0].username).to.equal(users.user.username);
        expect(body.data.users[0].avatar).to.equal(users.user.avatar);

        // response should not contain _id and __v
        expect(body.data.users[0]).not.to.have.property('_id');
        expect(body.data.users[0]).not.to.have.property('__v');
      });
    });
  });
};

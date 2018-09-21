'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

// created posts using POST /posts request, will be filled later
let createdPosts = [];

module.exports = (postsToCreate, users) => new Promise(resolve => {
  describe('Testing /posts', () => {
    describe('#GET /posts/count', () => {
      it('Should return number of posts equal to 0', async() => {
        const { body } = await request(app)
          .get('/posts/count')
          .send();

        expect(body.data.count).to.equal(0);
      });
    });

    describe('#POST /posts', () => {
      it('Should not publish new post - empty payload', async() => {
        const { body } = await request(app)
          .post('/posts')
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not publish new post - some required fields are empty', async() => {
        const { body } = await request(app)
          .post('/posts')
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send({
            ...postsToCreate[0],
            title: undefined
          });

        expect(body).to.have.property('errors');
      });

      it('Should not publish new post - no Authorization Header', async() => {
        const { body } = await request(app)
          .post('/posts')
          .send(postsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it('Should not publish new post - invalid token', async() => {
        const { body } = await request(app)
          .post('/posts')
          .set('Authorization', 'Bearer blablabla')
          .send(postsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it('Should not publish new post - outdated/wrong token', async() => {
        const { body } = await request(app)
          .post('/posts')
          .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzY1MTI4NjMsInVzZXJuYW1lIjoidXNlciIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNTM2NTEyMjYzfQ.jAWMZ8x-cXQfiOL689omiOq8JU1E8JteYYFyhVtjUdo')
          .send(postsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it('Should not publish new post - user has no permission', async() => {
        const { body } = await request(app)
          .post('/posts')
          .set('Authorization', `Bearer ${users.user.token}`)
          .send(postsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it(`Should publish ${postsToCreate.length} new posts`, async() => {
        const publish = async data => {
          const { body } = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${users.blogger.token}`)
            .send(data);

          expect(body.data.title).to.equal(data.title);
          expect(body.data.description).to.equal(data.description);
          expect(body.data.content).to.equal(data.content);
          expect(body.data.thumbnail).to.equal(data.thumbnail);
          expect(new Date(body.data.created).getTime()).to.equal(new Date(data.created).getTime());

          expect(body.data).to.have.property('url');

          // author testing
          expect(body.data.author.fullname).to.equal(users.blogger.fullname);
          expect(body.data.author.username).to.equal(users.blogger.username);

          // response should not contain _id and __v
          expect(body.data).not.to.have.property('_id');
          expect(body.data).not.to.have.property('__v');
          expect(body.data.author).not.to.have.property('_id');
          expect(body.data.author).not.to.have.property('__v');

          return body.data;
        };

        const promises = postsToCreate.map(elem => publish(elem));

        createdPosts = await Promise.all(promises);
      });

      it('Should not publish new post - there is a post with this title', async() => {
        const { body } = await request(app)
          .post('/posts')
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send(postsToCreate[0]);

        expect(body).to.have.property('errors');
      });
    });

    describe('#GET /posts/count', () => {
      it(`Should return number of posts equal to ${postsToCreate.length}`, async() => {
        const { body } = await request(app)
          .get('/posts/count')
          .send();

        expect(body.data.count).to.equal(postsToCreate.length);
      });
    });

    describe('#GET /posts/:url', () => {
      it('Should not get post by url - there is no post with given url', async() => {
        const { body } = await request(app)
          .get('/posts/you-wont-find-me')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should get post by url', async() => {
        const { body } = await request(app)
          .get(`/posts/${createdPosts[0].url}`)
          .send();

        expect(body.data.title).to.equal(createdPosts[0].title);
        expect(body.data.description).to.equal(createdPosts[0].description);
        expect(body.data.content).to.equal(createdPosts[0].content);
        expect(body.data.thumbnail).to.equal(createdPosts[0].thumbnail);
        expect(new Date(body.data.created).getTime()).to.equal(new Date(createdPosts[0].created).getTime());
        expect(body.data.url).to.equal(createdPosts[0].url);

        // author testing
        expect(body.data.author.fullname).to.equal(users.blogger.fullname);
        expect(body.data.author.username).to.equal(users.blogger.username);

        // response should not contain _id and __v
        expect(body.data).not.to.have.property('_id');
        expect(body.data).not.to.have.property('__v');
        expect(body.data.author).not.to.have.property('_id');
        expect(body.data.author).not.to.have.property('__v');
      });
    });

    describe('#GET /posts', () => {
      it('Should get list of posts with their contents - preview = false', async() => {
        const { body } = await request(app)
          .get('/posts')
          .send();

        body.data.reverse();

        for(let i = 0; i < body.data.length; i++) {
          expect(body.data[i].title).to.equal(createdPosts[i].title);
          expect(body.data[i].description).to.equal(createdPosts[i].description);
          expect(body.data[i].content).to.equal(createdPosts[i].content);
          expect(body.data[i].thumbnail).to.equal(createdPosts[i].thumbnail);
          expect(new Date(body.data[i].created).getTime()).to.equal(new Date(createdPosts[i].created).getTime());
          expect(body.data[i].url).to.equal(createdPosts[i].url);

          // author testing
          expect(body.data[i].author.fullname).to.equal(users.blogger.fullname);
          expect(body.data[i].author.username).to.equal(users.blogger.username);

          // response should not contain _id and __v
          expect(body.data[i]).not.to.have.property('_id');
          expect(body.data[i]).not.to.have.property('__v');
          expect(body.data[i].author).not.to.have.property('_id');
          expect(body.data[i].author).not.to.have.property('__v');
        }
      });

      it('Should get list of posts without their contents - preview = true', async() => {
        const { body } = await request(app)
          .get('/posts?preview=true')
          .send();

        body.data.reverse();

        for(let i = 0; i < body.data.length; i++) {
          expect(body.data[i]).not.to.have.property('content');

          expect(body.data[i].title).to.equal(createdPosts[i].title);
          expect(body.data[i].description).to.equal(createdPosts[i].description);
          expect(body.data[i].thumbnail).to.equal(createdPosts[i].thumbnail);
          expect(new Date(body.data[i].created).getTime()).to.equal(new Date(createdPosts[i].created).getTime());
          expect(body.data[i].url).to.equal(createdPosts[i].url);

          // author testing
          expect(body.data[i].author.fullname).to.equal(users.blogger.fullname);
          expect(body.data[i].author.username).to.equal(users.blogger.username);

          // response should not contain _id and __v
          expect(body.data[i]).not.to.have.property('_id');
          expect(body.data[i]).not.to.have.property('__v');
          expect(body.data[i].author).not.to.have.property('_id');
          expect(body.data[i].author).not.to.have.property('__v');
        }
      });

      // should return posts with titles [Testing posts 5, Testing posts 4, Testing posts 3]
      it('Should get three latest posts - limit = 3', async() => {
        const { body } = await request(app)
          .get('/posts?limit=3')
          .send();

        // reverse array (from oldest to latest)
        body.data.reverse();

        const toCompare = createdPosts.slice(2);

        for(let i = 0; i < body.data.length; i++) {
          expect(body.data[i].title).to.equal(toCompare[i].title);
          expect(body.data[i].description).to.equal(toCompare[i].description);
          expect(body.data[i].content).to.equal(toCompare[i].content);
          expect(body.data[i].thumbnail).to.equal(toCompare[i].thumbnail);
          expect(new Date(body.data[i].created).getTime()).to.equal(new Date(toCompare[i].created).getTime());
          expect(body.data[i].url).to.equal(toCompare[i].url);

          // author testing
          expect(body.data[i].author.fullname).to.equal(users.blogger.fullname);
          expect(body.data[i].author.username).to.equal(users.blogger.username);

          // response should not contain _id and __v
          expect(body.data[i]).not.to.have.property('_id');
          expect(body.data[i]).not.to.have.property('__v');
          expect(body.data[i].author).not.to.have.property('_id');
          expect(body.data[i].author).not.to.have.property('__v');
        }
      });

      // should return posts with titles [Testing posts 1, Testing posts 2]
      it('Should get two oldest posts - limit = 2, offset = 3', async() => {
        const { body } = await request(app)
          .get('/posts?limit=2&offset=3')
          .send();

        // reverse array (from oldest to latest)
        body.data.reverse();

        const toCompare = createdPosts.slice(0, 2);

        for(let i = 0; i < body.data.length; i++) {
          expect(body.data[i].title).to.equal(toCompare[i].title);
          expect(body.data[i].description).to.equal(toCompare[i].description);
          expect(body.data[i].content).to.equal(toCompare[i].content);
          expect(body.data[i].thumbnail).to.equal(toCompare[i].thumbnail);
          expect(new Date(body.data[i].created).getTime()).to.equal(new Date(toCompare[i].created).getTime());
          expect(body.data[i].url).to.equal(toCompare[i].url);

          // author testing
          expect(body.data[i].author.fullname).to.equal(users.blogger.fullname);
          expect(body.data[i].author.username).to.equal(users.blogger.username);

          // response should not contain _id and __v
          expect(body.data[i]).not.to.have.property('_id');
          expect(body.data[i]).not.to.have.property('__v');
          expect(body.data[i].author).not.to.have.property('_id');
          expect(body.data[i].author).not.to.have.property('__v');
        }
      });
    });
    describe('#DELETE /posts/:url', () => {
      it('Should not delete post - no Authorization Header', async() => {
        const { body } = await request(app)
          .delete(`/posts/${createdPosts[0].url}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not delete post - invalid token', async() => {
        const { body } = await request(app)
          .delete(`/posts/${createdPosts[0].url}`)
          .set('Authorization', 'Bearer blablabla')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not delete post - outdated/wrong token', async() => {
        const { body } = await request(app)
          .delete(`/posts/${createdPosts[0].url}`)
          .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzY1MTI4NjMsInVzZXJuYW1lIjoidXNlciIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNTM2NTEyMjYzfQ.jAWMZ8x-cXQfiOL689omiOq8JU1E8JteYYFyhVtjUdo')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not delete post - user has no permission', async() => {
        const { body } = await request(app)
          .delete(`/posts/${createdPosts[0].url}`)
          .set('Authorization', `Bearer ${users.user.token}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should not delete post - there is no post with given url', async() => {
        const { body } = await request(app)
          .delete('/posts/i-dont-exist')
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should delete post - it is blogger\'s post', async() => {
        const { body } = await request(app)
          .delete(`/posts/${createdPosts[0].url}`)
          .set('Authorization', `Bearer ${users.blogger.token}`)
          .send();

        expect(Object.keys(body).length).to.equal(0);

        createdPosts.splice(0, 1);
      });

      it('Should delete post - admin has a permission to do that', async() => {
        const { body } = await request(app)
          .delete(`/posts/${createdPosts[0].url}`)
          .set('Authorization', `Bearer ${users.admin.token}`)
          .send();

        expect(Object.keys(body).length).to.equal(0);

        createdPosts.splice(0, 1);

        resolve(createdPosts);
      });
    });
  });
});

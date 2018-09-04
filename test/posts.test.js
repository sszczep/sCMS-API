'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

// created posts using POST /posts request, will be filled later
let createdPosts = [];

// posts which will be created
const postsToCreate = [
  {
    title: 'Testing posts 1',
    description: 'Short description 1',
    author: 'Sebastian Szczepański',
    content: 'Lorem ipsum...',
    thumbnail: '/images/test.png',
    created: Date.now()
  },
  {
    title: 'Testing posts 2',
    description: 'Short description 2',
    author: 'Sebastian Szczepański',
    content: 'Lorem ipsum...',
    thumbnail: '/images/test.png',
    created: Date.now() + 1
  },
  {
    title: 'Testing posts 3',
    description: 'Short description 3',
    author: 'Sebastian Szczepański',
    content: 'Lorem ipsum...',
    thumbnail: '/images/test.png',
    created: Date.now() + 2
  },
  {
    title: 'Testing posts 4',
    description: 'Short description 4',
    author: 'Sebastian Szczepański',
    content: 'Lorem ipsum...',
    thumbnail: '/images/test.png',
    created: Date.now() + 3
  },
  {
    title: 'Testing posts 5',
    description: 'Short description 5',
    author: 'Sebastian Szczepański',
    content: 'Lorem ipsum...',
    thumbnail: '/images/test.png',
    created: Date.now() + 4
  }
];

module.exports = token => new Promise(resolve => {
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
      it('Shouldn\'t publish new post - some required fields are empty', async() => {
        const { body } = await request(app)
          .post('/posts')
          .set('Authorization', `Bearer ${token}`)
          .send();

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t publish new post - outdated/wrong token', async() => {
        const { body } = await request(app)
          .post('/posts')
          .set('Authorization', 'Bearer blah_blah_blah')
          .send();

        expect(body).to.have.property('errors');
      });

      it(`Should publish ${postsToCreate.length} new posts`, async() => {
        const publish = async data => {
          const { body } = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .send(data);

          expect(body.data.title).to.equal(data.title);
          expect(body.data.description).to.equal(data.description);
          expect(body.data.author).to.equal(data.author);
          expect(body.data.content).to.equal(data.content);
          expect(body.data.thumbnail).to.equal(data.thumbnail);
          expect(new Date(body.data.created).getTime()).to.equal(data.created);

          return body.data;
        };

        const promises = postsToCreate.map(elem => publish(elem));

        createdPosts = await Promise.all(promises);

        resolve(createdPosts);
      });

      it('Shouldn\'t publish new post - there is a post with this title', async() => {
        const { body } = await request(app)
          .post('/posts')
          .set('Authorization', `Bearer ${token}`)
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

    describe('#GET /posts/:id', () => {
      it('Shouldn\'t get post - invalid id', async() => {
        const { body } = await request(app)
          .get('/posts/invalidID')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t get post - there is no post with given id', async() => {
        const { body } = await request(app)
          .get('/posts/5b8bd1658087c227e50a09d9')
          .send();

        expect(body).to.have.property('errors');
      });

      it('Should get post', async() => {
        const { body } = await request(app)
          .get(`/posts/${createdPosts[0]._id}`)
          .send();

        expect(JSON.stringify(body.data)).to.equal(JSON.stringify(createdPosts[0]));
      });
    });

    describe('#GET /posts', () => {
      it('Should get list of posts with their contents - preview = false', async() => {
        const { body } = await request(app)
          .get('/posts')
          .send();

        body.data.reverse();

        expect(JSON.stringify(body.data)).to.equal(JSON.stringify(createdPosts));
      });

      it('Should get list of posts without their contents - preview = true', async() => {
        const { body } = await request(app)
          .get('/posts?preview=true')
          .send();

        body.data.reverse();

        const postsWithoutContent = createdPosts.map(post => {
          const newPost = { ...post };

          newPost.content = undefined;

          return newPost;
        });

        expect(JSON.stringify(body.data)).to.equal(JSON.stringify(postsWithoutContent));
      });

      // should return posts with titles [Testing posts 5, Testing posts 4, Testing posts 3]
      it('Should get three latest posts - limit = 3', async() => {
        const { body } = await request(app)
          .get('/posts?limit=3')
          .send();

        // reverse array (from oldest to latest)
        body.data.reverse();

        const toCompare = createdPosts.slice(2);

        expect(JSON.stringify(body.data)).to.equal(JSON.stringify(toCompare));
      });

      // should return posts with titles [Testing posts 1, Testing posts 2]
      it('Should get two oldest posts - limit = 2, offset = 3', async() => {
        const { body } = await request(app)
          .get('/posts?limit=2&offset=3')
          .send();

        // reverse array (from oldest to latest)
        body.data.reverse();

        const toCompare = createdPosts.slice(0, 2);

        expect(JSON.stringify(body.data)).to.equal(JSON.stringify(toCompare));
      });
    });
  });
});

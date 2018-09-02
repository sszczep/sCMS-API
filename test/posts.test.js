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

const compareObjectsProperties = (obj1, obj2) => {
  const commonProperties = Object.keys(obj1).filter(prop => obj1.hasOwnProperty(prop) && obj2.hasOwnProperty(prop));

  for(const prop of commonProperties) {
    if(prop === 'created') {
      // compare dates
      expect(new Date(obj1.created).getTime()).to.equal(new Date(obj2.created).getTime());
    } else {
      expect(obj1[prop]).to.equal(obj2[prop]);
    }
  }
};

module.exports = token => {
  describe('Testing /posts', () => {
    describe('#GET /posts/count', () => {
      it('Should return number of posts equal to 0', done => {
        request(app)
          .get('/posts/count')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body.data.count).to.equal(0);

            return done();
          });
      });
    });

    describe('#POST /posts', () => {
      it('Shouldn\'t publish new post - some required fields are empty', done => {
        request(app)
          .post('/posts')
          .set('Authorization', `Bearer ${token}`)
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');

            return done();
          });
      });

      it('Shouldn\'t publish new post - outdated/wrong token', done => {
        request(app)
          .post('/posts')
          .set('Authorization', 'Bearer blah_blah_blah')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');

            return done();
          });
      });

      it(`Should publish ${postsToCreate.length} new posts`, done => {
        const publish = data => new Promise((resolve, reject) => {
          request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((err, { body }) => {
              if(err) {
                return reject(err);
              }

              compareObjectsProperties(body.data, data);

              return resolve(body.data);
            });
        });

        const promises = postsToCreate.map(elem => publish(elem));

        Promise.all(promises)
          .then(posts => {
            // sort posts by date of creation
            createdPosts = posts.sort((one, two) => two.created - one.created);

            return done();
          })
          .catch(err => done(err));
      });

      it('Shouldn\'t publish new post - there is a post with this title', done => {
        request(app)
          .post('/posts')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'Testing posts 1',
            description: 'Short description 1',
            author: 'Sebastian Szczepański',
            content: 'Can i get published? :(',
            thumbnail: '/images/test1.png'
          })
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');

            return done();
          });
      });
    });

    describe('#GET /posts/count', () => {
      it(`Should return number of posts equal to ${postsToCreate.length}`, done => {
        request(app)
          .get('/posts/count')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body.data.count).to.equal(postsToCreate.length);

            return done();
          });
      });
    });

    describe('#GET /posts/:id', () => {
      it('Shouldn\'t get post - invalid id', done => {
        request(app)
          .get('/posts/invalidID')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');

            return done();
          });
      });

      it('Shouldn\'t get post - there is no post with given id', done => {
        request(app)
          .get('/posts/5b8bd1658087c227e50a09d9')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body).to.have.property('errors');

            return done();
          });
      });

      it('Should get post', done => {
        request(app)
          .get(`/posts/${createdPosts[0]._id}`)
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            compareObjectsProperties(body.data, createdPosts[0]);

            return done();
          });
      });
    });

    describe('#GET /posts', () => {
      it('Should get list of posts with their contents - preview = false', done => {
        request(app)
          .get('/posts')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            // reverse array (from oldest to latest)
            body.data.reverse();

            expect(body.data.length).to.equal(createdPosts.length);

            for(let i = 0; i < createdPosts.length; i++) {
              expect(body.data[i]).to.have.property('content');
              compareObjectsProperties(body.data[i], createdPosts[i]);
            }

            return done();
          });
      });

      it('Should get list of posts without their contents - preview = true', done => {
        request(app)
          .get('/posts?preview=true')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            // reverse array (from oldest to latest)
            body.data.reverse();

            expect(body.data.length).to.equal(createdPosts.length);

            for(let i = 0; i < createdPosts.length; i++) {
              expect(body.data[i]).not.to.have.property('content');
              compareObjectsProperties(body.data[i], createdPosts[i]);
            }

            return done();
          });
      });

      // should return posts with titles [Testing posts 5, Testing posts 4, Testing posts 3]
      it('Should get three latest posts - limit = 3', done => {
        request(app)
          .get('/posts?limit=3')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            // reverse array (from oldest to latest)
            body.data.reverse();

            const toCompare = createdPosts.slice(2);

            expect(body.data.length).to.equal(3);

            for(let i = 0; i < 3; i++) {
              compareObjectsProperties(body.data[i], toCompare[i]);
            }

            return done();
          });
      });

      // should return posts with titles [Testing posts 1, Testing posts 2]
      it('Should get two oldest posts - limit = 2, offset = 3', done => {
        request(app)
          .get('/posts?limit=2&offset=3')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            // reverse array (from oldest to latest)
            body.data.reverse();

            const toCompare = createdPosts.slice(0, 2);

            expect(body.data.length).to.equal(2);
            for(let i = 0; i < 2; i++) {
              compareObjectsProperties(body.data[i], toCompare[i]);
            }

            return done();
          });
      });
    });
  });
};

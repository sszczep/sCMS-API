'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

module.exports = token => {
  // created posts using POST /posts request, will be filled later
  let createdPosts = [];

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
            done();
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
            done();
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
            done();
          });
      });

      it('Should publish 5 new posts', done => {
        // added created to ensure that their order by date is correct
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

        const publish = data => new Promise((resolve, reject) => {
          request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .end((err, { body }) => {
              if(err) {
                return reject(err);
              }

              expect(body.data.title).to.equal(data.title);

              return resolve(body.data);
            });
        });

        const promises = postsToCreate.map(elem => publish(elem));

        Promise.all(promises)
          .then(posts => {
            // sort posts by date of creation
            createdPosts = posts.sort((one, two) => two.created - one.created);
            done();
          })
          .catch(err => {
            done(err);
          });
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
            done();
          });
      });
    });

    describe('#GET /posts/count', () => {
      it('Should return number of posts equal to 5', done => {
        request(app)
          .get('/posts/count')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body.data.count).to.equal(5);
            done();
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
            done();
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
            done();
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

            expect(body.data.title).to.equal(createdPosts[0].title);
            done();
          });
      });
    });

    describe('#GET /posts', () => {
      it('Should get list of posts with their contents', done => {
        request(app)
          .get('/posts')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body.data.length).to.equal(createdPosts.length);
            expect(body.data[0]).to.have.property('content');
            done();
          });
      });

      it('Should get list of posts without their contents', done => {
        request(app)
          .get('/posts?preview=true')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body.data.length).to.equal(createdPosts.length);
            expect(body.data[0]).not.to.have.property('content');
            done();
          });
      });

      it('Should get three latest posts - limit = 3', done => {
        request(app)
          .get('/posts?limit=3')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body.data.length).to.equal(3);
            for(let i = 0; i < 3; i++) {
              const post = body.data[i];

              // returned posts should be the latest ones
              expect(post._id).to.equal(createdPosts[4 - i]._id);
            }
            done();
          });
      });

      it('Should get two oldest posts - limit = 2, offset = 3', done => {
        request(app)
          .get('/posts?limit=2&offset=3')
          .send()
          .end((err, { body }) => {
            if(err) {
              return done(err);
            }

            expect(body.data.length).to.equal(2);
            for(let i = 0; i < 2; i++) {
              const post = body.data[i];

              // returned posts should be the oldest ones
              expect(post._id).to.equal(createdPosts[1 - i]._id);
            }
            done();
          });
      });
    });
  });
};

'use strict';

const app = require('../app.js');
const { expect } = require('chai');
const request = require('supertest');

const socialsToCreate = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com',
    icon: 'fab fa-facebook'
  },
  {
    name: 'Github',
    url: 'https://www.github.com',
    icon: 'fab fa-github'
  }
];

module.exports = token => {
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
      it('Shouldn\'t create new social link - no Authorization Header', async() => {
        const { body } = await request(app)
          .post('/socials')
          .send(socialsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t create new social link - wrong/outdater token', async() => {
        const { body } = await request(app)
          .post('/socials')
          .set('Authorization', 'Bearer blah_blah_blah')
          .send(socialsToCreate[0]);

        expect(body).to.have.property('errors');
      });

      it('Shouldn\'t create new social link - some required fields are empty', async() => {
        const { body } = await request(app)
          .post('/socials')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Invalid social link'
          });

        expect(body).to.have.property('errors');
      });

      it(`Should create ${socialsToCreate.length} new social links`, async() => {
        const publish = async data => {
          const { body } = await request(app)
            .post('/socials')
            .set('Authorization', `Bearer ${token}`)
            .send(data);

          body.data._id = undefined;
          body.data.__v = undefined; // eslint-disable-line no-underscore-dangle

          expect(JSON.stringify(body.data)).to.equal(JSON.stringify(data));

          return body;
        };

        const promises = socialsToCreate.map(elem => publish(elem));

        await Promise.all(promises);
      });

      it('Shouldn\'t create new social link - there is a link with given name', async() => {
        const { body } = await request(app)
          .post('/socials')
          .set('Authorization', `Bearer ${token}`)
          .send(socialsToCreate[0]);

        expect(body).to.have.property('errors');
      });
    });

    describe('#GET /socials', () => {
      it('Should return array of social links', async() => {
        const { body } = await request(app)
          .get('/socials')
          .send();

        expect(body.data.length).to.equal(socialsToCreate.length);

        for(const responseLink of body.data) {
          responseLink._id = undefined;
          responseLink.__v = undefined; // eslint-disable-line no-underscore-dangle

          let matched = false;

          for(const link of socialsToCreate) {
            if(responseLink.name === link.name) {
              expect(JSON.stringify(responseLink)).to.equal(JSON.stringify(link));
              matched = true;
            }
          }

          expect(matched).to.equal(true);
        }
      });
    });
  });
};

'use strict';

const express = require('express');
const router = express.Router();
const { body: bodyValidation } = require('express-validator/check');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const isLogged = require('../middlewares/isLogged.js');
const SocialsController = require('../controllers/socials.js');

/**
 * @api {get} /socials Get list of social links
 * @apiName GetSocialLinks
 * @apiGroup Social links
 *
 * @apiSuccess (Success 200) {Object[]} data Array of social links
 * @apiSuccess (Success 200) {String} data.name Name of social link
 * @apiSuccess (Success 200) {String} data.url Url of social link
 * @apiSuccess (Success 200) {String} data.icon Icon for social link
 * @apiSuccess (Success 200) {String} data._id ID of social link
 *
 * @apiUse ErrorObject
 */

router.get('/', async(req, res, next) => {
  try {
    const data = await SocialsController.getSocialLinks();

    return res
      .status(200)
      .json({
        data
      });
  } catch(err) {
    return next(err);
  }
});

// all requests below should require authentication

router.use(isLogged);

/**
 * @api {post} /socials Create new social link
 * @apiName CreateSocialLink
 * @apiGroup Social links
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (JSON Payload) {String} name Name of social link
 * @apiParam (JSON Payload) {String} url Url of social link
 * @apiParam (JSON Payload) {String} icon Icon of social link
 *
 * @apiSuccess (Success 201) {Object} data
 * @apiSuccess (Success 201) {String} data.name Name of social link
 * @apiSuccess (Success 201) {String} data.url Url of social link
 * @apiSuccess (Success 201) {String} data.icon Icon of social link
 * @apiSuccess (Success 201) {String} data._id ID of social link
 *
 * @apiUse ErrorObject
 */

router.post('/',
  [
    bodyValidation('name')
      .exists(),
    bodyValidation('url')
      .isURL(),
    bodyValidation('icon')
      .exists()
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    try {
      const data = await SocialsController.createSocialLink(req.body);

      return res
        .status(201)
        .json({
          data
        });
    } catch(err) {
      return next(err);
    }
  });

module.exports = router;

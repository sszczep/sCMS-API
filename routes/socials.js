'use strict';

const express = require('express');
const router = express.Router();
const { body: bodyValidation } = require('express-validator/check');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const isLogged = require('../middlewares/isLogged.js');
const hasPermissions = require('../middlewares/hasPermissions.js');
const SocialsController = require('../controllers/socials.js');

/**
 * @api {get} /socials Get list of social links
 * @apiName GetSocialLinks
 * @apiGroup Social links
 *
 * @apiSuccess (Success 200) {Object[]} data Array of social links
 * @apiSuccess (Success 200) {String} data.name Name
 * @apiSuccess (Success 200) {String} data.url Target Url
 * @apiSuccess (Success 200) {String} data.icon Icon
 *
 * @apiUse ErrorObject
 */

router.get('/', async(req, res, next) => {
  try {
    const data = await SocialsController.getSocialLinks({
      select: '-_id name url icon',
      options: {
        lean: true
      }
    });

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
 * @apiParam (JSON Payload) {String} name Name
 * @apiParam (JSON Payload) {String} url Target Url
 * @apiParam (JSON Payload) {String} icon Icon
 *
 * @apiSuccess (Success 201) {Object} data
 * @apiSuccess (Success 201) {String} data.name Name
 * @apiSuccess (Success 201) {String} data.url Target Url
 * @apiSuccess (Success 201) {String} data.icon Icon
 *
 * @apiUse ErrorObject
 */

router.post('/',
  hasPermissions([ 'createSocialLink' ]),
  [
    bodyValidation('name')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify name'),
    bodyValidation('url')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify url')
      .isURL()
      .withMessage('Given URL is not valid'),
    bodyValidation('icon')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify icon')
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    const { name, url, icon } = req.body;

    try {
      const data = await SocialsController.createSocialLink({
        toCreate: {
          name,
          url,
          icon
        },
        select: '-_id name url icon'
      });

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

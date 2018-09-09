'use strict';

const express = require('express');
const router = express.Router();
const { body: bodyValidation, param: paramValidation } = require('express-validator/check');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const isLogged = require('../middlewares/isLogged.js');
const hasPermissions = require('../middlewares/hasPermissions.js');
const OptionsController = require('../controllers/options.js');
const CustomError = require('../utils/CustomError.js');

/**
 * @api {get} /options Get list of all options
 * @apiName GetOptions
 * @apiGroup Options
 *
 * @apiSuccess (Success 200) {Object[]} data Array of options
 * @apiSuccess (Success 200) {String} data.key Name
 * @apiSuccess (Success 200) {String} data.value Value
 *
 * @apiUse ErrorObject
 */

router.get('/', async(req, res, next) => {
  try {
    const data = await OptionsController.getOptions({
      select: '-_id key value',
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
 * @api {post} /options Create new option
 * @apiName CreateOption
 * @apiGroup Options
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (JSON Payload) {String} key Name
 * @apiParam (JSON Payload) {String} value Value
 *
 * @apiSuccess (Success 201) {Object} data Newly created option
 * @apiSuccess (Success 201) {String} data.key Name
 * @apiSuccess (Success 201) {String} data.value Value
 *
 * @apiUse ErrorObject
 */

router.post('/',
  hasPermissions([ 'createOption' ]),
  [
    bodyValidation('key')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify key'),
    bodyValidation('value')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify value')
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    const { key, value } = req.body;

    try {
      const data = await OptionsController.createOption({
        toCreate: {
          key,
          value
        },
        select: '-_id key value'
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

/**
 * @api {put} /options/:key Update single option
 * @apiName UpdateOption
 * @apiGroup Options
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (Route Parameter) {String} key Name
 * @apiParam (JSON Payload) {String} [newValue] New value
 *
 * @apiSuccess (Success 200) {Object} data Object of updated option
 * @apiSuccess (Success 200) {String} data.key Name
 * @apiSuccess (Success 200) {String} data.value New value
 *
 * @apiUse ErrorObject
 */

router.put('/:key',
  hasPermissions([ 'changeOption' ]),
  [
    paramValidation('key')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify key'),
    bodyValidation('newValue')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify newValue')
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    const { key } = req.params;
    const { newValue } = req.body;

    try {
      const data = await OptionsController.updateOption({
        conditions: {
          key
        },
        update: {
          value: newValue
        },
        select: '-_id key value'
      });

      if(!data) {
        throw new CustomError('NoOptionFound', 'Could not find option with given id', 404);
      }

      return res
        .status(200)
        .json({
          data
        });
    } catch(err) {
      return next(err);
    }
  });

/**
 * @api {delete} /options/:key Delete single option
 * @apiName DeleteOption
 * @apiGroup Options
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (Route Parameter) {String} key Key
 *
 * @apiSuccess (Success 200) {null} null No response data
 *
 * @apiUse ErrorObject
 */

router.delete('/:key',
  hasPermissions([ 'deleteOption' ]),
  paramValidation('key')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('You need to specify key'),
  ValidationErrorHandler,
  async(req, res, next) => {
    const { key } = req.params;

    try {
      const data = await OptionsController.deleteOption({ key });

      if(!data) {
        throw new CustomError('NoOptionFound', 'Could not find option with given id', 404);
      }

      return res.sendStatus(200);
    } catch(err) {
      return next(err);
    }
  });

module.exports = router;

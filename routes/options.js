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
 * @apiSuccess (Success 200) {String} data.key Name of option
 * @apiSuccess (Success 200) {String} data.value Value of option
 * @apiSuccess (Success 200) {String} data._id ID of option
 *
 * @apiUse ErrorObject
 */

router.get('/', async(req, res, next) => {
  try {
    const data = await OptionsController.getOptions();

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
 * @api {get} /options/:_id Get a single option
 * @apiName GetOption
 * @apiGroup Options
 *
 * @apiParam (Route Parameter) {String} _id ID of option
 *
 * @apiSuccess (Success 200) {Object} data Option object
 * @apiSuccess (Success 200) {String} data.key Name of option
 * @apiSuccess (Success 200) {String} data.value Value of option
 * @apiSuccess (Success 200) {String} data._id ID of option
 *
 * @apiUse ErrorObject
 */

router.get('/:_id',
  paramValidation('_id')
    .exists(),
  ValidationErrorHandler,
  async(req, res, next) => {
    const _id = req.params._id;

    try {
      const data = await OptionsController.getOption({ _id });

      if(!data) {
        throw new CustomError('NoOptionFound', 'Couldn\'t find option with given name', 404);
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

// all requests below should require authentication

router.use(isLogged);

/**
 * @api {post} /options Create new option
 * @apiName CreateOption
 * @apiGroup Options
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (JSON Payload) {String} key Name of option
 * @apiParam (JSON Payload) {String} value Value of option
 *
 * @apiSuccess (Success 201) {Object} data Newly created option
 * @apiSuccess (Success 201) {String} data.key Name of option
 * @apiSuccess (Success 201) {String} data.value Value of option
 * @apiSuccess (Success 201) {String} data._id ID of option
 *
 * @apiUse ErrorObject
 */

router.post('/',
  hasPermissions([ 'createOption' ]),
  [
    bodyValidation('key')
      .exists(),
    bodyValidation('value')
      .exists()
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    const body = req.body;

    try {
      const data = await OptionsController.createOption(body);

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
 * @api {put} /options/:_id Update single option
 * @apiName UpdateOption
 * @apiGroup Options
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (Route Parameter) {String} _id ID of option
 * @apiParam (JSON Payload) {String} [newKey] New name of option
 * @apiParam (JSON Payload) {String} [newValue] New value of option
 *
 * @apiSuccess (Success 200) {Object} data Object of updated option
 * @apiSuccess (Success 200) {String} data.key New name of option
 * @apiSuccess (Success 200) {String} data.value New value of option
 * @apiSuccess (Success 200) {String} data._id ID of option
 *
 * @apiUse ErrorObject
 */

router.put('/:_id',
  hasPermissions([ 'changeOption' ]),
  paramValidation('_id')
    .exists(),
  ValidationErrorHandler,
  async(req, res, next) => {
    // first stringify object and then create it back to get rid of undefined properties
    const obj = JSON.parse(JSON.stringify({
      find: {
        _id: req.params._id
      },
      update: {
        key: req.body.newKey,
        value: req.body.newValue
      }
    }));

    try {
      const data = await OptionsController.updateOption(obj);

      if(!data) {
        throw new CustomError('NoOptionFound', 'Couldn\'t find option with given id', 404);
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
 * @api {delete} /options/:_id Delete single option
 * @apiName DeleteOption
 * @apiGroup Options
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (Route Parameter) {String} id ID of option
 *
 * @apiSuccess (Success 200) {null} null No response data
 *
 * @apiUse ErrorObject
 */

router.delete('/:_id',
  hasPermissions([ 'deleteOption' ]),
  paramValidation('_id')
    .exists(),
  ValidationErrorHandler,
  async(req, res, next) => {
    const _id = req.params._id;

    try {
      const data = await OptionsController.deleteOption({ _id });

      if(!data) {
        throw new CustomError('NoOptionFound', 'Couldn\'t find option with given id', 404);
      }

      return res.sendStatus(200);
    } catch(err) {
      return next(err);
    }
  });

module.exports = router;

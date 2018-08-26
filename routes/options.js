const express = require('express');
const router = express.Router();
const CustomError = require('../utils/CustomError.js')

const OptionsController = require('../controllers/options.js')

/**
 * @api {get} /options Get list of all options
 * @apiName GetOptions
 * @apiGroup Options
 *
 * @apiSuccess (Success 200) {Object[]} data Array of options
 * @apiSuccess (Success 200) {String} data.key Name of option
 * @apiSuccess (Success 200) {String} data.value Value of option
 *
 * @apiUse ErrorObject
 */

router.get('/', async (req, res, next) => {
  try {
    const data = await OptionsController.getOptions();
    return res
      .status(200)
      .json({
        data
      })
  } catch(err) {
    return next(err)
  }
})

/**
 * @api {post} /options Create new option
 * @apiName CreateOption
 * @apiGroup Options
 *
 * @apiParam (JSON Payload) {String} key Name of option
 * @apiParam (JSON Payload) {String} value Value of option
 *
 * @apiSuccess (Success 201) {Object} data Newly created option
 * @apiSuccess (Success 201) {String} data.key Name of option
 * @apiSuccess (Success 201) {String} data.value Value of option
 *
 * @apiUse ErrorObject
 */

router.post('/', async (req, res, next) => {
  const body = req.body;

  try {
    const data = await OptionsController.createOption(body);
    return res
      .status(201)
      .json({
        data
      })
  } catch(err) {
    return next(err)
  }
})

/**
 * @api {get} /options/:key Get single option
 * @apiName GetOption
 * @apiGroup Options
 *
 * @apiParam (Route Parameter) {String} key Name of option
 *
 * @apiSuccess (Success 200) {Object} data Option object
 * @apiSuccess (Success 200) {String} data.key Name of option
 * @apiSuccess (Success 200) {String} data.value Value of option
 *
 * @apiUse ErrorObject
 */

router.get('/:key', async (req, res, next) => {
  const key = req.params.key;

  try {
    const data = await OptionsController.getOption(key);
    if(!data) throw(new HTTPError('NoOptionFound', 'Couldn\'t find option with given name', 404))

    return res
      .status(200)
      .json({
        data
      })
  } catch(err) {
    return next(err)
  }
})

/**
 * @api {put} /options/:key Update single option
 * @apiName UpdateOption
 * @apiGroup Options
 *
 * @apiParam (Route Parameter) {String} key Name of option
 * @apiParam (JSON Payload) {String} newKey New name of option
 * @apiParam (JSON Payload) {String} newValue New value of option
 *
 * @apiSuccess (Success 200) {Object} data Object of updated option
 * @apiSuccess (Success 200) {String} data.key New name of option
 * @apiSuccess (Success 200) {String} data.value New value of option
 *
 * @apiUse ErrorObject
 */

router.put('/:key', async (req, res, next) => {
  const obj = {
    key: req.params.key,
    newKey: req.body.newKey,
    newValue: req.body.newValue
  }

  try {
    const data = await OptionsController.updateOption(obj);
    if(!data) throw(new CustomError('NoOptionFound', 'Couldn\'t find option with given name', 404))
    return res
      .status(200)
      .json({
        data
      })
  } catch(err) {
    return next(err)
  }
})

/**
 * @api {delete} /options/:key Delete single option
 * @apiName DeleteOption
 * @apiGroup Options
 *
 * @apiParam (Route Parameter) {String} key Name of option
 *
 * @apiSuccess (Success 200) {null} null No response data
 *
 * @apiUse ErrorObject
 */

router.delete('/:key', async (req, res, next) => {
  const key = req.params.key;

  try {
    const data = await OptionsController.deleteOption(key);
    if(!data) throw(new CustomError('NoOptionFound', 'Couldn\'t find option with given name', 404))
    return res.sendStatus(200)
  } catch(err) {
    return next(err)
  }
})

module.exports = router;

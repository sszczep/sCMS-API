const express = require('express');
const router = express.Router();
const CustomError = require('../utils/CustomError.js')

const PagesController = require('../controllers/pages.js')

/**
 * @api {get} /pages Get list of all pages
 * @apiName GetPages
 * @apiGroup Pages
 *
 * @apiSuccess (Success 200) {Object[]} data Array of pages
 * @apiSuccess (Success 200) {String} data.name Name of pages
 * @apiSuccess (Success 200) {String} data.url Url of pages
 *
 * @apiUse ErrorObject
 */

router.get('/', async (req, res, next) => {
  try {
    const data = await PagesController.getPages();
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
 * @api {post} /pages Create new page
 * @apiName CreatePage
 * @apiGroup Pages
 *
 * @apiParam (JSON Payload) {String} name Name of page
 * @apiParam (JSON Payload) {String} url Url of page
 *
 * @apiSuccess (Success 201) {Object} data Newly created page
 * @apiSuccess (Success 201) {String} data.name Name of page
 * @apiSuccess (Success 201) {String} data.url Url of page
 *
 * @apiUse ErrorObject
 */

router.post('/', async (req, res, next) => {
  const body = req.body;

  try {
    const data = await PagesController.createPage(body);
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
 * @api {put} /pages/:name Update single page
 * @apiName UpdatePage
 * @apiGroup Pages
 *
 * @apiParam (Route Parameter) {String} name Name of page
 * @apiParam (JSON Payload) {String} newName New name of page
 * @apiParam (JSON Payload) {String} newUrl New url of page
 *
 * @apiSuccess (Success 200) {Object} data Object of updated page
 * @apiSuccess (Success 200) {String} data.name New name of page
 * @apiSuccess (Success 200) {String} data.url New url of page
 *
 * @apiUse ErrorObject
 */

router.put('/:name', async (req, res, next) => {
  const obj = {
    name: req.params.name,
    newName: req.body.newName,
    newUrl: req.body.newUrl
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
 * @api {delete} /pages/:name Delete single page
 * @apiName DeletePage
 * @apiGroup Pages
 *
 * @apiParam (Route Parameter) {String} name Name of page
 *
 * @apiSuccess (Success 200) {null} null No response data
 *
 * @apiUse ErrorObject
 */

router.delete('/:name', async (req, res, next) => {
  const name = req.params.name;

  try {
    const data = await PagesController.deletePage(name);
    if(!data) throw(new CustomError('NoPageFound', 'No page with given name', 404))
    return res.sendStatus(200)
  } catch(err) {
    return next(err)
  }
})

module.exports = router;

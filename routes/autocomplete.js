'use strict';

const express = require('express');
const router = express.Router();
const { param: paramValidation } = require('express-validator/check');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const PostsController = require('../controllers/posts.js');

/**
 * @api {get} /autocomplete/:phrase Get list of all users/posts containing given phrase
 * @apiName GetContainingPhrase
 * @apiGroup Autocomplete
 *
 * @apiParam (Route Parameter) {String{3..}} phrase Phrase to look for
 *
 * @apiSuccess (Success 200) {Object[]} data Array of entries
 * @apiSuccess (Success 200) {String} data.name Name of entry
 * @apiSuccess (Success 200) {String} data.subtext Subtext of entry
 * @apiSuccess (Success 200) {String} data.avatar Avatar of entry (avatar of user or thumbnail of post)
 * @apiSuccess (Success 200) {String} data.url Url of entry
 *
 * @apiUse ErrorObject
 */

router.get('/:phrase?',
  paramValidation('phrase')
    .isLength({ min: 3 })
    .withMessage('Phrase must be longer than 3 characters')
    .trim(),
  ValidationErrorHandler,
  async(req, res, next) => {
    try {
      const phrase = req.params.phrase;

      const data = await PostsController.findContaining(phrase);
      const results = [];

      for(const item of data) {
        results.push({
          name: item.title,
          subtext: item.previewText,
          avatar: item.thumbnail,
          url: item.friendlyUrl
        });
      }

      return res
        .status(200)
        .json({
          data: results
        });
    } catch(err) {
      return next(err);
    }
  });

module.exports = router;

'use strict';

const express = require('express');
const router = express.Router();
const { param: paramValidation } = require('express-validator/check');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const PostController = require('../controllers/posts.js');
const UserController = require('../controllers/users.js');

/**
 * @api {get} /autocomplete/:phrase Get list of users/posts containing given phrase (search is limited to 5 posts and 5 users)
 * @apiName GetContainingPhrase
 * @apiGroup Autocomplete
 *
 * @apiParam (Route Parameter) {String{3..}} phrase Phrase to look for
 *
 * @apiSuccess (Success 200) {Object} data
 * @apiSuccess (Success 200) {Array} data.posts Array of posts
 * @apiSuccess (Success 200) {String} data.posts.title Title
 * @apiSuccess (Success 200) {String} data.posts.description Description
 * @apiSuccess (Success 200) {String} data.posts.author Author
 * @apiSuccess (Success 200) {String} data.posts.author.fullname Fullname
 * @apiSuccess (Success 200) {String} data.posts.thumbnail Thumbnail
 * @apiSuccess (Success 200) {String} data.posts.url Url
 * @apiSuccess (Success 200) {Array} data.users Array of users
 * @apiSuccess (Success 200) {String} data.users.fullname Name
 * @apiSuccess (Success 200) {String} data.users.username Username
 * @apiSuccess (Success 200) {String} data.users.avatar Avatar
 *
 * @apiUse ErrorObject
 */

router.get('/:phrase?',
  paramValidation('phrase')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Phrase must be longer than 3 characters'),
  ValidationErrorHandler,
  async(req, res, next) => {
    try {
      const phrase = req.params.phrase;

      const posts = await PostController.findContaining({
        phrase,
        select: '-_id title description thumbnail url',
        options: {
          limit: 5,
          lean: true
        },
        populate: {
          path: 'author',
          select: '-_id fullname'
        }
      });

      const users = await UserController.findContaining({
        phrase,
        select: '-_id fullname username avatar',
        options: {
          limit: 5,
          lean: true
        }
      });

      return res
        .status(200)
        .json({
          data: {
            posts,
            users
          }
        });
    } catch(err) {
      return next(err);
    }
  });

module.exports = router;

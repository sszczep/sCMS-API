'use strict';

const express = require('express');
const router = express.Router();
const { body: bodyValidation } = require('express-validator/check');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const isLogged = require('../middlewares/isLogged.js');
const PostsController = require('../controllers/posts.js');
const CustomError = require('../utils/CustomError.js');

/**
 * @api {get} /posts/count Get count of all posts
 * @apiName GetPostsCount
 * @apiGroup Posts
 *
 * @apiSuccess (Success 200) {Object} data
 * @apiSuccess (Success 200) {String} data.count Count of posts
 *
 * @apiUse ErrorObject
 */

router.get('/count', async(req, res, next) => {
  try {
    const count = await PostsController.getPostsCount();

    return res
      .status(200)
      .json({
        data: {
          count
        }
      });
  } catch(err) {
    return next(err);
  }
});

/**
 * @api {get} /posts/:id Get a single post
 * @apiName GetPost
 * @apiGroup Posts
 *
 * @apiParam (Route Parameter) {String} id id of post to return
 *
 * @apiSuccess (Success 200) {Object} data
 * @apiSuccess (Success 200) {String} data.title Title of post
 * @apiSuccess (Success 200) {String} data.previewText Preview text of post
 * @apiSuccess (Success 200) {String} data.author Author of post
 * @apiSuccess (Success 200) {String} data.content Content of post
 * @apiSuccess (Success 200) {String} data.thumbnail Thumbail of post
 * @apiSuccess (Success 200) {String} data.friendlyUrl Friendly url of post
 * @apiSuccess (Success 200) {String} data.created Date of creation of post
 *
 * @apiUse ErrorObject
 */

router.get('/:_id', async(req, res, next) => {
  const id = req.params.id;

  try {
    const data = await PostsController.getSinglePost(id);

    if(!data) {
      throw new CustomError('NoPostFound', 'Couldn\'t find post with given id', 404);
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
 * @api {get} /posts?preview=:preview&limit=:limit&offset=:offset Get list of all posts
 * @apiName GetPosts
 * @apiGroup Posts
 *
 * @apiParam (Query Parameter) {Boolean} [preview=false] If set to true, won't contain content
 * @apiParam (Query Parameter) {Number} [limit=0] How many posts should be shown (0 means all of them)
 * @apiParam (Query Parameter) {Number} [offset=0] How many posts should be skipped
 *
 * @apiSuccess (Success 200) {Object[]} data Array of posts
 * @apiSuccess (Success 200) {String} data.title Title of post
 * @apiSuccess (Success 200) {String} data.previewText Preview text of post
 * @apiSuccess (Success 200) {String} data.author Author of post
 * @apiSuccess (Success 200) {String} data.content Content of post, only if preview is set to false
 * @apiSuccess (Success 200) {String} data.thumbnail Thumbail of post
 * @apiSuccess (Success 200) {String} data.friendlyUrl Friendly url of post
 * @apiSuccess (Success 200) {String} data.created Date of creation of post
 *
 * @apiUse ErrorObject
 */

router.get('/', async(req, res, next) => {
  try {
    const data = await PostsController.getPostsList({
      preview: req.query.preview === 'true',
      limit: req.query.limit || 0,
      offset: req.query.offset || 0
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
 * @api {post} /posts Create new post
 * @apiName CreatePost
 * @apiGroup Posts
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (JSON Payload) {String} title Title of post
 * @apiParam (JSON Payload) {String} previewText Preview text of post
 * @apiParam (JSON Payload) {String} author Author of post
 * @apiParam (JSON Payload) {String} content Content of post
 * @apiParam (JSON Payload) {String} thumbnail Thumbnail of post
 * @apiParam (JSON Payload) {String} [friendlyUrl] Custom friendly url of post
 * @apiParam (JSON Payload) {String} [created] Date of creation
 *
 * @apiSuccess (Success 201) {Object} data
 * @apiSuccess (Success 201) {String} data.title Title of post
 * @apiSuccess (Success 201) {String} data.previewText Preview text of post
 * @apiSuccess (Success 201) {String} data.author Author of post
 * @apiSuccess (Success 201) {String} data.content Content of post
 * @apiSuccess (Success 201) {String} data.thumbnail Thumbail of post
 * @apiSuccess (Success 201) {String} data.friendlyUrl Friendly url of post
 * @apiSuccess (Success 201) {String} data.created Date of creation
 *
 * @apiUse ErrorObject
 */

router.post('/',
  [
    bodyValidation('title')
      .exists()
      .trim(),
    bodyValidation('previewText')
      .exists()
      .trim(),
    bodyValidation('author')
      .exists()
      .trim(),
    bodyValidation('content')
      .exists()
      .trim(),
    bodyValidation('thumbnail')
      .isURL()
      .trim()
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    try {
      const data = await PostsController.createNewPost(req.body);

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

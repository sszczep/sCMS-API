'use strict';

const express = require('express');
const router = express.Router();
const { body: bodyValidation, param: paramValidation } = require('express-validator/check');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const isLogged = require('../middlewares/isLogged.js');
const hasPermissions = require('../middlewares/hasPermissions.js');
const PostController = require('../controllers/posts.js');
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
    const count = await PostController.getPostsCount();

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
 * @api {get} /posts/id/:id Get a single post by id
 * @apiName GetPost
 * @apiGroup Posts
 *
 * @apiParam (Route Parameter) {String} id ID of post to return
 *
 * @apiSuccess (Success 200) {Object} data
 * @apiSuccess (Success 200) {String} data.title Title of post
 * @apiSuccess (Success 200) {String} data.description Description of post
 * @apiSuccess (Success 200) {String} data.content Content of post
 * @apiSuccess (Success 200) {String} data.thumbnail Thumbail of post
 * @apiSuccess (Success 200) {String} data.friendlyUrl Friendly url of post
 * @apiSuccess (Success 200) {String} data.created Date of creation of post
 * @apiSuccess (Success 200) {String} data._id ID of post
 * @apiSuccess (Success 200) {Object} data.author Author of post
 * @apiSuccess (Success 200) {String} data.author.fullname Full name of author
 * @apiSuccess (Success 200) {String} data.author._id ID of author
 *
 * @apiUse ErrorObject
 */

router.get('/id/:id',
  paramValidation('id')
    .isMongoId()
    .withMessage('You need to specify valid post id'),
  ValidationErrorHandler,
  async(req, res, next) => {
    const id = req.params.id;

    try {
      const data = await PostController.getSinglePost({ _id: id });

      if(!data) {
        throw new CustomError('NoPostFound', 'Could not find post with given id', 404);
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
   * @api {get} /posts/url/:url Get a single post by url
   * @apiName GetPost
   * @apiGroup Posts
   *
   * @apiParam (Route Parameter) {String} url Url of post to return
   *
   * @apiSuccess (Success 200) {Object} data
   * @apiSuccess (Success 200) {String} data.title Title of post
   * @apiSuccess (Success 200) {String} data.description Description of post
   * @apiSuccess (Success 200) {String} data.content Content of post
   * @apiSuccess (Success 200) {String} data.thumbnail Thumbail of post
   * @apiSuccess (Success 200) {String} data.friendlyUrl Friendly url of post
   * @apiSuccess (Success 200) {String} data.created Date of creation of post
   * @apiSuccess (Success 200) {String} data._id ID of post
   * @apiSuccess (Success 200) {Object} data.author Author of post
   * @apiSuccess (Success 200) {String} data.author.fullname Full name of author
   * @apiSuccess (Success 200) {String} data.author._id ID of author
   *
   * @apiUse ErrorObject
   */

router.get('/url/:url',
  paramValidation('url')
    .exists({ checkFalsy: true })
    .withMessage('You need to specify post url'),
  ValidationErrorHandler,
  async(req, res, next) => {
    const url = req.params.url;

    try {
      const data = await PostController.getSinglePost({ friendlyUrl: url });

      if(!data) {
        throw new CustomError('NoPostFound', 'Could not find post with given url', 404);
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
 * @apiSuccess (Success 200) {String} data.description Description of post
 * @apiSuccess (Success 200) {String} data.content Content of post, only if preview is set to false
 * @apiSuccess (Success 200) {String} data.thumbnail Thumbail of post
 * @apiSuccess (Success 200) {String} data.friendlyUrl Friendly url of post
 * @apiSuccess (Success 200) {String} data.created Date of creation of post
 * @apiSuccess (Success 200) {String} data._id ID of post
 * @apiSuccess (Success 200) {Object} data.author Author of post
 * @apiSuccess (Success 200) {String} data.author.fullname Full name of author
 * @apiSuccess (Success 200) {String} data.author._id ID of author
 *
 * @apiUse ErrorObject
 */

router.get('/', async(req, res, next) => {
  try {
    const data = await PostController.getPostsList({
      preview: req.query.preview === 'true',
      limit: Number(req.query.limit) || 0,
      offset: Number(req.query.offset) || 0
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
 * @apiParam (JSON Payload) {String} description Description of post
 * @apiParam (JSON Payload) {String} content Content of post
 * @apiParam (JSON Payload) {String} thumbnail Thumbnail of post
 * @apiParam (JSON Payload) {String} [friendlyUrl] Custom friendly url of post
 * @apiParam (JSON Payload) {String} [created] Date of creation
 *
 * @apiSuccess (Success 201) {Object} data
 * @apiSuccess (Success 201) {String} data.title Title of post
 * @apiSuccess (Success 201) {String} data.description Description of post
 * @apiSuccess (Success 201) {String} data.content Content of post
 * @apiSuccess (Success 201) {String} data.thumbnail Thumbail of post
 * @apiSuccess (Success 201) {String} data.friendlyUrl Friendly url of post
 * @apiSuccess (Success 201) {String} data.created Date of creation
 * @apiSuccess (Success 201) {String} data._id ID of post
 * @apiSuccess (Success 201) {Object} data.author Author of post
 * @apiSuccess (Success 201) {String} data.author.fullname Full name of author
 * @apiSuccess (Success 201) {String} data.author._id ID of author
 *
 * @apiUse ErrorObject
 */

router.post('/',
  hasPermissions([ 'createPost' ]),
  [
    bodyValidation('title')
      .exists({ checkFalsy: true })
      .withMessage('You need to specify title')
      .custom(async title => {
        const post = await PostController.getSinglePost({ title });

        if(post) {
          throw new Error('There is a post with this title');
        }
      }),
    bodyValidation('description')
      .exists({ checkFalsy: true })
      .withMessage('You need to specify short description'),
    bodyValidation('content')
      .exists({ checkFalsy: true })
      .withMessage('You need to specify content'),
    bodyValidation('thumbnail')
      .exists({ checkFalsy: true })
      .withMessage('You need to specify thumbnail')
      .isURL({ require_host: false }) // eslint-disable-line camelcase
      .withMessage('Thumbnail is not valid URL')
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    try {
      const data = await PostController.createNewPost({
        ...req.body,
        author: req.user._id
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

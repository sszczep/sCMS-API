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
 * @api {get} /posts/:url Get a single post by url
 * @apiName GetPost
 * @apiGroup Posts
 *
 * @apiParam (Route Parameter) {String} url Url of post
 *
 * @apiSuccess (Success 200) {Object} data
 * @apiSuccess (Success 200) {String} data.title Title
 * @apiSuccess (Success 200) {String} data.description Description
 * @apiSuccess (Success 200) {String} data.content Content
 * @apiSuccess (Success 200) {String} data.thumbnail Thumbail
 * @apiSuccess (Success 200) {String} data.url Url
 * @apiSuccess (Success 200) {String} data.created Date of creation
 * @apiSuccess (Success 200) {Object} data.author Author
 * @apiSuccess (Success 200) {String} data.author.fullname Name
 * @apiSuccess (Success 200) {String} data.author.username Username
 *
 * @apiUse ErrorObject
 */

router.get('/:url',
  paramValidation('url')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('You need to specify valid url'),
  ValidationErrorHandler,
  async(req, res, next) => {
    const url = req.params.url;

    try {
      const data = await PostController.getSinglePost({
        conditions: {
          url
        },
        select: '-_id title description content thumbnail url created author',
        options: {
          lean: true
        },
        populate: {
          path: 'author',
          select: '-_id fullname username'
        }
      });

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
 * @apiSuccess (Success 200) {String} data.title Title
 * @apiSuccess (Success 200) {String} data.description Description
 * @apiSuccess (Success 200) {String} data.content Content, only if preview is set to false
 * @apiSuccess (Success 200) {String} data.thumbnail Thumbail
 * @apiSuccess (Success 200) {String} data.url Url
 * @apiSuccess (Success 200) {String} data.created Date of creation
 * @apiSuccess (Success 200) {Object} data.author Author
 * @apiSuccess (Success 200) {String} data.author.fullname Name
 * @apiSuccess (Success 200) {String} data.author.username Username
 *
 * @apiUse ErrorObject
 */

router.get('/', async(req, res, next) => {
  const preview = req.query.preview ? Boolean(req.query.preview) : false;
  const limit = req.query.limit ? Number(req.query.limit) : 0;
  const offset = req.query.offset ? Number(req.query.offset) : 0;

  try {
    const data = await PostController.getPostsList({
      select: `-_id title description thumbnail url created author ${preview ? '' : 'content'}`,
      options: {
        lean: true,
        limit,
        skip: offset
      },
      populate: {
        path: 'author',
        select: '-_id fullname username'
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
 * @api {post} /posts Create new post
 * @apiName CreatePost
 * @apiGroup Posts
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (JSON Payload) {String} title Title
 * @apiParam (JSON Payload) {String} description Description
 * @apiParam (JSON Payload) {String} content Content
 * @apiParam (JSON Payload) {String} thumbnail Thumbnail
 * @apiParam (JSON Payload) {String} [url] Custom url
 * @apiParam (JSON Payload) {String} [created] Date of creation
 *
 * @apiSuccess (Success 201) {Object} data
 * @apiSuccess (Success 201) {String} data.title Title
 * @apiSuccess (Success 201) {String} data.description Description
 * @apiSuccess (Success 201) {String} data.content Content
 * @apiSuccess (Success 201) {String} data.thumbnail Thumbail
 * @apiSuccess (Success 201) {String} data.url Url
 * @apiSuccess (Success 201) {String} data.created Date of creation
 * @apiSuccess (Success 201) {Object} data.author Author
 * @apiSuccess (Success 201) {String} data.author.fullname Name
 * @apiSuccess (Success 201) {String} data.author.username Username
 *
 * @apiUse ErrorObject
 */

router.post('/',
  hasPermissions([ 'createPost' ]),
  [
    bodyValidation('title')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify title')
      .custom(async title => {
        const post = await PostController.getSinglePost({
          conditions: {
            title
          },
          select: '_id',
          options: {
            lean: true
          }
        });

        if(post) {
          throw new Error('There is a post with this title');
        }
      }),
    bodyValidation('description')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify short description'),
    bodyValidation('content')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify content'),
    bodyValidation('thumbnail')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify thumbnail')
      .isURL({ require_host: false }) // eslint-disable-line camelcase
      .withMessage('Thumbnail is not valid URL')
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    const { title, description, content, thumbnail, url, created } = req.body;
    const author = req.user._id;

    try {
      const data = await PostController.createNewPost({
        toCreate: {
          title,
          description,
          content,
          thumbnail,
          url,
          created,
          author
        },
        select: '-_id title description content thumbnail url created author',
        populate: {
          path: 'author',
          select: '-_id fullname username'
        }
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

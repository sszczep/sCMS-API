'use strict';

const express = require('express');
const router = express.Router();
const { param: paramValidation } = require('express-validator/check');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const UserController = require('../controllers/users.js');
const CustomError = require('../utils/CustomError.js');

/**
 * @api {get} /user/:username Get user's details by username
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (Route Parameter) {String} username Username
 *
 * @apiSuccess (Success 200) {Object} data User's details
 * @apiSuccess (Success 200) {String} data.fullname Name
 * @apiSuccess (Success 200) {String} data.username Username
 * @apiSuccess (Success 200) {String} data.avatar Avatar
 * @apiSuccess (Success 200) {String} data.bio Bio (short description)
 * @apiSuccess (Success 200) {String} data.email Email (only if authorization header is specified and user has permission to see that or it's his account)
 * @apiSuccess (Success 200) {Array} data.permissions Permissions (only if authorization header is specified and user has permission to see that or it's his account)
 * @apiSuccess (Success 200) {Array} data.posts All posts created by user
 * @apiSuccess (Success 200) {String} data.posts.title Title
 * @apiSuccess (Success 200) {String} data.posts.description Description
 * @apiSuccess (Success 200) {String} data.posts.thumbnail Thumbnail
 * @apiSuccess (Success 200) {String} data.posts.url Url
 *
 * @apiUse ErrorObject
 */

router.get('/:username',
  paramValidation('username')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('You need to specify username'),
  ValidationErrorHandler,
  async(req, res, next) => {
    const { username } = req.params;

    try {
      const user = await UserController.getUser({
        conditions: {
          username
        },
        select: '-_id fullname username avatar bio posts email permissions',
        options: {
          lean: true
        },
        populate: {
          path: 'posts',
          select: '-_id title description thumbnail url'
        }
      });

      if(!user) {
        return next(new CustomError('NoUser', 'There is no user with given username'));
      }

      const showSensitiveInfo = await UserController.canAccessSensitiveInfo(req, user);

      return res
        .status(200)
        .json({
          data: {
            ...user,
            email: showSensitiveInfo ? user.email : undefined,
            permissions: showSensitiveInfo ? user.permissions : undefined
          }
        });
    } catch(err) {
      return next(err);
    }
  });

module.exports = router;

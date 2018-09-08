'use strict';

const express = require('express');
const router = express.Router();
const { param: paramValidation } = require('express-validator/check');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const UserController = require('../controllers/users.js');
const CustomError = require('../utils/CustomError.js');

/**
 * @api {get} /user/:phrase Get user's details by _id or username
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (Route Parameter) {String} phrase _id or username of user to return
 *
 * @apiSuccess (Success 200) {Object} user User's details
 * @apiSuccess (Success 200) {String} user.fullname Name
 * @apiSuccess (Success 200) {String} user.username Username
 * @apiSuccess (Success 200) {String} user.avatar Avatar
 * @apiSuccess (Success 200) {String} user.bio Bio (short description)
 * @apiSuccess (Success 200) {String} user.email Email (only if authorization header is specified and user has permission to see that or it's his account)
 * @apiSuccess (Success 200) {Array} user.permissions Permissions (only if authorization header is specified and user has permission to see that or it's his account)
 * @apiSuccess (Success 200) {String} user._id User ID (only if authorization header is specified and user has permission to see that or it's his account)
 *
 * @apiUse ErrorObject
 */

router.get('/:phrase',
  paramValidation('phrase')
    .exists({ checkFalsy: true })
    .withMessage('You need to specify phrase - username or _id'),
  ValidationErrorHandler, async(req, res, next) => {
    try {
      const user = await UserController.getUserByPhrase(req.params.phrase);

      if(!user) {
        return next(new CustomError('NoUser', 'There is no user with given username/_id'));
      }

      const showSensitiveInfo = UserController.canAccessSensitiveInfo(req, user);

      return res
        .status(200)
        .json({
          data: {
            fullname: user.fullname,
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,

            email: showSensitiveInfo ? user.email : undefined,
            permissions: showSensitiveInfo ? user.permissions : undefined,
            _id: showSensitiveInfo ? user._id : undefined
          }
        });
    } catch(err) {
      return next(err);
    }
  });

module.exports = router;

'use strict';

const express = require('express');
const router = express.Router();
const { param: paramValidation } = require('express-validator/check');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const AuthController = require('../controllers/auth.js');
const UserController = require('../controllers/users.js');
const CustomError = require('../utils/CustomError.js');

/**
 * @api {get} /user/username/:username Get user's details by his username
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiParam (Route Parameter) {String} url Url of post to return
 *
 * @apiSuccess (Success 200) {Object} user User's details
 * @apiSuccess (Success 200) {String} user.fullname Name
 * @apiSuccess (Success 200) {String} user.username Username
 * @apiSuccess (Success 200) {String} user.avatar Avatar
 * @apiSuccess (Success 200) {String} user.bio Bio (short description)
 *
 * @apiUse ErrorObject
 */

router.get('/username/:username',
  paramValidation('username')
    .exists({ checkFalsy: true })
    .withMessage('You need to specify username'),
  ValidationErrorHandler, async(req, res, next) => {
    try {
      const user = await UserController.getUser({ username: req.params.username });

      if(!user) {
        return next(new CustomError('NoUser', 'There is no user with given username'));
      }

      // decide whether user has permissions to access sensistive details
      let showSensitiveInfo = false;

      // get header with Token
      const header = req.get('Authorization');

      // if header exists
      if(header) {
        try {
          const token = AuthController.checkAuthorizationHeaderAndReturnToken(header);
          const decoded = await AuthController.decodeToken(token);

          // if token belongs to user making request or user has permission to access others sensitive details
          if(decoded._id.toString() === user._id.toString() || UserController.hasPermissions([ 'detailedInfoAboutOtherUsers' ])) {
            showSensitiveInfo = true;
          }
        } catch(err) {
          showSensitiveInfo = false;
        }
      }

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

'use strict';

const express = require('express');
const router = express.Router();
const { header } = require('express-validator/check');
const isLogged = require('../middlewares/isLogged.js');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const UserController = require('../controllers/users.js');
const isProperAuthorizationHeader = require('../validators/isProperAuthorizationHeader.js');
const CustomError = require('../utils/CustomError.js');

/**
 * @api {get} /me Get user's details based on given token
 * @apiName Me
 * @apiGroup Me
 *
 * @apiUse AuthorizationHeader
 *
 * @apiSuccess (Success 200) {Object} user User's details
 *
 * @apiUse ErrorObject
 */

router.get('/',
  header('Authorization').custom(isProperAuthorizationHeader),
  ValidationErrorHandler,
  isLogged,
  async(req, res, next) => {
    try {
      const user = await UserController.getUser({ _id: req.userID });

      if(!user) {
        return next(new CustomError('NoUser', 'There is no user with given _id', 404));
      }

      return res
        .status(200)
        .json({
          user
        });
    } catch(err) {
      return next(err);
    }
  });

module.exports = router;

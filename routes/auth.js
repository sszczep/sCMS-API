'use strict';

const express = require('express');
const router = express.Router();
const { body: bodyValidation } = require('express-validator/check');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const AuthController = require('../controllers/auth.js');
const UserController = require('../controllers/users.js');

/**
 * @apiDefine AuthorizationHeader
 * @apiHeader {String} Authorization Authorization header
 * @apiHeaderExample {json} Authorization example:
 *  {
 *    "Authorization": "Bearer <jwt token here>"
 *  }
 */

/**
 * @api {post} /auth/login Login into site using credentials (username/email and password)
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam (JSON Payload) {String} login Username or Email
 * @apiParam (JSON Payload) {String} password Password
 *
 * @apiSuccess (Success 200) {Object} data
 * @apiSuccess (Success 200) {String} data.token JWT token
 * @apiSuccess (Success 200) {String} data.expiration JWT token expiration date
 * @apiSuccess (Success 200) {Object} data.user User's details
 * @apiSuccess (Success 200) {String} data.user.fullname Name
 * @apiSuccess (Success 200) {String} data.user.username Username
 * @apiSuccess (Success 200) {String} data.user.email Email
 * @apiSuccess (Success 200) {String} data.user.avatar Avatar
 * @apiSuccess (Success 200) {String} data.user.bio Bio
 * @apiSuccess (Success 200) {Array} data.user.permissions Permissions
 *
 * @apiUse ErrorObject
 */

router.post('/login',
  [
    bodyValidation('login')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify username or email'),
    bodyValidation('password')
      .exists({ checkFalsy: true })
      .withMessage('You need to specify password')
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    const { login, password } = req.body;

    try {
      const { token, expiration, user } = await AuthController.validateCredentialsAndReturnData({
        credentials: {
          login,
          password
        },
        select: '-_id fullname username email avatar bio permissions'
      });

      return res
        .status(200)
        .json({
          data: {
            token,
            expiration,
            user
          }
        });
    } catch(err) {
      return next(err);
    }
  });

/**
 * @api {post} /auth/register Register new user
 * @apiName Register
 * @apiGroup Auth
 *
 * @apiParam (JSON Payload) {String} email Email
 * @apiParam (JSON Payload) {String{4..}} username Username
 * @apiParam (JSON Payload) {String{6..}} password Password
 * @apiParam (JSON Payload) {String} fullname Name
 *
 * @apiSuccess (Success 201) {Object} data
 * @apiSuccess (Success 201) {String} data.token JWT token
 * @apiSuccess (Success 201) {String} data.expiration JWT token expiration date
 * @apiSuccess (Success 201) {Object} data.user User's details
 * @apiSuccess (Success 201) {String} data.user.fullname Name
 * @apiSuccess (Success 201) {String} data.user.username Username
 * @apiSuccess (Success 201) {String} data.user.email Email
 * @apiSuccess (Success 201) {String} data.user.avatar Avatar
 * @apiSuccess (Success 201) {String} data.user.bio Bio
 * @apiSuccess (Success 201) {Array} data.user.permissions Permissions
 *
 * @apiUse ErrorObject
 */

router.post('/register',
  [
    bodyValidation('email')
      .trim()
      .isEmail()
      .withMessage('Invalid format of email')
      .normalizeEmail()
      .custom(async email => {
        const user = await UserController.getUser({
          conditions: { email },
          select: '_id',
          options: {
            lean: true
          }
        });

        if(user) {
          throw new Error('Email already in use');
        }
      }),
    bodyValidation('username')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify username')
      .isLength({ min: 4 })
      .withMessage('Username too short')
      .matches(/^[a-zA-Z0-9]+$/i)
      .withMessage('Invalid format of username')
      .trim()
      .custom(async username => {
        const user = await UserController.getUser({
          conditions: { username },
          select: '_id',
          options: {
            lean: true
          }
        });

        if(user) {
          throw new Error('Username already in use');
        }
      }),
    bodyValidation('password')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify password')
      .isLength({ min: 6 })
      .withMessage('Password too short'),
    bodyValidation('fullname')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('You need to specify fullname')
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    const { email, username, password, fullname } = req.body;

    try {
      const data = await UserController.registerUser({
        toCreate: {
          email,
          username,
          password,
          fullname
        },
        select: '-_id fullname username email avatar bio permissions'
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

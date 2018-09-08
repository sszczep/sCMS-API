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
 * @api {post} /auth/login Login into site using credentials (email and password)
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam (JSON Payload) {String} login Email or username
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
 * @apiSuccess (Success 200) {Array} data.user.permissions Permissions
 *
 * @apiUse ErrorObject
 */

router.post('/login',
  [
    bodyValidation('login')
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
      const { token, expiration, user } = await AuthController.validateCredentialsAndReturnData(login, password);

      return res
        .status(200)
        .json({
          data: {
            token,
            expiration,
            user: {
              fullname: user.fullname,
              username: user.username,
              email: user.name,
              avatar: user.avatar,
              permissions: user.permissions
            }
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
 * @apiParam (JSON Payload) {String} username Username
 * @apiParam (JSON Payload) {String} password Password
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
 * @apiSuccess (Success 201) {Array} data.user.permissions Permissions
 *
 * @apiUse ErrorObject
 */

router.post('/register',
  [
    bodyValidation('email')
      .isEmail()
      .withMessage('Invalid format of email')
      .normalizeEmail()
      .custom(async email => {
        const user = await UserController.getUser({ email });

        if(user) {
          throw new Error('Email already in use');
        }
      }),
    bodyValidation('username')
      .exists({ checkFalsy: true })
      .withMessage('You need to specify username')
      .matches(/^[a-zA-Z]+$/i)
      .withMessage('Invalid format of username')
      .custom(async username => {
        const user = await UserController.getUser({ username });

        if(user) {
          throw new Error('Username already in use');
        }
      }),
    bodyValidation('password')
      .exists({ checkFalsy: true })
      .withMessage('You need to specify password')
      .isLength({ min: 6 })
      .withMessage('Password too short'),
    bodyValidation('fullname')
      .exists({ checkFalsy: true })
      .withMessage('You need to specify fullname')
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    try {
      const user = await UserController.registerUser(req.body);
      const data = user.generateJWT();

      return res
        .status(201)
        .json({
          data: {
            ...data,
            user: {
              fullname: user.fullname,
              username: user.username,
              email: user.email,
              avatar: user.avatar,
              permissions: user.permissions
            }
          }
        });
    } catch(err) {
      return next(err);
    }
  });

module.exports = router;

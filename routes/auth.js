'use strict';

const express = require('express');
const router = express.Router();
const { body: bodyValidation } = require('express-validator/check');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const AuthController = require('../controllers/auth.js');
const UserController = require('../controllers/users.js');

/**
 * @api {post} /auth/login Login into site using credentials (email and password)
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam (JSON Payload) {String} email Email
 * @apiParam (JSON Payload) {String} password Password
 *
 * @apiSuccess (Success 200) {Object} data User object
 * @apiSuccess (Success 200) {String} data.token JWT token
 *
 * @apiUse ErrorObject
 */

router.post('/login',
  [
    bodyValidation('email')
      .isEmail()
      .withMessage('Invalid format of email')
      .normalizeEmail(),
    bodyValidation('password')
      .exists()
      .withMessage('You need to specify password')
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    const { email, password } = req.body;

    try {
      const token = await AuthController.validateCredentialsAndReturnJWT(email, password);

      return res
        .status(200)
        .json({
          data: {
            token
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
 * @apiParam (JSON Payload) {String} password Password
 * @apiParam (JSON Payload) {String} fullname Full name
 *
 * @apiSuccess (Success 201) {Object} data User object
 * @apiSuccess (Success 201) {String} data.token JWT token
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
    bodyValidation('password')
      .isLength({ min: 6 })
      .withMessage('Password too short'),
    bodyValidation('fullname')
      .exists()
      .withMessage('You need to specify fullname')
  ],
  ValidationErrorHandler,
  async(req, res, next) => {
    try {
      const user = await UserController.registerUser(req.body);
      const token = user.generateJWT();

      return res
        .status(201)
        .json({
          data: {
            token
          }
        });
    } catch(err) {
      return next(err);
    }
  });

module.exports = router;

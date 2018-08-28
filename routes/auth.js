'use strict';

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.js');
const UserController = require('../controllers/users.js');
const ValidationErrorHandler = require('../middlewares/ValidationErrorHandler.js');
const { body } = require('express-validator/check');

/**
 * @api {post} /auth/login Login into site using credentials (email and password)
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam (JSON Payload) {String} email Email
 * @apiParam (JSON Payload) {String} password Password
 *
 * @apiSuccess (Success 200) {String} token JWT token
 *
 * @apiUse ErrorObject
 */

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], ValidationErrorHandler, async(req, res, next) => {
  const { email, password } = req.body;

  try {
    const token = await AuthController.validateCredentialsAndReturnJWT(email, password);

    return res
      .status(200)
      .json({
        token
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
 *
 * @apiSuccess (Success 200) {String} token JWT token
 *
 * @apiUse ErrorObject
 */

router.post('/register', async(req, res, next) => {
  try {
    const user = await UserController.registerUser(req.body);
    const token = user.generateJWT();

    return res
      .status(201)
      .json({
        token
      });
  } catch(err) {
    return next(err);
  }
});

module.exports = router;

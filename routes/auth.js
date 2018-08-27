'use strict';

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.js');
const UserController = require('../controllers/users.js');
const CustomError = require('../utils/CustomError.js');

/**
 * @api {post} /auth/login Login into site using credentials (email and password)
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam (JSON Payload) {Object} credentials
 * @apiParam (JSON Payload) {String} credentials.email Email
 * @apiParam (JSON Payload) {String} credentials.password Password
 *
 * @apiSuccess (Success 200) {String} token JWT token
 *
 * @apiUse ErrorObject
 */

router.post('/login', async(req, res, next) => {
  const credentials = req.body.credentials;

  if(!credentials) {
    return next(new CustomError('NoCredentialsObject', 'You need to pass an object with credentials', 400));
  }

  const { email, password } = req.body.credentials;

  if(!email || !password) {
    return next(new CustomError('NoCredentials', 'You need to pass an email and a password as credentials', 400));
  }

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
 * @apiParam (JSON Payload) {Object} user Object containing user's details
 * @apiParam (JSON Payload) {String} user.email Email
 * @apiParam (JSON Payload) {String} user.password Password
 *
 * @apiSuccess (Success 200) {String} token JWT token
 *
 * @apiUse ErrorObject
 */

router.post('/register', async(req, res, next) => {
  const data = req.body.user;

  if(!data) {
    return next(new CustomError('NoDetails', 'You need to specify user\'s details', 400));
  }

  try {
    const user = await UserController.registerUser(data);
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

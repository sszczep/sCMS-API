'use strict';

const express = require('express');
const router = express.Router();
const isLogged = require('../middlewares/isLogged.js');
const UserController = require('../controllers/users.js');

// all requests below should require authentication

router.use(isLogged);

/**
 * @api {get} /me Get basic user's details based on token
 * @apiName GetDetails
 * @apiGroup Me
 *
 * @apiUse AuthorizationHeader
 *
 * @apiSuccess (Success 200) {Object} data User's details
 * @apiSuccess (Success 200) {String} data.fullname Name
 * @apiSuccess (Success 200) {String} data.username Username
 * @apiSuccess (Success 200) {String} data.email Email
 * @apiSuccess (Success 200) {String} data.avatar Avatar
 * @apiSuccess (Success 200) {Array} data.permissions Permissions
 *
 * @apiUse ErrorObject
 */

router.get('/', async(req, res, next) => {
  const _id = req.user._id;

  try {
    const user = await UserController.getUser({
      conditions: { _id },
      select: '-_id fullname username email avatar permissions',
      options: {
        lean: true
      }
    });

    return res
      .status(200)
      .json({
        data: user
      });
  } catch(err) {
    return next(err);
  }
});

module.exports = router;

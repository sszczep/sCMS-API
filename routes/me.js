'use strict';

const express = require('express');
const router = express.Router();
const isLogged = require('../middlewares/isLogged.js');
const UserController = require('../controllers/users.js');
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

router.get('/', isLogged, async(req, res, next) => {
  try {
    const user = await UserController.getUser({ _id: req.user._id });

    if(!user) {
      return next(new CustomError('NoUser', 'There is no user with given _id', 404));
    }

    user.password = undefined;

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

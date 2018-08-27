'use strict';

const express = require('express');
const router = express.Router();
const isLoggedMiddleware = require('../middlewares/isLogged.js');
const UserController = require('../controllers/users.js');
const CustomError = require('../utils/CustomError.js');

/**
 * @api {get} /me Get user's details based on given token
 * @apiName Me
 * @apiGroup Me
 *
 * @apiHeader {String} Authorization Authorization header
 * @apiHeaderExample {json} Authorization example:
 *  {
 *    "Authorization": "Bearer <jwt token here>"
 *  }
 *
 * @apiSuccess (Success 200) {Object} user User's details
 *
 * @apiUse ErrorObject
 */

router.get('/', isLoggedMiddleware, async(req, res, next) => {
  try {
    const user = await UserController.getUser(req.userID);

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

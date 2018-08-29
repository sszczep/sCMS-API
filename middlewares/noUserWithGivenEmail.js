'use strict';

const UserController = require('../controllers/users.js');
const CustomError = require('../utils/CustomError.js');

module.exports = async(req, res, next) => {
  try {
    const user = await UserController.getUser({ email: req.body.email });

    if(user) {
      return next(new CustomError('EmailInUse', 'There is an user registered with given email', 409));
    }

    return next();
  } catch(err) {
    return next(err);
  }
};

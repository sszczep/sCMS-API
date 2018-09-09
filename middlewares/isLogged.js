'use strict';

const AuthController = require('../controllers/auth.js');

module.exports = async(req, res, next) => {
  try {
    const token = AuthController.checkAuthorizationHeaderAndReturnToken(req);

    req.user = await AuthController.decodeToken(token);

    return next();
  } catch(err) {
    return next(err);
  }
};

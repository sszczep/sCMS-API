'use strict';

const AuthController = require('../controllers/auth.js');

module.exports = async(req, res, next) => {
  const header = req.get('Authorization');

  try {
    const token = AuthController.checkAuthorizationHeaderAndReturnToken(header);
    const decoded = await AuthController.decodeToken(token);

    req.user = decoded;

    return next();
  } catch(err) {
    return next(err);
  }
};

'use strict';

const SocialLinksModel = require('../models/socialLinks.js');

const getSocialLinks = async() =>
  await SocialLinksModel
    .find()
    .select(`-__v`)
    .lean()
    .exec();

const createSocialLink = async data => {
  const response = await SocialLinksModel
    .create(data);

  response.__v = undefined; // eslint-disable-line no-underscore-dangle

  return response;
};

module.exports = {
  getSocialLinks,
  createSocialLink
};

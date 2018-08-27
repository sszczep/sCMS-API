'use strict';

const SocialLinksModel = require('../models/socialLinks.js');

const getSocialLinks = async() =>
  await SocialLinksModel
    .find()
    .select(`-__v`)
    .lean()
    .exec();

const createSocialLink = async data =>
  await SocialLinksModel
    .create(data);

module.exports = {
  getSocialLinks,
  createSocialLink
};

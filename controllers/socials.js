'use strict';

const SocialLinkModel = require('../models/socialLinks.js');
const filterObject = require('../utils/filterObject.js');

const getSocialLinks = async data =>
  await SocialLinkModel
    .find()
    .select(data.select || '')
    .setOptions(data.options || {})
    .exec();

const createSocialLink = async data => {
  const response = await SocialLinkModel
    .create(data.toCreate);

  return filterObject(response, data.select);
};

module.exports = {
  getSocialLinks,
  createSocialLink
};

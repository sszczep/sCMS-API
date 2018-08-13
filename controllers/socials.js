const SocialModel = require('../models/socials.js');

async function getSocials() {
  return await SocialModel
    .find()
    .select(`-__v`)
    .lean()
    .exec()
}

async function createSocial(data) {
  const newSocial = new SocialModel(data);
  return await newSocial.save();
}

module.exports = {
  getSocials,
  createSocial
}

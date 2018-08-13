const express = require('express');
const router = express.Router();

const SocialsController = require('../controllers/socials.js')

/**
 * @api {get} /socials Get list of social links
 * @apiName GetSocialLinks
 * @apiGroup SocialLinks
 *
 * @apiSuccess (Success 200) {String} message Success message
 * @apiSuccess (Success 200) {Object[]} data Array of social links
 * @apiSuccess (Success 200) {String} data.name Name of social link
 * @apiSuccess (Success 200) {String} data.url Url of social link
 * @apiSuccess (Success 200) {String} data.icon Icon for social link
 *
 * @apiUse ErrorObject
 */

router.get('/', async (req, res, next) => {
  try {
    const data = await SocialsController.getSocials()
    return res
      .status(200)
      .json({
        message: "Successfully received list of social links",
        data
      })
  } catch(err) {
    return next(err)
  }
})

/**
 * @api {post} /socials Create new social link
 * @apiName CreateSocialLink
 * @apiGroup SocialLinks
 *
 * @apiSuccess (Success 201) {String} message Success message
 * @apiSuccess (Success 201) {Object} data
 * @apiSuccess (Success 201) {String} data.name Name of social link
 * @apiSuccess (Success 201) {String} data.url Url of social link
 * @apiSuccess (Success 201) {String} data.icon Icon for social link
 *
 * @apiUse ErrorObject
 */

router.post('/', async (req, res, next) => {
  try {
     const data = await SocialsController.createSocial(req.body)
     return res
       .status(201)
       .json({
         message: "Successfully created new social link",
         data
       })
  } catch(err) {
    return next(err)
  }
})

module.exports = router;

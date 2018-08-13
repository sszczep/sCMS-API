const PostModel = require('../models/posts.js');
const slugify = require('slugify');

async function findContaining(phrase) {
  return await PostModel
    .find({ 'title': { '$regex': phrase, '$options': 'i' } })
    .select('friendlyUrl title thumbnail previewText')
    .lean()
    .exec()
}

async function createNewPost(data) {
  const date = new Date();

  let month = date.getMonth() + 1;
  if(month < 10) month = `0${month}`;

  const year = date.getFullYear();

  const friendlyTitle = slugify(data.title, {
    lower: true
  });

  data.friendlyUrl = data.friendlyUrl || `${year}-${month}/${friendlyTitle}`;

  const newPost = new PostModel(data);
  return await newPost.save();
}

async function getPostsCount() {
  return await PostModel.estimatedDocumentCount()
}

async function getSinglePost(_id) {
  return await PostModel
    .findOne({ _id })
    .lean()
    .exec()
}

async function getPostsList(params) {
  const limit = parseInt(params.limit) || 0;
  const offset = parseInt(params.offset) || 0;

  return await PostModel
    .find()
    .limit(limit)
    .skip(offset)
    .sort('-created')
    .select(`-__v ${params.preview ? '-content' : ''}`)
    .lean()
    .exec()
}

module.exports = {
  findContaining,
  createNewPost,
  getPostsCount,
  getSinglePost,
  getPostsList
}

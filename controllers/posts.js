'use strict';

const PostModel = require('../models/posts.js');
const slugify = require('slugify');

const findContaining = async phrase =>
  await PostModel
    .find({ title: { $regex: phrase, $options: 'i' }})
    .limit(10)
    .sort('-created')
    .select('friendlyUrl title thumbnail description')
    .lean()
    .exec();

const createNewPost = async data => {
  const friendlyTitle = slugify(data.title, { lower: true });

  data.friendlyUrl = data.friendlyUrl || `posts/${friendlyTitle}`;

  return await PostModel
    .create(data);
};

const getPostsCount = async() =>
  await PostModel.estimatedDocumentCount();

const getSinglePost = async data =>
  await PostModel
    .findOne(data)
    .lean()
    .exec();

const getPostsList = async params => {
  const limit = Number(params.limit) || 0;
  const offset = Number(params.offset) || 0;

  return await PostModel
    .find()
    .limit(limit)
    .skip(offset)
    .sort('-created')
    .select(`-__v ${params.preview ? '-content' : ''}`)
    .lean()
    .exec();
};

module.exports = {
  findContaining,
  createNewPost,
  getPostsCount,
  getSinglePost,
  getPostsList
};

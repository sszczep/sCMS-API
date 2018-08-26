'use strict';

const PostModel = require('../models/posts.js');
const slugify = require('slugify');

const findContaining = async phrase =>
  await PostModel
    .find({ title: { $regex: phrase, $options: 'i' }})
    .select('friendlyUrl title thumbnail previewText')
    .lean()
    .exec();

const createNewPost = async data => {
  const friendlyTitle = slugify(data.title, { lower: true });

  data.friendlyUrl = data.friendlyUrl || `post/${friendlyTitle}`;

  return await PostModel
    .create(data)
    .exec();
};

const getPostsCount = async() =>
  await PostModel.estimatedDocumentCount();

const getSinglePost = async id =>
  await PostModel
    .findOne({ _id: id })
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

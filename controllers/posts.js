'use strict';

const PostModel = require('../models/posts.js');
const slugify = require('slugify');
const UserController = require('./users.js');
const filterObject = require('../utils/filterObject.js');

const findContaining = async data =>
  await PostModel
    .find({ title: { $regex: data.phrase, $options: 'i' }})
    .select(data.select || '')
    .setOptions(data.options || {})
    .sort('-created')
    .populate(data.populate || [])
    .exec();

const createNewPost = async data => {
  data.toCreate.url = data.toCreate.url || slugify(data.toCreate.title, { lower: true });

  const response = await PostModel
    .create(data.toCreate);

  await UserController.addPost(data.toCreate.author, response._id);

  await response.populate(data.populate || []).execPopulate();

  return filterObject(response, data.select);
};

const deletePost = async data =>
  await PostModel
    .findOneAndDelete(data)
    .exec();

const getPostsCount = async() =>
  await PostModel.estimatedDocumentCount();

const getSinglePost = async data =>
  await PostModel
    .findOne(data.conditions)
    .select(data.select || '')
    .setOptions(data.options || {})
    .populate(data.populate || [])
    .exec();

const getPostsList = async data =>
  await PostModel
    .find()
    .select(data.select || '')
    .setOptions(data.options || {})
    .sort('-created')
    .populate(data.populate || [])
    .exec();

module.exports = {
  findContaining,
  createNewPost,
  deletePost,
  getPostsCount,
  getSinglePost,
  getPostsList
};

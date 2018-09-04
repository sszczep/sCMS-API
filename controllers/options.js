'use strict';

const OptionModel = require('../models/options.js');

const getOption = async data =>
  await OptionModel
    .findOne(data)
    .select('-__v')
    .lean()
    .exec();

const getOptions = async() =>
  await OptionModel
    .find()
    .select('-__v')
    .lean()
    .exec();

const createOption = async data => {
  const response = await OptionModel
    .create(data);

  response.__v = undefined; // eslint-disable-line no-underscore-dangle

  return response;
};

const updateOption = async data =>
  await OptionModel
    .findOneAndUpdate(data.find, data.update, { new: true, runValidators: true })
    .select('-__v')
    .exec();

const deleteOption = async data =>
  await OptionModel
    .findOneAndRemove(data)
    .exec();

module.exports = {
  getOption,
  getOptions,
  createOption,
  updateOption,
  deleteOption
};

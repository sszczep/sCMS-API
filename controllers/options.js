'use strict';

const OptionModel = require('../models/options.js');

const getOption = async key =>
  await OptionModel
    .findOne({ key })
    .select('key value')
    .lean()
    .exec();

const getOptions = async() =>
  await OptionModel
    .find()
    .select('key value')
    .lean()
    .exec();

const createOption = async data =>
  await OptionModel
    .create(data)
    .exec();

const updateOption = async data =>
  await OptionModel
    .findOneAndUpdate({ key: data.key }, { key: data.newKey, value: data.newValue }, { new: true, runValidators: true })
    .select('key value')
    .exec();

const deleteOption = async key =>
  await OptionModel
    .findOneAndRemove({ key })
    .exec();

module.exports = {
  getOption,
  getOptions,
  createOption,
  updateOption,
  deleteOption
};

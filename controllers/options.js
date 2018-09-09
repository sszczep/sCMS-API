'use strict';

const OptionModel = require('../models/options.js');
const filterObject = require('../utils/filterObject.js');

const getOptions = async data =>
  await OptionModel
    .find()
    .select(data.select || '')
    .setOptions(data.options || {})
    .exec();

const createOption = async data => {
  const response = await OptionModel
    .create(data.toCreate);

  return filterObject(response, data.select);
};

const updateOption = async data => {
  const response = await OptionModel
    .findOneAndUpdate(data.conditions, data.update, { new: true, runValidators: true })
    .exec();

  return filterObject(response, data.select);
};

const deleteOption = async data =>
  await OptionModel
    .findOneAndRemove(data)
    .exec();

module.exports = {
  getOptions,
  createOption,
  updateOption,
  deleteOption
};

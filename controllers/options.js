const OptionModel = require('../models/options.js');

async function getOption(key) {
  return await OptionModel
    .findOne({ key })
    .select('key value')
    .lean()
    .exec()
}

async function getOptions() {
  return await OptionModel
    .find()
    .select('key value')
    .lean()
    .exec()
}

async function createOption(data) {
  const newOption = new OptionModel(data);
  return await newOption.save();
}

async function updateOption(data) {
  return await OptionModel
    .findOneAndUpdate({ key: data.key }, { key: data.newKey, value: data.newValue }, { new: true, runValidators: true })
    .select('key value')
    .exec()
}

async function deleteOption(key) {
  return await OptionModel
    .findOneAndRemove({ key })
    .exec()
}

module.exports = {
  getOption,
  getOptions,
  createOption,
  updateOption,
  deleteOption
}

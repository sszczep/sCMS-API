const PageModel = require('../models/pages.js');

async function getPages() {
  return await PageModel
    .find()
    .select('name url')
    .lean()
    .exec()
}

async function createPage(data) {
  const newPage = new PageModel(data);
  return await newPage.save();
}

async function updatePage(data) {
  return await PageModel
    .findOneAndUpdate({ name: data.name }, { name: data.newName, url: data.newUrl }, { new: true, runValidators: true })
    .select('name url')
    .exec()
}

async function deletePage(name) {
  return await PageModel
    .findOneAndRemove({ name })
    .exec()
}

module.exports = {
  getPages,
  createPage,
  updatePage,
  deletePage
}

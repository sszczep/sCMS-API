const mongoose = require('../database')

const Page = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model("Page", Page)

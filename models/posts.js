const mongoose = require('../database')

const Post = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  previewText: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  friendlyUrl: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model("Post", Post)

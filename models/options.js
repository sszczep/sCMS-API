const mongoose = require('../database')
const CustomError = require('../utils/CustomError.js')

const Option = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model("Option", Option)

const mongoose = require('mongoose')

const editionSchema = new mongoose.Schema({
  editionDate: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  headlineCount: {
    type: Number,
    default: 0,
  },
  categories: [{
    type: String,
  }],
})

module.exports = mongoose.model('Edition', editionSchema)

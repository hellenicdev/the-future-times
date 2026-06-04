const mongoose = require('mongoose')

const trendSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    index: true,
  },
  source: {
    type: String,
    enum: ['manual', 'generated', 'system'],
    default: 'manual',
  },
  weight: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.8,
  },
  description: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Trend', trendSchema)

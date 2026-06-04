const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  editionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Edition',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  summary: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 50,
  },
  futureDate: {
    type: String,
    required: true,
  },
  confidenceExplanation: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
})

articleSchema.index({ title: 'text', summary: 'text', body: 'text', category: 'text' })

module.exports = mongoose.model('Article', articleSchema)

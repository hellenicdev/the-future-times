const mongoose = require('mongoose')

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  followedCategories: [{
    type: String,
  }],
})

module.exports = mongoose.model('UserPreference', userPreferenceSchema)

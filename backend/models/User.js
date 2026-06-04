const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  subscription: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },
}, {
  timestamps: true,
})

userSchema.index({ email: 1 })

module.exports = mongoose.model('User', userSchema)

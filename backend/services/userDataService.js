const mongoose = require('mongoose')
const User = require('../models/User')
const SavedArticle = require('../models/SavedArticle')
const UserPreference = require('../models/UserPreference')
const mockDb = require('./mockDb')

function isConnected() {
  return mongoose.connection.readyState === 1
}

async function createUser(userData) {
  if (isConnected()) {
    const user = new User(userData)
    return user.save()
  }
  return mockDb.saveUser(userData)
}

async function findUserByEmail(email) {
  if (isConnected()) {
    try {
      return await User.findOne({ email })
    } catch { return null }
  }
  return mockDb.findUserByEmail(email)
}

async function saveSavedArticle(data) {
  if (isConnected()) {
    const entry = new SavedArticle(data)
    return entry.save()
  }
  return mockDb.saveSavedArticle(data)
}

async function getSavedArticles(userId) {
  if (isConnected()) {
    try {
      return await SavedArticle.find({ userId }).populate('articleId', 'title slug category summary confidence futureDate')
    } catch { return [] }
  }
  return mockDb.findSavedArticlesByUser(userId)
}

async function removeSavedArticle(userId, articleId) {
  if (isConnected()) {
    try {
      await SavedArticle.deleteOne({ userId, articleId })
    } catch { /* ignore */ }
    return
  }
  return mockDb.deleteSavedArticle(userId, articleId)
}

async function findSavedArticle(userId, articleId) {
  if (isConnected()) {
    try {
      return await SavedArticle.findOne({ userId, articleId })
    } catch { return null }
  }
  return mockDb.findSavedArticle(userId, articleId)
}

async function upsertPreference(userId, data) {
  if (isConnected()) {
    try {
      return await UserPreference.findOneAndUpdate(
        { userId },
        { followedCategories: data.followedCategories || [] },
        { upsert: true, new: true }
      )
    } catch { return null }
  }
  return mockDb.savePreference({ userId, ...data })
}

async function getPreference(userId) {
  if (isConnected()) {
    try {
      return await UserPreference.findOne({ userId })
    } catch { return null }
  }
  return mockDb.findPreferenceByUser(userId)
}

module.exports = {
  createUser,
  findUserByEmail,
  saveSavedArticle,
  getSavedArticles,
  removeSavedArticle,
  findSavedArticle,
  upsertPreference,
  getPreference,
}

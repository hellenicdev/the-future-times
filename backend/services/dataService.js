const mongoose = require('mongoose')
const Edition = require('../models/Edition')
const Article = require('../models/Article')
const mockDb = require('./mockDb')

function isConnected() {
  return mongoose.connection.readyState === 1
}

async function saveEdition(data) {
  if (isConnected()) {
    const clean = data.toObject ? data.toObject() : { ...data }
    delete clean._id
    return Edition.findOneAndUpdate(
      { editionDate: clean.editionDate },
      { $set: clean },
      { upsert: true, new: true, lean: true }
    )
  }
  return mockDb.saveEdition(data)
}

async function findEditionByDate(date) {
  if (isConnected()) {
    try {
      return await Edition.findOne({ editionDate: date }).lean()
    } catch { return null }
  }
  return mockDb.findEditionByDate(date)
}

async function saveArticle(data) {
  if (isConnected()) {
    const article = await new Article(data).save()
    return article.toObject()
  }
  return mockDb.saveArticle(data)
}

async function findArticleBySlug(slug) {
  if (isConnected()) {
    try {
      return await Article.findOne({ slug }).lean()
    } catch { return null }
  }
  return mockDb.findArticleBySlug(slug)
}

async function findArticlesByEditionId(editionId) {
  if (isConnected()) {
    try {
      return await Article.find({ editionId }).lean()
    } catch { return [] }
  }
  return mockDb.findArticlesByEditionId(editionId)
}

async function searchArticles({ q, category, limit, offset }) {
  if (isConnected()) {
    const query = {}
    if (q) query.$text = { $search: q }
    if (category) query.category = category
    const articles = await Article.find(query)
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(parseInt(offset, 10) || 0)
      .limit(parseInt(limit, 10) || 20)
      .select('title slug category summary confidence futureDate')
      .lean()
    const total = await Article.countDocuments(query)
    return { articles, total }
  }
  return mockDb.searchArticles({ q, category, limit, offset })
}

async function deleteArticlesByEditionId(editionId) {
  if (isConnected()) {
    try {
      await Article.deleteMany({ editionId })
    } catch { /* ignore */ }
    return
  }
  return mockDb.deleteArticlesByEditionId(editionId)
}

async function getDistinctCategories() {
  if (isConnected()) {
    try {
      return await Article.distinct('category')
    } catch { return [] }
  }
  return mockDb.getDistinctCategories()
}

module.exports = {
  saveEdition,
  findEditionByDate,
  saveArticle,
  findArticleBySlug,
  findArticlesByEditionId,
  searchArticles,
  getDistinctCategories,
  deleteArticlesByEditionId,
}

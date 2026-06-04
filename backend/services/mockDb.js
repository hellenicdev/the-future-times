const config = require('../config')

const store = {
  editions: new Map(),
  articles: new Map(),
}

async function saveEdition(editionData) {
  store.editions.set(editionData.editionDate, {
    ...editionData,
    _id: editionData.editionDate,
  })
  return store.editions.get(editionData.editionDate)
}

async function findEditionByDate(date) {
  return store.editions.get(date) || null
}

async function saveArticle(articleData) {
  store.articles.set(articleData.slug, {
    ...articleData,
    _id: articleData.slug,
    createdAt: new Date().toISOString(),
  })
  return store.articles.get(articleData.slug)
}

async function findArticleBySlug(slug) {
  return store.articles.get(slug) || null
}

async function findArticlesByEditionId(editionId) {
  return Array.from(store.articles.values()).filter(a => a.editionId === editionId)
}

async function searchArticles({ q, category, limit = 20, offset = 0 }) {
  let results = Array.from(store.articles.values())
  if (q) {
    const lower = q.toLowerCase()
    results = results.filter(a =>
      a.title.toLowerCase().includes(lower) ||
      a.summary.toLowerCase().includes(lower) ||
      a.body.toLowerCase().includes(lower) ||
      a.category.toLowerCase().includes(lower)
    )
  }
  if (category) {
    results = results.filter(a => a.category === category)
  }
  const total = results.length
  results = results.slice(offset, offset + limit)
  return { articles: results, total }
}

async function getDistinctCategories() {
  const cats = new Set()
  for (const article of store.articles.values()) {
    cats.add(article.category)
  }
  return Array.from(cats).sort()
}

async function countEditions() {
  return store.editions.size
}

// === User operations ===
async function saveUser(userData) {
  const id = userData._id || `user_${Date.now()}`
  const user = { ...userData, _id: id, createdAt: new Date().toISOString() }
  store.users = store.users || new Map()
  store.users.set(user.email, user)
  return user
}

async function findUserByEmail(email) {
  store.users = store.users || new Map()
  return store.users.get(email) || null
}

// === Saved articles ===
async function saveSavedArticle(data) {
  store.savedArticles = store.savedArticles || []
  store.savedArticles.push(data)
  return data
}

async function findSavedArticlesByUser(userId) {
  store.savedArticles = store.savedArticles || []
  const saved = store.savedArticles.filter(s => s.userId === userId)
  return saved.map(s => {
    const article = store.articles.get(s.articleId)
    return { ...s, articleId: article || s.articleId }
  })
}

async function deleteSavedArticle(userId, articleId) {
  store.savedArticles = store.savedArticles || []
  store.savedArticles = store.savedArticles.filter(s => !(s.userId === userId && s.articleId === articleId))
}

async function findSavedArticle(userId, articleId) {
  store.savedArticles = store.savedArticles || []
  return store.savedArticles.find(s => s.userId === userId && s.articleId === articleId) || null
}

// === Preferences ===
async function savePreference(data) {
  store.preferences = store.preferences || new Map()
  store.preferences.set(data.userId, data)
  return data
}

async function findPreferenceByUser(userId) {
  store.preferences = store.preferences || new Map()
  return store.preferences.get(userId) || null
}

module.exports = {
  saveEdition,
  findEditionByDate,
  saveArticle,
  findArticleBySlug,
  findArticlesByEditionId,
  searchArticles,
  getDistinctCategories,
  countEditions,
  isMockMode: () => !config.mongodbUri,
  saveUser,
  findUserByEmail,
  saveSavedArticle,
  findSavedArticlesByUser,
  deleteSavedArticle,
  findSavedArticle,
  savePreference,
  findPreferenceByUser,
}

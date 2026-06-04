const dataService = require('../services/dataService')
const { getOrCreateEdition } = require('../services/editionGenerator')

async function getEdition(req, res, next) {
  try {
    const { date } = req.params
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' })
    }
    const result = await getOrCreateEdition(date)
    res.json({
      edition: {
        date: result.edition.editionDate,
        generatedAt: result.edition.generatedAt,
        headlineCount: result.edition.headlineCount,
      },
      articles: result.articles.map(a => ({
        id: a._id,
        title: a.title,
        slug: a.slug,
        category: a.category,
        summary: a.summary,
        confidence: a.confidence,
      })),
      fromCache: result.fromCache,
    })
  } catch (err) {
    next(err)
  }
}

async function getArticle(req, res, next) {
  try {
    const { slug } = req.params
    const article = await dataService.findArticleBySlug(slug)
    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }
    res.json({
      id: article._id,
      title: article.title,
      slug: article.slug,
      category: article.category,
      summary: article.summary,
      body: article.body,
      confidence: article.confidence,
      confidenceExplanation: article.confidenceExplanation,
      futureDate: article.futureDate,
      createdAt: article.createdAt,
    })
  } catch (err) {
    next(err)
  }
}

async function getCategories(req, res, next) {
  try {
    const categories = await dataService.getDistinctCategories()
    res.json({ categories })
  } catch (err) {
    next(err)
  }
}

async function searchArticles(req, res, next) {
  try {
    const { q, category, limit = '20', offset = '0' } = req.query
    const result = await dataService.searchArticles({ q, category, limit, offset })
    res.json(result)
  } catch (err) {
    next(err)
  }
}

async function generateEdition(req, res, next) {
  try {
    const { date } = req.body
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Valid date (YYYY-MM-DD) required' })
    }
    const existing = await dataService.findEditionByDate(date)
    if (existing) {
      return res.json({ message: 'Edition already exists', date, regenerated: false })
    }
    const result = await getOrCreateEdition(date)
    res.json({ message: 'Edition generated', date, articles: result.articles.length, regenerated: false })
  } catch (err) {
    next(err)
  }
}

async function getEditionByDate(req, res, next) {
  try {
    const { date } = req.params
    const edition = await dataService.findEditionByDate(date)
    if (!edition) {
      return res.status(404).json({ error: 'No edition found for this date' })
    }
    const articles = await dataService.findArticlesByEditionId(edition._id)
    res.json({ edition: { date: edition.editionDate, headlineCount: edition.headlineCount }, articles })
  } catch (err) {
    next(err)
  }
}

module.exports = { getEdition, getArticle, getCategories, searchArticles, generateEdition, getEditionByDate }

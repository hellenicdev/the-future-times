const dataService = require('./dataService')
const { generateArticle, resetUsedSlugs } = require('./articleGenerator')
const { generateTrends } = require('./trendEngine')

const CATEGORIES = ['Technology', 'Business', 'Science', 'Climate', 'World', 'Health', 'Sports', 'Entertainment']
const ARTICLES_PER_CATEGORY = 4

async function getOrCreateEdition(editionDate) {
  const existing = await dataService.findEditionByDate(editionDate)
  if (existing) {
    const articles = await dataService.findArticlesByEditionId(existing._id)
    if (articles.length > 0) {
      return { edition: existing, articles, fromCache: true }
    }
  }

  if (existing) {
    resetUsedSlugs()
    await dataService.deleteArticlesByEditionId(existing._id)
    await dataService.saveEdition({
      ...existing,
      headlineCount: 0,
      generatedAt: new Date(),
    })
  }

  const edition = existing || await dataService.saveEdition({
    editionDate,
    headlineCount: 0,
    categories: CATEGORIES,
    generatedAt: new Date(),
  })

  const allArticles = []
  for (const category of CATEGORIES) {
    const trends = generateTrends(category)
    const articlePromises = []
    for (let i = 0; i < ARTICLES_PER_CATEGORY; i++) {
      articlePromises.push(generateArticle({ futureDate: editionDate, category, trends }))
    }
    const categoryArticles = await Promise.all(articlePromises)
    for (const articleData of categoryArticles) {
      const article = await dataService.saveArticle({
        ...articleData,
        editionId: edition._id,
      })
      allArticles.push(article)
    }
  }

  edition.headlineCount = allArticles.length
  await dataService.saveEdition(edition)

  return { edition, articles: allArticles, fromCache: false }
}

module.exports = { getOrCreateEdition, CATEGORIES }

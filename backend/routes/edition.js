const express = require('express')
const router = express.Router()
const { auth, optionalAuth } = require('../middleware/auth')
const admin = require('../middleware/admin')
const turnstile = require('../middleware/turnstile')
const {
  getEdition,
  getArticle,
  getCategories,
  searchArticles,
  generateEdition,
} = require('../controllers/editionController')

router.get('/edition/:date', optionalAuth, getEdition)
router.get('/article/:slug', optionalAuth, getArticle)
router.get('/categories', getCategories)
router.get('/search', searchArticles)
router.post('/generate', auth, admin, turnstile, generateEdition)

module.exports = router

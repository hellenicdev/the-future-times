const express = require('express')
const router = express.Router()
const { auth } = require('../middleware/auth')
const {
  getProfile,
  getSavedArticles,
  saveArticle,
  unsaveArticle,
  getPreferences,
  updatePreferences,
} = require('../controllers/authController')

router.get('/profile', auth, getProfile)
router.get('/saved', auth, getSavedArticles)
router.post('/saved', auth, saveArticle)
router.delete('/saved/:articleId', auth, unsaveArticle)
router.get('/preferences', auth, getPreferences)
router.put('/preferences', auth, updatePreferences)

module.exports = router

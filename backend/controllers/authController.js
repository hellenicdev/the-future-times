const dataService = require('../services/userDataService')
const mockDb = require('../services/mockDb')
const Article = require('../models/Article')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }
    const existing = await dataService.findUserByEmail(email.toLowerCase())
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await dataService.createUser({ email: email.toLowerCase(), passwordHash, name })
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role || 'user' }, config.jwtSecret, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role || 'user' } })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }
    const user = await dataService.findUserByEmail(email.toLowerCase())
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role || 'user' }, config.jwtSecret, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role || 'user' } })
  } catch (err) {
    next(err)
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await dataService.findUserByEmail(req.user.email)
    if (!user) return res.status(404).json({ error: 'User not found' })
    const { passwordHash, ...safe } = user
    res.json({ user: safe })
  } catch (err) {
    next(err)
  }
}

async function getSavedArticles(req, res, next) {
  try {
    const saved = await dataService.getSavedArticles(req.user.id)
    const articles = saved.map(s => {
      const a = s.articleId || s
      return typeof a === 'object' ? a : null
    }).filter(Boolean)
    res.json({ articles })
  } catch (err) {
    next(err)
  }
}

async function saveArticle(req, res, next) {
  try {
    const { articleId } = req.body
    if (!articleId) return res.status(400).json({ error: 'articleId required' })
    const existing = await dataService.findSavedArticle(req.user.id, articleId)
    if (existing) return res.json({ message: 'Already saved' })
    await dataService.saveSavedArticle({ userId: req.user.id, articleId, createdAt: new Date() })
    res.status(201).json({ message: 'Article saved' })
  } catch (err) {
    next(err)
  }
}

async function unsaveArticle(req, res, next) {
  try {
    const { articleId } = req.params
    await dataService.removeSavedArticle(req.user.id, articleId)
    res.json({ message: 'Article unsaved' })
  } catch (err) {
    next(err)
  }
}

async function getPreferences(req, res, next) {
  try {
    let prefs = await dataService.getPreference(req.user.id)
    if (!prefs) {
      prefs = await dataService.upsertPreference(req.user.id, { followedCategories: [] })
    }
    res.json({ preferences: prefs })
  } catch (err) {
    next(err)
  }
}

async function updatePreferences(req, res, next) {
  try {
    const { followedCategories } = req.body
    const prefs = await dataService.upsertPreference(req.user.id, { followedCategories: followedCategories || [] })
    res.json({ preferences: prefs })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, getProfile, getSavedArticles, saveArticle, unsaveArticle, getPreferences, updatePreferences }

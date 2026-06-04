const config = require('../config')

async function turnstile(req, res, next) {
  if (!config.turnstileSecret) {
    return next()
  }
  const token = req.body && req.body.turnstileToken
  if (!token) {
    return res.status(400).json({ error: 'Turnstile token required' })
  }
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(config.turnstileSecret)}&response=${encodeURIComponent(token)}`,
    })
    const data = await response.json()
    if (!data.success) {
      return res.status(403).json({ error: 'Turnstile verification failed' })
    }
    next()
  } catch {
    return res.status(500).json({ error: 'Turnstile verification error' })
  }
}

module.exports = turnstile

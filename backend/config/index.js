require('dotenv').config()

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  mongodbUri: process.env.MONGODB_URI,
  groqApiKey: process.env.GROQ_API_KEY,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  turnstileSecret: process.env.TURNSTILE_SECRET,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5500',
  nodeEnv: process.env.NODE_ENV || 'development',
  isMockMode: !process.env.GROQ_API_KEY,
  rateLimit: {
    anonymous: 50,
    windowMs: 15 * 60 * 1000,
  },
}

module.exports = config

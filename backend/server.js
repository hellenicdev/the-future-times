const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const config = require('./config')
const connectDB = require('./config/db')
const editionRoutes = require('./routes/edition')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const errorHandler = require('./middleware/errorHandler')

const app = express()

connectDB()

app.use(helmet())
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.anonymous,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

app.use('/api', editionRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`)
  if (config.isMockMode) {
    console.log('GROQ_API_KEY not set — running in mock mode with template articles')
  }
})

module.exports = app

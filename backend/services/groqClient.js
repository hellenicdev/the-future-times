const Groq = require('groq-sdk')
const config = require('../config')

let groq = null

function getClient() {
  if (!groq && config.groqApiKey) {
    groq = new Groq({ apiKey: config.groqApiKey })
  }
  return groq
}

async function generateCompletion(messages, options = {}) {
  const client = getClient()
  if (!client) {
    return null
  }
  const completion = await client.chat.completions.create({
    model: options.model || 'llama-3.3-70b-versatile',
    messages,
    temperature: options.temperature ?? 0.8,
    max_tokens: options.maxTokens || 2048,
    response_format: options.responseFormat || { type: 'json_object' },
  })
  return completion.choices[0]?.message?.content || null
}

module.exports = { getClient, generateCompletion }

const config = require('../config')

const MOCK_TRENDS = {
  'Technology': [
    'AI assistants are ubiquitous in everyday life',
    'Quantum computing has reached commercial viability',
    'Brain-computer interfaces are mainstream for communication',
    'Edge AI powers billions of IoT devices globally',
    'Autonomous coding agents write 80% of production software',
  ],
  'Business': [
    'Decentralized autonomous organizations (DAOs) rival traditional corporations',
    'Global digital currency trade has surpassed physical currency',
    'Remote work is the default for knowledge workers worldwide',
    'AI-augmented productivity has created a 4-day workweek standard',
    'Subscription economies dominate all major industries',
  ],
  'Science': [
    'Fusion energy has achieved grid parity in multiple nations',
    'Gene editing has eliminated several hereditary diseases',
    'Lab-grown organs are routinely transplanted',
    'Longevity research has extended human lifespan by 20 years',
    'Mars colony maintains permanent human presence',
  ],
  'Climate': [
    'Global carbon emissions have been reduced by 60% from 2025 levels',
    'Direct air capture operates at scale across desert regions',
    'Vertical farming supplies 30% of urban food consumption',
    'Solar plus storage is the cheapest energy source worldwide',
    'Climate restoration projects are reversing Arctic ice loss',
  ],
  'World': [
    'The European Union has evolved into a full digital federation',
    'Africa has emerged as a global tech manufacturing hub',
    'Space-based internet provides connectivity to every human on Earth',
    'Global population has stabilized at 9 billion',
    'Universal basic income pilots are active in 40 countries',
  ],
  'Health': [
    'Personalized mRNA vaccines are annual and tailored to individual genetics',
    'AI diagnostics outperform humans in all major imaging specialties',
    'Wearable health monitors have reduced emergency room visits by 40%',
    'CRISPR therapies are first-line treatment for dozens of genetic conditions',
    'Mental health is managed via AI therapy with outcomes matching human therapists',
  ],
  'Sports': [
    'AI referees have eliminated human error in all major sports leagues',
    'Bionic prosthetics have created new Paralympic record categories',
    'Esports viewership exceeds traditional sports globally',
    'Neural training simulations accelerate athlete development by 3x',
    'Virtual reality stadiums allow global audiences to experience games live',
  ],
  'Entertainment': [
    'AI-generated films win major awards at international festivals',
    'Interactive AI narratives allow viewers to shape storylines in real-time',
    'Holographic concerts are the standard for live music performances',
    'Personalized content streams are generated on-demand by AI',
    'Virtual influencers command larger audiences than human celebrities',
  ],
}

const DEFAULT_TRENDS = [
  'Technological acceleration continues at an exponential pace',
  'Climate change has driven major policy shifts worldwide',
  'Global population demographics have shifted significantly',
  'Artificial intelligence has transformed every major industry',
  'Space exploration has entered a new era of colonization',
]

function generateTrends(category) {
  const trends = MOCK_TRENDS[category] || DEFAULT_TRENDS
  return [...trends].sort(() => Math.random() - 0.5).slice(0, 3)
}

module.exports = { generateTrends, MOCK_TRENDS }

// App state
let currentDate = getDefaultDate()
let currentArticles = []
let currentEdition = null

function getDefaultDate() {
  const d = new Date()
  const year = Math.min(d.getFullYear(), 2050)
  return `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDisplayDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Load edition
async function loadEdition(date) {
  const content = document.getElementById('content')
  if (!content) return
  content.innerHTML = '<div class="loading"><div class="spinner"></div><p>Generating tomorrow\'s news...</p></div>'

  try {
    const data = await apiFetch(`/edition/${date}`)
    currentArticles = data.articles
    currentEdition = data.edition
    renderEdition(data, date)
  } catch (err) {
    content.innerHTML = `<div class="loading"><p style="color:var(--red)">Error: ${err.message}</p></div>`
  }
}

// Render full edition
function renderEdition(data, date) {
  const content = document.getElementById('content')
  const articles = data.articles
  if (!articles || articles.length === 0) {
    content.innerHTML = '<div class="loading"><p>No articles found for this date.</p></div>'
    return
  }

  // Sort: pick first as hero, rest in grid
  const hero = articles[0]
  const rest = articles.slice(1)

  let html = ''

  // Date display
  html += `<div class="hero-article">`
  html += `<span class="category-badge">${hero.category} &mdash; Top Story</span>`
  html += `<h2><a href="article.html?slug=${hero.slug}">${hero.title}</a></h2>`
  html += `<p class="summary">${hero.summary}</p>`
  html += `<p class="meta">Prediction Confidence: ${hero.confidence}% &middot; ${formatShortDate(date)}</p>`
  html += `</div>`

  // Grid
  html += `<div class="article-grid">`
  for (const article of rest) {
    html += `<div class="article-card">`
    html += `<span class="category-badge">${article.category}</span>`
    html += `<h3><a href="article.html?slug=${article.slug}">${article.title}</a></h3>`
    html += `<p class="summary">${article.summary}</p>`
    html += `<p class="meta">Confidence: ${article.confidence}%</p>`
    html += `<div class="confidence-bar"><div class="confidence-fill" style="width:${article.confidence}%"></div></div>`
    html += `</div>`
  }
  html += `</div>`

  content.innerHTML = html
}

// Timeline slider
function initTimeline() {
  const slider = document.getElementById('timeline-slider')
  const display = document.getElementById('timeline-date-display')
  if (!slider) return

  const currentYear = Math.min(new Date().getFullYear(), 2050)
  slider.value = currentYear
  display.textContent = formatDisplayDate(currentDate)

  slider.addEventListener('input', () => {
    const year = parseInt(slider.value, 10)
    const month = String(currentDate.split('-')[1]).padStart(2, '0')
    const day = String(currentDate.split('-')[2]).padStart(2, '0')
    const newDate = `${year}-${month}-${day}`
    display.textContent = formatDisplayDate(newDate)
  })

  slider.addEventListener('change', () => {
    const year = parseInt(slider.value, 10)
    const month = String(currentDate.split('-')[1]).padStart(2, '0')
    const day = String(currentDate.split('-')[2]).padStart(2, '0')
    currentDate = `${year}-${month}-${day}`
    loadEdition(currentDate)
    updateMastheadDate(currentDate)
  })
}

function updateMastheadDate(date) {
  const el = document.getElementById('masthead-date')
  if (el) el.textContent = formatDisplayDate(date)
}

// Initialize homepage
async function initHome() {
  currentDate = getDefaultDate()
  const mastheadDate = document.getElementById('masthead-date')
  if (mastheadDate) mastheadDate.textContent = formatDisplayDate(currentDate)
  initTimeline()
  await loadEdition(currentDate)
}

// Auth helpers
function showAuthLinks() {
  const container = document.getElementById('auth-links')
  if (!container) return
  if (isLoggedIn()) {
    const user = getUser()
    container.innerHTML = `
      <span>${user?.email || 'User'}</span>
      <a href="saved.html">Saved</a>
      <a href="#" id="logout-btn">Logout</a>
    `
    document.getElementById('logout-btn')?.addEventListener('click', (e) => {
      e.preventDefault()
      setToken(null)
      setUser(null)
      showAuthLinks()
      window.location.reload()
    })
  } else {
    container.innerHTML = `<a href="login.html">Login</a><a href="register.html">Register</a>`
  }
}

// Init on page load
document.addEventListener('DOMContentLoaded', () => {
  showAuthLinks()
  if (document.getElementById('content')) {
    initHome()
  }
})

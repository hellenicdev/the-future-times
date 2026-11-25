async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path}`
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  let res
  try {
    res = await fetch(url, { ...options, headers })
  } catch {
    throw new Error('Could not reach the server. It may be waking up, please try again in a moment.')
  }
  let data = {}
  try {
    data = await res.json()
  } catch {
    // Non-JSON response (e.g. a gateway error page)
  }
  if (res.status === 401 && token) {
    // Expired or invalid session
    setToken(null)
    setUser(null)
  }
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed: ${res.status}`)
  }
  return data
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getToken() {
  return localStorage.getItem('token')
}

function setToken(token) {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

function getUser() {
  const data = localStorage.getItem('user')
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

function setUser(user) {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  } else {
    localStorage.removeItem('user')
  }
}

function isLoggedIn() {
  return !!getToken()
}

async function renderTurnstile(containerId) {
  if (typeof turnstile !== 'undefined' && TURNSTILE_SITE_KEY) {
    turnstile.render(`#${containerId}`, {
      sitekey: TURNSTILE_SITE_KEY,
    })
  }
}

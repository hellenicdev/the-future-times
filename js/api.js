async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path}`
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const res = await fetch(url, { ...options, headers })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`)
  }
  return data
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
  return data ? JSON.parse(data) : null
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

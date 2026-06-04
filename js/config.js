const API_URL = (() => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000/api'
  }
  return 'https://future-times.onrender.com/api'
})()

const TURNSTILE_SITE_KEY = '0x4AAAAAADewRHb-jdln-Mn1'

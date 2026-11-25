# The Future Times

An AI-powered newspaper from tomorrow. Pick any date up to 2050 and The Future Times generates a full edition of plausible future headlines, each with a prediction-confidence score and an explanation of the reasoning behind it.

**Live:** https://hellenicdev.eu/the-future-times/

## Features

- Daily AI-generated editions with a hero story and article grid
- Timeline slider to jump to any year up to 2050
- Browse by category, full-text search and a timeline view
- Prediction confidence meter and explanation on every article
- Accounts with JWT auth: save articles to read later
- Cloudflare Turnstile on sign-up and login
- Classic newspaper design, responsive and keyboard-friendly

## Tech stack

| Layer | Tech |
| --- | --- |
| Frontend | Static HTML, CSS and vanilla JavaScript (GitHub Pages) |
| Backend | Node.js, Express, JWT, bcrypt |
| AI | Groq API |
| Database | MongoDB via Mongoose (in-memory mock fallback for local dev) |
| Hosting | GitHub Pages (frontend), Render (API) |

## Getting started

Requirements: Node.js 18+.

```bash
git clone https://github.com/hellenicdev/the-future-times.git
cd the-future-times/backend
cp .env.template .env   # fill in the values
npm install
npm run dev             # API on http://localhost:3000
```

Serve the repo root with any static server (for example `npx serve .`). When opened on `localhost`, the frontend talks to `http://localhost:3000/api` automatically (see `js/config.js`).

### Environment variables (`backend/.env`)

| Name | Purpose |
| --- | --- |
| `PORT` | API port (default `3000`) |
| `MONGODB_URI` | MongoDB connection string |
| `GROQ_API_KEY` | Groq API key for article generation |
| `JWT_SECRET` | Secret used to sign auth tokens (required in production) |
| `TURNSTILE_SECRET` | Cloudflare Turnstile secret key |
| `FRONTEND_URL` | Public URL of the frontend |
| `NODE_ENV` | `development` or `production` |

Never commit real values. Only `backend/.env.template` belongs in git.

## Project structure

```
the-future-times/
├── index.html, article.html, category.html, categories.html,
│   search.html, timeline.html, saved.html, login.html, register.html
├── css/style.css          Newspaper theme
├── js/
│   ├── config.js          API URL and Turnstile site key
│   ├── api.js             fetch wrapper, auth storage, HTML escaping
│   └── app.js             Homepage edition rendering and timeline
└── backend/
    ├── config/            Env and database config
    ├── controllers/       Auth and edition handlers
    ├── middleware/        Auth, admin, Turnstile, error handling
    ├── models/            Article, Edition, User, SavedArticle, Trend, UserPreference
    ├── routes/            /api routes
    ├── services/          Groq client, trend engine, article and edition generators
    └── server.js          Express entry point
```

## License

© 2026 HellenicDev. All rights reserved.

Built by [HellenicDev](https://hellenicdev.eu).

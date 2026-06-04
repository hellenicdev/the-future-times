const slugify = require('slugify')

function generateSlug(title) {
  return slugify(title, { lower: true, strict: true, trim: true }).slice(0, 80)
}

module.exports = generateSlug

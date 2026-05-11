/**
 * Catalina Codex – Cloudflare Worker
 * Proxies Google Sheets CSV data and formats it into clean JSON.
 *
 * Routes:
 *   GET /birthdays       → birthday list from the Birthdays sheet
 *   GET /survey_results  → combined quotes from the 2022 + 2023 survey sheets
 *   GET /photos          → photo list from a Photos sheet (optional, set PHOTOS_SHEET_ID)
 *
 * Sheets must be shared "Anyone with the link can view" for the CSV export to work.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Published-to-web CSV URLs (File → Share → Publish to web → CSV)
const BIRTHDAY_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7wHkBZRdyAf-3BrQVoWOzRpO77BDy3QB6b9j3Ex9HtDqc_E02CmXtpEa_b3i3YksnNWx1CLFgb8ZX/pub?output=csv'
const SURVEY_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSiFzRN9_jJCPhybaFgrfbpYJ1lX1sBOmDKjHdzEbYdxxhQI5IMQFjA6_aCMgxfnlQZaOKYNCidxAy8/pub?output=csv'

async function fetchCSV(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'CatalinaCodexWorker/1.0' } })
  if (!res.ok) throw new Error(`CSV fetch failed (${url}): ${res.status}`)
  return res.text()
}

function csvToRows(csv) {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return []
  const headers = parseCSVLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line)
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
  })
}

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

function findCol(row, candidates) {
  for (const k of Object.keys(row)) {
    if (candidates.some((c) => k.toLowerCase().includes(c.toLowerCase()))) return row[k]
  }
  return ''
}

function shapeBirthdays(rows) {
  return rows
    .map((r) => {
      const name = findCol(r, ['name', 'full name', 'person'])
      const date = findCol(r, ['date', 'birthday', 'dob', 'birth'])
      const emoji = findCol(r, ['emoji', 'icon']) || '🎂'
      return { name, date, emoji }
    })
    .filter((r) => r.name && r.date)
}

function extractQuotes(rows) {
  const quotes = []
  for (const row of rows) {
    for (const [key, val] of Object.entries(row)) {
      const lower = key.toLowerCase()
      if (lower.includes('timestamp') || lower.includes('email') || lower === 'name') continue
      const text = val.trim()
      if (text.length > 15 && /\s/.test(text)) {
        quotes.push(`"${text}"`)
      }
    }
  }
  return quotes
}

function shapePhotos(rows) {
  return rows
    .filter((r) => r.URL)
    .map((r) => ({
      url: r.URL,
      caption: r.Caption || '',
      year: r.Year ? parseInt(r.Year) : new Date().getFullYear(),
    }))
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS })
    }

    const url = new URL(request.url)
    const path = url.pathname.replace(/^\//, '')

    try {
      let data

      if (path === 'birthdays') {
        const csv = await fetchCSV(BIRTHDAY_CSV)
        data = shapeBirthdays(csvToRows(csv))

      } else if (path === 'survey_results') {
        const csv = await fetchCSV(SURVEY_CSV)
        const quotes = extractQuotes(csvToRows(csv), '')
        data = { quotes }

      } else if (path === 'photos') {
        const photosUrl = env.PHOTOS_CSV_URL
        if (!photosUrl) return Response.json({ error: 'PHOTOS_CSV_URL not set' }, { status: 500, headers: CORS })
        const csv = await fetchCSV(photosUrl)
        data = shapePhotos(csvToRows(csv))

      } else {
        return Response.json({ error: 'Not found' }, { status: 404, headers: CORS })
      }

      return Response.json(data, {
        headers: { ...CORS, 'Cache-Control': 'public, max-age=300' },
      })
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers: CORS })
    }
  },
}

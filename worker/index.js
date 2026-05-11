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

const BIRTHDAY_SHEET_ID = '1tCzlHN3dYyesQmR7IW8WGAIfa5jXlRS-YUIYjPknek8'
const SURVEY_2022_ID = '1GA1JL1F64CcFGFvEaEr3lKmfvJ_QVxV67OVSEqq84ME'
const SURVEY_2023_ID = '17-ftJaNzxw5Ry2EU9ao1sbgB5p_gLh1RhN9dO1IXOD0'

async function fetchSheet(sheetId, gid = '0') {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sheet fetch failed (${sheetId}): ${res.status}`)
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

function shapeBirthdays(rows) {
  return rows
    .filter((r) => r.Name && r.Date)
    .map((r) => ({
      name: r.Name,
      date: r.Date,
      emoji: r.Emoji || '🎂',
    }))
}

function extractQuotes(rows, year) {
  const quotes = []
  for (const row of rows) {
    for (const [key, val] of Object.entries(row)) {
      const lower = key.toLowerCase()
      // Skip meta columns
      if (lower.includes('timestamp') || lower.includes('email') || lower === 'name') continue
      const text = val.trim()
      // Only use freeform text responses (more than 15 chars, not a single word/number)
      if (text.length > 15 && /\s/.test(text)) {
        quotes.push(`"${text}" — ${year}`)
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
        const csv = await fetchSheet(BIRTHDAY_SHEET_ID)
        data = shapeBirthdays(csvToRows(csv))

      } else if (path === 'survey_results') {
        const [csv2022, csv2023] = await Promise.all([
          fetchSheet(SURVEY_2022_ID),
          fetchSheet(SURVEY_2023_ID),
        ])
        const quotes = [
          ...extractQuotes(csvToRows(csv2022), '2022'),
          ...extractQuotes(csvToRows(csv2023), '2023'),
        ]
        data = { quotes }

      } else if (path === 'photos') {
        const photosId = env.PHOTOS_SHEET_ID
        if (!photosId) return Response.json({ error: 'PHOTOS_SHEET_ID not set' }, { status: 500, headers: CORS })
        const csv = await fetchSheet(photosId)
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

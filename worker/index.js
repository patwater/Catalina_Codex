/**
 * Catalina Codex – Cloudflare Worker
 * Proxies Google Sheets CSV data and formats it into clean JSON.
 *
 * Routes:
 *   GET /birthdays       → rows from the "Birthdays" sheet
 *   GET /survey_results  → rows from the "Survey" sheet
 *   GET /photos          → rows from the "Photos" sheet
 *
 * Set these secrets/vars in Cloudflare:
 *   SHEET_ID  – Google Sheets document ID
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const GID = {
  birthdays: '0',
  survey_results: '1',
  photos: '2',
}

async function fetchSheet(sheetId, gid) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`)
  return res.text()
}

function csvToRows(csv) {
  const lines = csv.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
  })
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

function shapeSurvey(rows) {
  const favoriteMeal = {}
  const mvp = {}
  const quotes = []

  for (const row of rows) {
    if (row['Favorite Meal']) {
      const meal = row['Favorite Meal'].trim()
      favoriteMeal[meal] = (favoriteMeal[meal] || 0) + 1
    }
    if (row['MVP']) {
      const m = row['MVP'].trim()
      mvp[m] = (mvp[m] || 0) + 1
    }
    if (row['Quote']) quotes.push(`"${row['Quote'].trim()}" – Anonymous`)
  }

  return {
    favoriteMeal: Object.entries(favoriteMeal).map(([label, votes]) => ({ label, votes })),
    mvp: Object.entries(mvp).map(([label, votes]) => ({ label, votes })),
    quotes,
  }
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
    const sheetId = env.SHEET_ID

    if (!sheetId) {
      return Response.json({ error: 'SHEET_ID not configured' }, { status: 500, headers: CORS })
    }

    try {
      let data

      if (path === 'birthdays') {
        const csv = await fetchSheet(sheetId, GID.birthdays)
        data = shapeBirthdays(csvToRows(csv))
      } else if (path === 'survey_results') {
        const csv = await fetchSheet(sheetId, GID.survey_results)
        data = shapeSurvey(csvToRows(csv))
      } else if (path === 'photos') {
        const csv = await fetchSheet(sheetId, GID.photos)
        data = shapePhotos(csvToRows(csv))
      } else {
        return Response.json({ error: 'Not found' }, { status: 404, headers: CORS })
      }

      return Response.json(data, {
        headers: {
          ...CORS,
          'Cache-Control': 'public, max-age=300',
        },
      })
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers: CORS })
    }
  },
}

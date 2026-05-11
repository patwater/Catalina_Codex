const BIRTHDAY_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7wHkBZRdyAf-3BrQVoWOzRpO77BDy3QB6b9j3Ex9HtDqc_E02CmXtpEa_b3i3YksnNWx1CLFgb8ZX/pub?output=csv'
const SURVEY_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSiFzRN9_jJCPhybaFgrfbpYJ1lX1sBOmDKjHdzEbYdxxhQI5IMQFjA6_aCMgxfnlQZaOKYNCidxAy8/pub?output=csv'

function parseCSVLine(line) {
  const result = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(cur.trim())
      cur = ''
    } else {
      cur += ch
    }
  }
  result.push(cur.trim())
  return result
}

function csvToRows(text) {
  const lines = text.trim().split('\n').filter(Boolean)
  if (lines.length < 2) return []
  const headers = parseCSVLine(lines[0])
  return lines.slice(1).map((line) => {
    const vals = parseCSVLine(line)
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (vals[i] ?? '').trim()]))
  })
}

function findCol(row, candidates) {
  for (const k of Object.keys(row)) {
    if (candidates.some((c) => k.toLowerCase().includes(c))) return row[k]
  }
  return ''
}

async function fetchCSV(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CSV ${res.status}`)
  return res.text()
}

export async function fetchBirthdays() {
  const text = await fetchCSV(BIRTHDAY_CSV)
  const rows = csvToRows(text)
  return rows
    .map((r) => ({
      name: findCol(r, ['name', 'full name', 'person', 'who']),
      date: findCol(r, ['date', 'birthday', 'dob', 'birth', 'born']),
      emoji: findCol(r, ['emoji', 'icon', 'symbol']) || '🎂',
    }))
    .filter((r) => r.name && r.date)
}

// Returns { text, author } objects so the UI can show who said what.
export async function fetchSurveyQuotes() {
  const text = await fetchCSV(SURVEY_CSV)
  const rows = csvToRows(text)
  const quotes = []
  for (const row of rows) {
    const author = findCol(row, ['name', 'your name', 'first name', 'who are you', 'your first'])
    for (const [key, val] of Object.entries(row)) {
      const lower = key.toLowerCase()
      if (lower.includes('timestamp') || lower.includes('email')) continue
      // Skip the name field itself so we don't quote someone's name back at them
      if (lower === 'name' || lower === 'your name' || lower === 'first name') continue
      const cleaned = val.trim()
      // Only pick up freeform sentence-length answers, not single words/numbers
      if (cleaned.length > 20 && /\s/.test(cleaned)) {
        quotes.push({ text: cleaned, author: author || null })
      }
    }
  }
  // Shuffle so the wall feels fresh on every load
  return quotes.sort(() => Math.random() - 0.5)
}

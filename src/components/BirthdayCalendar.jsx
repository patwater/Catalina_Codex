import { useState, useMemo } from 'react'
import BirthdayCard from './BirthdayCard'

const ADD_BIRTHDAY_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSf-0I7ghEKe_GNUF1yvZOZzRNrI7kJYe7FG_y7AUCVftST_Qg/viewform?usp=header'
const RICH_BOOK_URL = 'https://www.dropbox.com/personal/personal/Pics/Dad%2070th?preview=Dad+70th+%288+%C3%97+10+in%29+PRINT+QUALITY+3-8-22.pdf'

function daysUntil(dateStr) {
  const today = new Date()
  const bday = new Date(dateStr)
  const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate())
  if (next < today) next.setFullYear(today.getFullYear() + 1)
  const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24))
  return diff === 365 ? 0 : diff
}

function getSeason(month) {
  if (month <= 1 || month === 11) return { label: 'Winter', emoji: '❄️' }
  if (month <= 4) return { label: 'Spring', emoji: '🌸' }
  if (month <= 7) return { label: 'Summer', emoji: '☀️' }
  return { label: 'Fall', emoji: '🍂' }
}

function getMonthName(month) {
  return new Date(2000, month, 1).toLocaleDateString('en-US', { month: 'long' })
}

function getThisMonthBirthdays(birthdays) {
  const month = new Date().getMonth()
  return birthdays.filter((b) => new Date(b.date).getMonth() === month)
}

function getNextBirthday(birthdays) {
  return [...birthdays].sort((a, b) => daysUntil(a.date) - daysUntil(b.date))[0]
}

const COLUMNS = [
  { key: 'name',      label: 'Name' },
  { key: 'season',    label: 'Season' },
  { key: 'monthName', label: 'Month' },
  { key: 'day',       label: 'Day' },
  { key: 'daysAway',  label: 'Coming Up', hideMobile: true },
]

function SortIcon({ dir }) {
  if (!dir) return <span className="ml-1 text-gray-300">↕</span>
  return <span className="ml-1">{dir === 'asc' ? '↑' : '↓'}</span>
}

function BirthdayTable({ birthdays }) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('daysAway')
  const [sortDir, setSortDir] = useState('asc')

  const rows = useMemo(() => {
    return birthdays.map((b) => {
      const d = new Date(b.date)
      const month = d.getMonth()
      const season = getSeason(month)
      return {
        ...b,
        month,
        monthName: getMonthName(month),
        day: d.getDate(),
        season: season.label,
        seasonEmoji: season.emoji,
        daysAway: daysUntil(b.date),
      }
    })
  }, [birthdays])

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [rows, sortKey, sortDir])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return sorted
    return sorted.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.monthName.toLowerCase().includes(q) ||
        r.season.toLowerCase().includes(q)
    )
  }, [sorted, query])

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <h3 className="font-handwritten text-2xl text-gray-600 flex-1">All Birthdays</h3>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, month, or season…"
            className="w-full sm:w-64 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-ocean transition-colors"
          />
          <a
            href={ADD_BIRTHDAY_FORM}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-ocean hover:bg-ocean-dark text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap"
          >
            + Add yours
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Sticky sortable header */}
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ocean/5 border-b border-gray-100 text-left">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide text-xs cursor-pointer select-none hover:text-ocean transition-colors ${col.hideMobile ? 'hidden sm:table-cell' : ''}`}
                >
                  {col.label}
                  <SortIcon dir={sortKey === col.key ? sortDir : null} />
                </th>
              ))}
            </tr>
          </thead>
        </table>
        {/* Scrollable body — ~7 rows visible */}
        <div className="overflow-y-auto" style={{ maxHeight: '308px' }}>
          <table className="w-full text-sm">
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400 font-handwritten text-lg">
                    No birthdays match "{query}"
                  </td>
                </tr>
              )}
              {filtered.map((r, i) => (
                <tr
                  key={r.name}
                  className={`border-b border-gray-50 hover:bg-ocean/5 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800 w-[30%]">
                    <span className="mr-2">{r.emoji}</span>{r.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 w-[20%]">
                    <span className="mr-1">{r.seasonEmoji}</span>{r.season}
                  </td>
                  <td className="px-4 py-3 text-gray-600 w-[20%]">{r.monthName}</td>
                  <td className="px-4 py-3 text-gray-600 w-[10%]">{r.day}</td>
                  <td className="px-4 py-3 hidden sm:table-cell w-[20%]">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      r.daysAway === 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : r.daysAway <= 30
                        ? 'bg-sunset/10 text-sunset-dark'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {r.daysAway === 0 ? '🎉 Today!' : `${r.daysAway}d`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function BirthdayCalendar({ birthdays }) {
  const thisMonth = getThisMonthBirthdays(birthdays)
  const next = getNextBirthday(birthdays)
  const daysToNext = daysUntil(next.date)
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' })

  return (
    <section id="birthdays">
      <h2 className="section-title">🎂 Birthday Calendar</h2>

      {/* Countdown banner */}
      <div className="bg-gradient-to-r from-ocean to-ocean-dark text-white rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        <div>
          <p className="font-handwritten text-2xl">Next Up: {next.name} {next.emoji}</p>
          <p className="text-blue-200 text-sm">
            {new Date(next.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="text-center">
          <p className="font-handwritten text-5xl font-bold">{daysToNext === 0 ? '🎉' : daysToNext}</p>
          <p className="text-blue-200 text-sm">{daysToNext === 0 ? 'Today!' : 'days away'}</p>
        </div>
      </div>

      {/* This month cards */}
      {thisMonth.length > 0 ? (
        <>
          <h3 className="font-handwritten text-2xl text-gray-600 mb-4">{currentMonthName} Birthdays</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {thisMonth.map((b) => (
              <BirthdayCard key={b.name} {...b} />
            ))}
          </div>
        </>
      ) : (
        <p className="font-handwritten text-xl text-gray-400 mb-8">No birthdays this month — enjoy the calm! 🌊</p>
      )}

      {/* Sortable, searchable, scrollable table */}
      <div className="mb-10">
        <BirthdayTable birthdays={birthdays} />
      </div>

      {/* Pop's 70th */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 shadow-md">
        <span className="text-5xl">📖</span>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-handwritten text-2xl text-amber-800">Rich's 70th Birthday Book</h3>
          <p className="text-amber-700 text-sm mt-1">A keepsake from the big celebration</p>
        </div>
        <a
          href={RICH_BOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm"
        >
          View the Book →
        </a>
      </div>
    </section>
  )
}

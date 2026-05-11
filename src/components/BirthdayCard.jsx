import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

function daysUntil(dateStr) {
  const today = new Date()
  const bday = new Date(dateStr)
  const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate())
  if (next < today) next.setFullYear(today.getFullYear() + 1)
  const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24))
  return diff === 365 ? 0 : diff
}

function isToday(dateStr) {
  const today = new Date()
  const bday = new Date(dateStr)
  return today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate()
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

export default function BirthdayCard({ name, date, emoji }) {
  const today = isToday(date)
  const days = daysUntil(date)
  const cardRef = useRef(null)

  useEffect(() => {
    if (!today) return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    confetti({
      particleCount: 80,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
    })
  }, [today])

  return (
    <div
      ref={cardRef}
      className={`relative bg-white rounded-2xl p-5 shadow-md flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-xl ${
        today ? 'animate-golden-pulse ring-4 ring-yellow-400' : ''
      }`}
    >
      {today && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow">
          🎉 TODAY!
        </div>
      )}
      <span className="text-4xl mb-2">{emoji}</span>
      <h3 className="font-handwritten text-2xl text-ocean font-bold">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{formatDate(date)}</p>
      <p className="mt-3 text-xs font-semibold text-sunset">
        {today ? '🎂 Happy Birthday!' : `${days} day${days === 1 ? '' : 's'} away`}
      </p>
    </div>
  )
}

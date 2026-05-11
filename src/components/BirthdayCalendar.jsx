import BirthdayCard from './BirthdayCard'

function daysUntil(dateStr) {
  const today = new Date()
  const bday = new Date(dateStr)
  const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate())
  if (next < today) next.setFullYear(today.getFullYear() + 1)
  const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24))
  return diff === 365 ? 0 : diff
}

function getThisMonthBirthdays(birthdays) {
  const month = new Date().getMonth()
  return birthdays.filter((b) => new Date(b.date).getMonth() === month)
}

function getNextBirthday(birthdays) {
  const sorted = [...birthdays].sort((a, b) => daysUntil(a.date) - daysUntil(b.date))
  return sorted[0]
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

      {/* This month */}
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

      {/* All birthdays */}
      <h3 className="font-handwritten text-2xl text-gray-600 mb-4">All Birthdays</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...birthdays]
          .sort((a, b) => daysUntil(a.date) - daysUntil(b.date))
          .map((b) => (
            <BirthdayCard key={b.name} {...b} />
          ))}
      </div>
    </section>
  )
}

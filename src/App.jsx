import { useState, useEffect } from 'react'
import PasswordGate from './components/PasswordGate'
import Header from './components/Header'
import BirthdayCalendar from './components/BirthdayCalendar'
import SurveyDashboard from './components/SurveyDashboard'
import PhotoGrid from './components/PhotoGrid'
import localData from './data/data.json'
import { fetchBirthdays, fetchSurveyQuotes } from './utils/sheets'

const MARTHA_QUOTE =
  "These memories are the great gift that Rich and Erin have given us all: moments in time at a special place where we return like homing pigeons to share the joy and comradeship of family and friends. We have had much fun, but something else has happened along the way. We've shared transformational experiences and have woven personal bonds that will extend far into the future.\n\nAs we age, it is inevitable that we wonder about the things that have mattered most in our lives, not just to us but to the people we love. The annual Catalina gathering has been one of the most generous and influential gifts that you, Rich, in partnership with Erin, could have given to us and we thank you with all our hearts."

export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('cc_unlocked') === 'true')
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!unlocked) return
    async function load() {
      const [birthdays, quotes] = await Promise.all([
        fetchBirthdays().catch(() => localData.birthdays),
        fetchSurveyQuotes().catch(() => localData.survey.quotes),
      ])
      setData({
        birthdays,
        survey: { quotes },
        photos: localData.photos,
        photoAlbums: localData.photoAlbums,
      })
    }
    load()
  }, [unlocked])

  const handleUnlock = () => {
    sessionStorage.setItem('cc_unlocked', 'true')
    setUnlocked(true)
  }

  if (!unlocked) return <PasswordGate onUnlock={handleUnlock} />

  return (
    <div className="min-h-screen bg-parchment">
      <Header />

      {/* Martha's quote */}
      <div className="bg-gradient-to-br from-ocean/5 to-sunset/5 border-y border-ocean/10">
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <span className="font-handwritten text-5xl text-sunset/60 leading-none select-none">"</span>
          {MARTHA_QUOTE.split('\n\n').map((para, i) => (
            <p key={i} className={`font-handwritten text-xl md:text-2xl text-gray-700 italic leading-relaxed ${i > 0 ? 'mt-5' : ''}`}>
              {para}
            </p>
          ))}
          <p className="mt-5 font-sans text-sm font-semibold text-ocean tracking-wide uppercase">— Martha</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-20">
        {data ? (
          <>
            <PhotoGrid photos={data.photos} albums={data.photoAlbums} />
            <BirthdayCalendar birthdays={data.birthdays} />
            <SurveyDashboard survey={data.survey} />
          </>
        ) : (
          <div className="flex items-center justify-center py-32">
            <p className="font-handwritten text-3xl text-ocean animate-pulse">Loading the Codex…</p>
          </div>
        )}
      </main>
      <footer className="text-center py-8 text-gray-400 font-handwritten text-xl">
        Made with ☀️ & ⛵ for Catalina
      </footer>
    </div>
  )
}

import { useState, useEffect } from 'react'
import PasswordGate from './components/PasswordGate'
import Header from './components/Header'
import BirthdayCalendar from './components/BirthdayCalendar'
import SurveyDashboard from './components/SurveyDashboard'
import PhotoGrid from './components/PhotoGrid'
import localData from './data/data.json'

const WORKER = import.meta.env.VITE_WORKER_URL

async function workerFetch(endpoint) {
  if (!WORKER) return null
  try {
    const res = await fetch(`${WORKER}/${endpoint}`)
    if (!res.ok) throw new Error(res.statusText)
    return await res.json()
  } catch {
    return null
  }
}

export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('cc_unlocked') === 'true')
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!unlocked) return
    async function load() {
      const [liveBirthdays, liveSurvey] = await Promise.all([
        workerFetch('birthdays'),
        workerFetch('survey_results'),
      ])
      setData({
        birthdays: liveBirthdays ?? localData.birthdays,
        survey: liveSurvey ?? localData.survey,
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
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-20">
        {data ? (
          <>
            <BirthdayCalendar birthdays={data.birthdays} />
            <SurveyDashboard survey={data.survey} />
            <PhotoGrid photos={data.photos} albums={data.photoAlbums} />
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

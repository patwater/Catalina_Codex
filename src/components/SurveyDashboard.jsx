import { useState, useEffect } from 'react'

const SURVEY_FORM =
  'https://docs.google.com/forms/d/e/1FAIpQLSf-0I7ghEKe_GNUF1yvZOZzRNrI7kJYe7FG_y7AUCVftST_Qg/viewform?usp=header'

function WallOfQuotes({ quotes }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!quotes.length) return
    const id = setInterval(() => setCurrent((c) => (c + 1) % quotes.length), 6000)
    return () => clearInterval(id)
  }, [quotes.length])

  if (!quotes.length) return null

  return (
    <div className="bg-gradient-to-br from-sunset/10 to-ocean/10 rounded-2xl p-8 md:p-12 shadow-md text-center flex flex-col items-center justify-center min-h-[200px]">
      <h2 className="section-title mb-8">💬 From the Crew</h2>
      <blockquote
        key={current}
        className="font-handwritten text-2xl md:text-4xl text-gray-700 italic leading-relaxed max-w-3xl animate-[fadeIn_0.6s_ease-in]"
      >
        {quotes[current]}
      </blockquote>
      <div className="flex gap-2 mt-8">
        {quotes.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === current ? 'bg-ocean' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  )
}

export default function SurveyDashboard({ survey }) {
  return (
    <section id="survey">
      <WallOfQuotes quotes={survey.quotes} />
      <div className="mt-6 text-center">
        <a
          href={SURVEY_FORM}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-sunset hover:bg-sunset-dark text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-md"
        >
          📝 Submit this year's survey
        </a>
      </div>
    </section>
  )
}

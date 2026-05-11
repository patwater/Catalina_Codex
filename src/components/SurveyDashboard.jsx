import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y} votes` } },
  },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1 } },
  },
}

function BarChart({ title, data, color }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.votes),
        backgroundColor: color,
        borderRadius: 8,
      },
    ],
  }
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h3 className="font-handwritten text-2xl text-ocean mb-4">{title}</h3>
      <Bar options={chartOptions} data={chartData} />
    </div>
  )
}

function WallOfQuotes({ quotes }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % quotes.length), 5000)
    return () => clearInterval(id)
  }, [quotes.length])

  return (
    <div className="bg-gradient-to-br from-sunset/10 to-ocean/10 rounded-2xl p-8 shadow-md text-center min-h-[160px] flex flex-col items-center justify-center">
      <h3 className="font-handwritten text-2xl text-ocean mb-6">💬 Wall of Quotes</h3>
      <blockquote
        key={current}
        className="font-handwritten text-2xl md:text-3xl text-gray-700 italic leading-relaxed max-w-2xl animate-[fadeIn_0.5s_ease-in]"
      >
        {quotes[current]}
      </blockquote>
      <div className="flex gap-2 mt-6">
        {quotes.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-ocean' : 'bg-gray-300'}`}
          />
        ))}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

export default function SurveyDashboard({ survey }) {
  return (
    <section id="survey">
      <h2 className="section-title">📊 Annual Survey</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <BarChart
          title="🍽️ Favorite Camp Meal"
          data={survey.favoriteMeal}
          color="#0077be99"
        />
        <BarChart
          title="🏆 MVP of Last Year"
          data={survey.mvp}
          color="#ff8c0099"
        />
      </div>
      <WallOfQuotes quotes={survey.quotes} />
    </section>
  )
}

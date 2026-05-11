import { useState } from 'react'

const CORRECT = 'Little Harbor'

export default function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)
  const [error, setError] = useState(false)

  const attempt = () => {
    if (input.trim().toLowerCase() === CORRECT.toLowerCase()) {
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') attempt()
    if (error) setError(false)
  }

  return (
    <div
      className="min-h-screen bg-ocean flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at top, #005a8e 0%, #0077be 50%, #003d6b 100%)',
      }}
    >
      {/* Waves decoration */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24 fill-parchment opacity-20">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="relative z-10 text-center">
        <div className="text-7xl mb-6 animate-float">⚓</div>

        <h1 className="font-handwritten text-5xl md:text-7xl text-white mb-3 drop-shadow-lg">
          Catalina Codex
        </h1>
        <p className="font-handwritten text-2xl md:text-3xl text-blue-200 mb-12">
          Annual Camp Trip · Members Only
        </p>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 md:p-12 max-w-md w-full mx-auto border border-white/20 shadow-2xl">
          <p className="font-handwritten text-3xl text-white mb-8">
            Speak, friend, and enter.
          </p>

          <div className={`transition-transform ${shake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false) }}
              onKeyDown={handleKey}
              placeholder="The password…"
              className={`w-full px-5 py-3 rounded-xl text-center font-sans text-lg bg-white/20 text-white placeholder-blue-200 border-2 outline-none transition-colors ${
                error ? 'border-red-400' : 'border-white/30 focus:border-white'
              }`}
              autoFocus
            />
          </div>

          {error && (
            <p className="mt-3 text-red-300 font-handwritten text-lg">
              That's not the way, friend. Try again.
            </p>
          )}

          <button
            onClick={attempt}
            className="mt-6 w-full bg-sunset hover:bg-sunset-dark text-white font-semibold py-3 rounded-xl transition-colors font-sans text-lg shadow-lg"
          >
            Enter the Codex →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}

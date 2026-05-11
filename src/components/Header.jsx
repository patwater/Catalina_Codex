export default function Header() {
  return (
    <header className="bg-ocean text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl">⚓</span>
          <div>
            <h1 className="font-handwritten text-4xl md:text-5xl leading-tight">Catalina Codex</h1>
            <p className="font-sans text-blue-200 text-sm">Annual Camp Trip · Two Harbors</p>
          </div>
        </div>
        <nav className="flex gap-6 text-sm font-semibold text-blue-100">
          <a href="#birthdays" className="hover:text-white transition-colors">🎂 Birthdays</a>
          <a href="#survey" className="hover:text-white transition-colors">📊 Survey</a>
          <a href="#photos" className="hover:text-white transition-colors">📸 Photos</a>
        </nav>
      </div>
      {/* Wave divider */}
      <div className="overflow-hidden leading-none">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-12 fill-parchment">
          <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" />
        </svg>
      </div>
    </header>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-black/10 mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <svg className="text-[#002FA7]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
            <path d="M224,123.4l-72-12L195.31,55a8,8,0,0,0-11.31-11.31L128,87.31,72,43.69A8,8,0,0,0,60.69,55l43.31,56.4-72,12a8,8,0,1,0,2.63,15.78l72-12L60.69,193.31A8,8,0,0,0,72,204.69l56-56,56,56a8,8,0,0,0,11.31-11.32L155.43,135.18l72,12a8,8,0,1,0,2.6-15.78Z" />
          </svg>
          <span className="font-heading font-black text-sm tracking-tight">MARKET/AGENT</span>
          <span className="text-xs text-[#A3A3A3] ml-3 font-mono">v0.1 · Powered by Gemini</span>
        </div>
        <div className="text-xs text-[#A3A3A3] font-mono uppercase tracking-wider text-right">
          <div>Built for the AI Marketing Agent · 2026</div>
          <div className="mt-1">Made by <span className="text-[#050505] font-bold">Bhaskar Shamo Ray</span></div>
        </div>
      </div>
    </footer>
  )
}

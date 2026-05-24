import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
  const { pathname } = useLocation()
  const lnk = (active) =>
    `text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
      active ? 'text-[#050505]' : 'text-[#A3A3A3] hover:text-[#050505]'
    }`

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <svg
            className="text-[#002FA7] transition-transform duration-300 group-hover:rotate-90"
            xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 256 256" fill="currentColor"
          >
            <path d="M224,123.4l-72-12L195.31,55a8,8,0,0,0-11.31-11.31L128,87.31,72,43.69A8,8,0,0,0,60.69,55l43.31,56.4-72,12a8,8,0,1,0,2.63,15.78l72-12L60.69,193.31A8,8,0,0,0,72,204.69l56-56,56,56a8,8,0,0,0,11.31-11.32L155.43,135.18l72,12a8,8,0,1,0,2.6-15.78Z" />
          </svg>
          <span className="font-heading font-black text-base tracking-tight">
            MARKET<span className="text-[#002FA7]">/</span>AGENT
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          <Link to="/" className={lnk(pathname === '/')}>New&nbsp;Project</Link>
          <Link to="/dashboard" className={lnk(pathname.startsWith('/dashboard'))}>Dashboard</Link>
        </nav>
      </div>
    </header>
  )
}

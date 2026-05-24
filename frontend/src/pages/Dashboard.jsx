import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { apiListProjects, apiDeleteProject, imgUrl } from '../lib/api'

function StatusTag({ label, active }) {
  return (
    <span className={`kbd-tag ${active ? 'bg-[#002FA7]/10 text-[#002FA7] border-[#002FA7]/30' : 'bg-[#F5F5F5] text-[#A3A3A3] border-black/10'}`}>
      {label}
    </span>
  )
}

function ProjectCard({ project, onDelete }) {
  const nav = useNavigate()
  const date = new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="border border-black/15 bg-white hover:border-black hover:-translate-y-0.5 transition-all">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between">
          <span className="kbd-tag bg-white border-black/15">
            {project.analysis ? 'Complete' : project.image_path ? 'Draft' : 'Empty'}
          </span>
          <button
            onClick={() => onDelete(project.id)}
            className="p-2 text-[#A3A3A3] hover:text-[#FF4500] transition-colors"
            title="Delete project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
              <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
            </svg>
          </button>
        </div>

        {project.image_path && (
          <div className="mt-4 aspect-video border border-black/10 overflow-hidden bg-[#F5F5F5]">
            <img src={imgUrl(project.image_path)} alt={project.brand_name}
                 className="w-full h-full object-cover" />
          </div>
        )}

        <h3 className="font-heading text-2xl font-black mt-5 leading-tight truncate">{project.brand_name}</h3>
        <p className="text-sm text-[#525252] mt-2 line-clamp-2 leading-relaxed">{project.product_description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <StatusTag label="Analysis" active={!!project.analysis} />
          <StatusTag label="Content" active={!!project.content} />
          <StatusTag label="Creative" active={!!project.creatives} />
        </div>

        <div className="mt-auto pt-5 border-t border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3]">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
              <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" />
            </svg>
            {date}
          </div>
          <button
            onClick={() => nav(`/project/${project.id}`)}
            className="inline-flex items-center gap-1.5 bg-[#050505] text-white px-3 py-2 hover:bg-[#002FA7] transition-colors text-xs font-bold uppercase tracking-wider"
          >
            Open
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256" fill="currentColor">
              <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    apiListProjects()
      .then(setProjects)
      .catch(() => toast.error('Could not load projects.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await apiDeleteProject(id)
      setProjects(p => p.filter(x => x.id !== id))
      toast.success('Project deleted.')
    } catch {
      toast.error('Could not delete project.')
    }
  }

  const total = projects.length
  const withAnalysis = projects.filter(p => p.analysis).length
  const withContent = projects.filter(p => p.content).length

  return (
    <div className="min-h-screen bg-white text-[#050505]">
      <NavBar />

      {/* Header */}
      <div className="border-b border-black/10 bg-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-[#A3A3A3]">Dashboard</div>
            <h1 className="font-heading text-5xl md:text-6xl font-black tracking-tighter mt-2 leading-none">Your campaigns.</h1>
            <p className="text-[#525252] mt-4 max-w-md">
              Every product you brief, every output the agent ships. Saved, searchable, ready to re-run.
            </p>
          </div>
          <Link to="/#upload" className="group inline-flex items-center gap-2 bg-[#050505] text-white px-6 py-3.5 hover:bg-[#002FA7] transition-colors">
            <span className="font-medium">New project</span>
            <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
              <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3">
          {[
            { label: 'Total Projects', value: total },
            { label: 'Analysed', value: withAnalysis },
            { label: 'Content Ready', value: withContent },
          ].map((s, i) => (
            <div key={i} className={`py-6 ${i < 2 ? 'border-r border-black/10' : ''} px-4 first:pl-0`}>
              <div className="font-heading text-5xl font-black tracking-tight">{s.value}</div>
              <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#A3A3A3] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <div className="text-center py-20 text-[#A3A3A3]">
            <svg className="spin-slow inline-block text-[#002FA7]" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" fill="currentColor">
              <path d="M224,123.4l-72-12L195.31,55a8,8,0,0,0-11.31-11.31L128,87.31,72,43.69A8,8,0,0,0,60.69,55l43.31,56.4-72,12a8,8,0,1,0,2.63,15.78l72-12L60.69,193.31A8,8,0,0,0,72,204.69l56-56,56,56a8,8,0,0,0,11.31-11.32L155.43,135.18l72,12a8,8,0,1,0,2.6-15.78Z" />
            </svg>
            <p className="mt-3 text-xs uppercase tracking-[0.22em] font-bold">Loading…</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-dashed border-black/20 p-16 text-center">
            <div className="text-[#A3A3A3] inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 256 256" fill="currentColor">
                <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z" />
              </svg>
            </div>
            <h3 className="font-heading text-3xl font-black mt-4">No projects yet</h3>
            <p className="text-[#525252] mt-2 max-w-md mx-auto">Upload your first product to see the multi-step Gemini pipeline in action.</p>
            <Link to="/#upload" className="mt-6 inline-flex items-center gap-2 bg-[#002FA7] text-white px-5 py-3 hover:bg-[#001D66] transition-colors">
              Create first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

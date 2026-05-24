import { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import NavBar from '../components/NavBar'
import { apiGetProject, apiAnalyze, apiGenerateContent, apiGenerateCreatives, imgUrl } from '../lib/api'

const STEP_LABELS = ['Vision Analysis', 'Content Engine', 'Creative Director']

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button onClick={copy} className="p-1.5 text-[#A3A3A3] hover:text-[#002FA7] transition-colors" title="Copy">
      {copied
        ? <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 256 256" fill="currentColor"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/></svg>
        : <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 256 256" fill="currentColor"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/></svg>
      }
    </button>
  )
}

function Section({ title, children }) {
  return (
    <div className="border border-black/10 bg-white">
      <div className="border-b border-black/10 px-6 py-3 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#A3A3A3]">{title}</span>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function Tag({ children, color = 'neutral', wrap = false }) {
  const cls = {
    blue: 'bg-[#002FA7]/10 text-[#002FA7] border-[#002FA7]/30',
    yellow: 'bg-[#FFCC00]/30 border-[#FFCC00]/60 text-[#050505]',
    neutral: 'bg-white border-black/15 text-[#525252]',
  }[color]
  const wrapStyle = wrap ? { whiteSpace: 'normal', lineHeight: 1.5 } : undefined
  return <span className={`kbd-tag ${cls}`} style={wrapStyle}>{children}</span>
}

// ─── Analysis Tab ──────────────────────────────────────────────
function AnalysisTab({ data }) {
  if (!data) return <Empty msg="Run the pipeline to see vision analysis." />
  const { audience_insights: ai, platform_priorities: pp } = data
  return (
    <div className="space-y-4">
      <Section title="Product Overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-1">Category</div>
            <div className="font-heading font-bold text-lg">{data.product_category}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-1">Brand Tone</div>
            <div className="font-heading font-bold text-lg">{data.brand_tone}</div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-1">Positioning</div>
            <p className="text-[#525252] leading-relaxed">{data.positioning}</p>
          </div>
          <div className="sm:col-span-2">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-1">Competitive Angle</div>
            <p className="text-[#525252] leading-relaxed">{data.competitive_angle}</p>
          </div>
          <div className="sm:col-span-2">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-2">Visual Attributes</div>
            <div className="flex flex-wrap gap-1.5">{data.visual_attributes?.map((v, i) => <Tag key={i} color="neutral">{v}</Tag>)}</div>
          </div>
        </div>
      </Section>

      <Section title="Audience Insights">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-1">Primary Age</div>
            <div className="font-bold">{ai?.primary_age}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-1">Lifestyle</div>
            <div className="font-bold">{ai?.lifestyle}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-2">Pain Points</div>
            <ul className="space-y-1">{ai?.pain_points?.map((p, i) => <li key={i} className="flex items-start gap-2 text-sm text-[#525252]"><span className="text-[#FF4500] mt-0.5">—</span>{p}</li>)}</ul>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-2">Motivations</div>
            <ul className="space-y-1">{ai?.motivations?.map((m, i) => <li key={i} className="flex items-start gap-2 text-sm text-[#525252]"><span className="text-[#002FA7] mt-0.5">+</span>{m}</li>)}</ul>
          </div>
        </div>
      </Section>

      <Section title="Platform Priorities">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-black/10">
          {pp?.map((p, i) => (
            <div key={i} className={`p-5 ${i < pp.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-black/10' : ''}`}>
              <div className="font-heading font-bold text-base">{p.platform}</div>
              <div className="text-xs text-[#525252] mt-2 leading-relaxed">{p.rationale}</div>
              <div className="mt-3"><Tag color="blue" wrap>{p.content_format}</Tag></div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

// ─── Content Tab ───────────────────────────────────────────────
function ContentTab({ data }) {
  if (!data) return <Empty msg="Run the pipeline to see generated content." />
  const allHashtags = [...(data.hashtags?.primary || []), ...(data.hashtags?.niche || []), ...(data.hashtags?.trending || [])].join(' ')
  return (
    <div className="space-y-4">
      <Section title="Instagram Captions">
        <div className="space-y-3">
          {data.instagram_captions?.map((c, i) => (
            <div key={i} className="border border-black/10 p-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-[#A3A3A3] mb-1">{c.tone}</div>
                <p className="text-sm leading-relaxed">{c.caption}</p>
              </div>
              <CopyBtn text={c.caption} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Ad Copy">
        <div className="space-y-3">
          {data.ad_copy?.map((a, i) => (
            <div key={i} className="border border-black/10 p-4">
              <div className="flex items-center justify-between">
                <Tag color="blue">{a.platform}</Tag>
                <CopyBtn text={`${a.headline}\n\n${a.body}`} />
              </div>
              <div className="font-heading font-bold text-lg mt-3">{a.headline}</div>
              <p className="text-sm text-[#525252] mt-1 leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Section title="Hooks">
          <div className="space-y-2">
            {data.hooks?.map((h, i) => (
              <div key={i} className="flex items-start justify-between gap-2 border-b border-black/5 pb-2 last:border-0 last:pb-0">
                <p className="text-sm leading-relaxed">{h}</p>
                <CopyBtn text={h} />
              </div>
            ))}
          </div>
        </Section>
        <Section title="CTAs">
          <div className="space-y-2">
            {data.ctas?.map((c, i) => (
              <div key={i} className="flex items-start justify-between gap-2 border-b border-black/5 pb-2 last:border-0 last:pb-0">
                <p className="text-sm leading-relaxed">{c}</p>
                <CopyBtn text={c} />
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Hashtags">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-[#A3A3A3]">3 groups · {(data.hashtags?.primary?.length || 0) + (data.hashtags?.niche?.length || 0) + (data.hashtags?.trending?.length || 0)} total</span>
          <CopyBtn text={allHashtags} />
        </div>
        <div className="space-y-3">
          {[
            { label: 'Primary', tags: data.hashtags?.primary, color: 'blue' },
            { label: 'Niche', tags: data.hashtags?.niche, color: 'yellow' },
            { label: 'Trending', tags: data.hashtags?.trending, color: 'neutral' },
          ].map(({ label, tags, color }) => (
            <div key={label}>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-2">{label}</div>
              <div className="flex flex-wrap gap-1.5">{tags?.map((t, i) => <Tag key={i} color={color}>{t}</Tag>)}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

// ─── Creative Tab ──────────────────────────────────────────────
function CreativeTab({ data }) {
  if (!data) return <Empty msg="Run the pipeline to see creative concepts." />
  return (
    <div className="space-y-4">
      <Section title="Reel Ideas">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.reel_ideas?.map((r, i) => (
            <div key={i} className="border border-black/10 p-5">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-base">{r.title}</span>
                <Tag color="blue">{r.duration}</Tag>
              </div>
              <p className="text-sm text-[#525252] mt-3 leading-relaxed">{r.concept}</p>
              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-2">Shot List</div>
                <ol className="space-y-1 list-decimal list-inside">
                  {r.shot_list?.map((s, j) => <li key={j} className="text-xs text-[#525252]">{s}</li>)}
                </ol>
              </div>
              <div className="mt-3 flex items-start gap-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold shrink-0 pt-0.5">Music</span>
                <Tag color="yellow" wrap>{r.music_vibe}</Tag>
              </div>
              {r.hook_line && (
                <div className="mt-3 border-t border-black/5 pt-3 flex items-start justify-between gap-2">
                  <p className="text-xs text-[#525252] italic">"{r.hook_line}"</p>
                  <CopyBtn text={r.hook_line} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Carousel Ideas">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.carousel_ideas?.map((c, i) => (
            <div key={i} className="border border-black/10 p-5">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-base">{c.title}</span>
                <Tag color="neutral">{c.slide_count} slides</Tag>
              </div>
              <ol className="mt-4 space-y-1 list-decimal list-inside">
                {c.slide_breakdown?.map((s, j) => <li key={j} className="text-xs text-[#525252]">{s}</li>)}
              </ol>
              <div className="mt-3 border-t border-black/5 pt-3 flex items-start justify-between gap-2">
                <span className="text-xs text-[#002FA7] font-bold">{c.cta_slide}</span>
                <CopyBtn text={c.cta_slide} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Campaign Concepts">
        <div className="space-y-4">
          {data.campaigns?.map((c, i) => (
            <div key={i} className="border border-black/10 p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="font-heading font-black text-xl">{c.name}</div>
                  <p className="text-[#525252] text-sm mt-1 italic">"{c.hero_message}"</p>
                </div>
                <Tag color="blue">{c.duration}</Tag>
              </div>
              <p className="text-sm text-[#525252] mt-4 leading-relaxed">{c.concept}</p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-2">Channels</div>
                  <div className="flex flex-wrap gap-1.5">{c.channels?.map((ch, j) => <Tag key={j} color="neutral">{ch}</Tag>)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold mb-2">KPIs</div>
                  <ul className="space-y-0.5">{c.kpis?.map((k, j) => <li key={j} className="text-xs text-[#525252] flex items-center gap-1"><span className="text-[#002FA7]">→</span>{k}</li>)}</ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Empty({ msg }) {
  return (
    <div className="py-20 text-center text-[#A3A3A3]">
      <svg className="inline-block mb-3" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256" fill="currentColor">
        <path d="M197.58,129.06l-51.61-19-19-51.65a15.92,15.92,0,0,0-29.88,0L78.07,110l-51.65,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0l19-51.61,51.65-19a15.92,15.92,0,0,0,0-29.88Z" opacity="0.2" />
      </svg>
      <p className="text-sm">{msg}</p>
    </div>
  )
}

export default function Workspace() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const autorun = params.get('autorun') === '1'

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(null)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('analysis')

  const load = useCallback(async () => {
    const data = await apiGetProject(id)
    setProject(data)
    setLoading(false)
    if (data.analysis)   setProgress(p => Math.max(p, 1))
    if (data.content)    setProgress(p => Math.max(p, 2))
    if (data.creatives)  setProgress(p => Math.max(p, 3))
  }, [id])

  useEffect(() => { load() }, [load])

  const runAll = useCallback(async () => {
    setRunning('all')
    setProgress(0)
    try {
      const s1 = await apiAnalyze(id)
      setProject(p => ({ ...p, analysis: s1.analysis }))
      setProgress(1); setActiveTab('analysis')

      const s2 = await apiGenerateContent(id)
      setProject(p => ({ ...p, content: s2.content }))
      setProgress(2)

      const s3 = await apiGenerateCreatives(id)
      setProject(p => ({ ...p, creatives: s3.creatives }))
      setProgress(3)

      toast.success('Marketing kit ready.')
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'AI generation failed.')
    } finally {
      setRunning(null)
    }
  }, [id])

  useEffect(() => {
    if (!loading && project && autorun && !project.analysis && !running) runAll()
  }, [loading, project, autorun]) // eslint-disable-line

  const rerun = async (which) => {
    setRunning(which)
    try {
      if (which === 'analyze') {
        const r = await apiAnalyze(id)
        setProject(p => ({ ...p, analysis: r.analysis }))
        toast.success('Re-ran analysis.')
      } else if (which === 'content') {
        const r = await apiGenerateContent(id)
        setProject(p => ({ ...p, content: r.content }))
        toast.success('Re-ran content.')
      } else if (which === 'creatives') {
        const r = await apiGenerateCreatives(id)
        setProject(p => ({ ...p, creatives: r.creatives }))
        toast.success('Re-ran creatives.')
      }
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Generation failed.')
    } finally {
      setRunning(null)
    }
  }

  const tabs = [
    { key: 'analysis', label: 'Analysis', done: !!project?.analysis },
    { key: 'content',  label: 'Content',  done: !!project?.content },
    { key: 'creative', label: 'Creative', done: !!project?.creatives },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-[#A3A3A3]">
            <svg className="spin-slow inline-block text-[#002FA7]" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="currentColor">
              <path d="M224,123.4l-72-12L195.31,55a8,8,0,0,0-11.31-11.31L128,87.31,72,43.69A8,8,0,0,0,60.69,55l43.31,56.4-72,12a8,8,0,1,0,2.63,15.78l72-12L60.69,193.31A8,8,0,0,0,72,204.69l56-56,56,56a8,8,0,0,0,11.31-11.32L155.43,135.18l72,12a8,8,0,1,0,2.6-15.78Z" />
            </svg>
            <p className="mt-3 text-xs uppercase tracking-[0.22em] font-bold">Loading project…</p>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-heading text-2xl font-black">Project not found</p>
            <Link to="/dashboard" className="mt-4 inline-flex items-center gap-2 bg-[#050505] text-white px-5 py-2.5 hover:bg-[#002FA7] transition-colors text-sm">Back to home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#050505]">
      <NavBar />

      {/* Top bar */}
      <div className="border-b border-black/10 bg-white sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#A3A3A3] hover:text-[#050505] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
              </svg>
              Dashboard
            </Link>
            <span className="text-black/20">|</span>
            <span className="font-heading font-bold text-sm truncate max-w-[200px]">{project.brand_name}</span>
            <span className="kbd-tag bg-white border-black/15 hidden sm:inline-block">Workspace</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              {STEP_LABELS.map((label, i) => (
                <div key={i} className={`h-1.5 w-10 transition-colors ${i < progress ? 'bg-[#002FA7]' : 'bg-black/10'}`} title={label} />
              ))}
            </div>
            <button
              onClick={runAll}
              disabled={!!running}
              className="inline-flex items-center gap-1.5 bg-[#050505] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#002FA7] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {running === 'all'
                ? <><svg className="spin-slow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M224,123.4l-72-12L195.31,55a8,8,0,0,0-11.31-11.31L128,87.31,72,43.69A8,8,0,0,0,60.69,55l43.31,56.4-72,12a8,8,0,1,0,2.63,15.78l72-12L60.69,193.31A8,8,0,0,0,72,204.69l56-56,56,56a8,8,0,0,0,11.31-11.32L155.43,135.18l72,12a8,8,0,1,0,2.6-15.78Z"/></svg>Running…</>
                : <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M197.58,129.06l-51.61-19-19-51.65a15.92,15.92,0,0,0-29.88,0L78.07,110l-51.65,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0l19-51.61,51.65-19a15.92,15.92,0,0,0,0-29.88ZM230.6,72H216V57.4a8,8,0,0,0-16,0V72H185.4a8,8,0,0,0,0,16H200v14.6a8,8,0,0,0,16,0V88h14.6a8,8,0,0,0,0-16ZM168,24h-8V16a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V40h8a8,8,0,0,0,0-16Z"/></svg>Run all</>
              }
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="border border-black overflow-hidden">
              <img src={imgUrl(project.image_path)} alt={project.brand_name} className="w-full aspect-square object-cover" />
              <div className="p-4">
                <div className="kbd-tag bg-white border-black/15">REF // PRODUCT</div>
                <div className="font-heading font-bold text-lg mt-3 leading-tight">{project.brand_name}</div>
                <p className="text-xs text-[#525252] mt-1 leading-relaxed line-clamp-3">{project.product_description}</p>
                <div className="mt-3 border-t border-black/10 pt-3">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold">Created</div>
                  <div className="text-xs text-[#525252] mt-0.5 font-mono">
                    {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Step controls */}
            <div className="border border-black/10 bg-white">
              {[
                { key: 'analyze',   label: 'Vision Analysis',    done: !!project.analysis,   step: 1 },
                { key: 'content',   label: 'Content Engine',     done: !!project.content,    step: 2 },
                { key: 'creatives', label: 'Creative Director',  done: !!project.creatives,  step: 3 },
              ].map((s, i) => (
                <div key={s.key} className={`p-4 ${i < 2 ? 'border-b border-black/10' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${s.done ? 'bg-[#002FA7]' : running === s.key ? 'bg-[#FFCC00] animate-pulse' : 'bg-black/20'}`} />
                      <span className="text-xs font-bold">{s.label}</span>
                    </div>
                    <button
                      onClick={() => rerun(s.key)}
                      disabled={!!running}
                      className="text-[#A3A3A3] hover:text-[#002FA7] disabled:opacity-40 transition-colors"
                      title={`Re-run ${s.label}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                        <path d="M224,48V96a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h28.69L182.06,73.37a79.56,79.56,0,0,0-56.13-23.43c-44,0-80,36.26-80,80.83a80.58,80.58,0,0,0,22.66,56.75,8,8,0,1,1-11.51,11.12A96.63,96.63,0,0,1,30,130.77C30,78.74,72.29,34,128,34a95.47,95.47,0,0,1,67.38,28.11L208,73.38V48a8,8,0,0,1,16,0Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9">
            {/* Tabs */}
            <div className="flex border-b border-black/10 mb-6">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === t.key
                      ? 'border-[#002FA7] text-[#002FA7]'
                      : 'border-transparent text-[#A3A3A3] hover:text-[#050505]'
                  }`}
                >
                  {t.label}
                  {t.done && <span className="w-1.5 h-1.5 rounded-full bg-[#002FA7] inline-block" />}
                </button>
              ))}
            </div>

            {activeTab === 'analysis' && <AnalysisTab data={project.analysis} />}
            {activeTab === 'content'  && <ContentTab  data={project.content} />}
            {activeTab === 'creative' && <CreativeTab data={project.creatives} />}
          </div>
        </div>
      </div>
    </div>
  )
}

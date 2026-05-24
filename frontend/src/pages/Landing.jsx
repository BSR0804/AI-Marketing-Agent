import { useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { apiCreateProject, apiHealth } from '../lib/api'

const HERO_IMG = 'https://static.prod-images.emergentagent.com/jobs/1d801f65-29bb-4bf8-821e-0a2ccb87cdb3/images/68c477644e1061050bbc1cfc2ba2b8157e8658c2b326b00cbf7dd14058eaf6ef.png'
const LIFESTYLE = 'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80'
const MARQUEE_ITEMS = ['Instagram captions','Ad copy','Reel storyboards','Carousel scripts','Hashtag stacks','Campaign briefs','Audience insights','Platform strategy']
const STATS = [{ k: '3-step', v: 'AI pipeline' }, { k: '30+', v: 'Outputs / run' }, { k: '1 image', v: 'All you need' }]

function Field({ label, value, onChange, placeholder, multiline }) {
  const cls = 'w-full bg-transparent border-0 border-b border-black/20 focus:border-[#002FA7] focus:border-b-2 focus:outline-none py-2 text-[15px] placeholder:text-[#A3A3A3]'
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-[#050505] mb-2">{label}</div>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls + ' resize-none'} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </label>
  )
}

function PreviewTile({ span, tag, title, desc, icon }) {
  return (
    <div className={`${span} border border-black/15 p-7 bg-white hover:border-black transition-colors group`}>
      <div className="flex items-center justify-between">
        <span className="kbd-tag" style={{ background: 'rgba(0,47,167,0.10)', color: '#002FA7', borderColor: 'rgba(0,47,167,0.30)' }}>{tag}</span>
        <span className="text-[#002FA7] group-hover:rotate-12 transition-transform">{icon}</span>
      </div>
      <div className="font-heading text-2xl font-bold mt-10 leading-tight">{title}</div>
      {desc && <p className="mt-3 text-sm text-[#525252] leading-relaxed">{desc}</p>}
    </div>
  )
}

export default function Landing() {
  const nav = useNavigate()
  const location = useLocation()
  const fileRef = useRef(null)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [brandName, setBrandName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }, [location])

  const handleFile = (file) => {
    if (!file) return
    if (!['image/jpeg','image/jpg','image/png','image/webp'].includes(file.type)) {
      return toast.error('Please upload a JPEG, PNG or WEBP image.')
    }
    if (file.size > 6 * 1024 * 1024) return toast.error('Image must be under 6 MB.')
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile) return toast.error('Upload a product image first.')
    if (!brandName.trim() || !productDescription.trim() || !targetAudience.trim()) {
      return toast.error('Fill in brand name, description and audience.')
    }
    setSubmitting(true)
    try {
      const health = await apiHealth()
      if (!health.gemini_configured) {
        toast('⚠️ Gemini API key not configured — add it to backend/.env', { duration: 5000 })
      }
      const { id } = await apiCreateProject({ brandName, productDescription, targetAudience, imageFile })
      toast.success('Project created. Running AI pipeline…')
      nav(`/project/${id}?autorun=1`)
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Could not create project.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#050505]">
      <NavBar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative">
          {/* Left */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 border border-black/15 px-3 py-1.5 fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4500] animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase">AI Marketing Agent · Powered by Gemini</span>
            </div>

            <h1 className="font-heading text-[56px] sm:text-[72px] lg:text-[96px] leading-[0.92] font-black tracking-tighter mt-6 fade-up-1">
              Ship campaigns<br />at the speed<br />of <span className="italic font-light">thought</span><span className="text-[#002FA7]">.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg text-[#525252] leading-relaxed fade-up-2">
              Drop a product photo. Get a complete launch kit — strategic analysis, ready-to-post copy, hashtags, and a creative storyboard — generated by a multi-step Gemini agent in under a minute.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 fade-up-3">
              <a href="#upload" className="group inline-flex items-center gap-2 bg-[#050505] text-white px-6 py-3.5 hover:bg-[#002FA7] transition-colors">
                <span className="font-medium">Start a new project</span>
                <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                </svg>
              </a>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-4 max-w-xl">
              {STATS.map((s, i) => (
                <div key={s.k} className={`border-t border-black/15 pt-3 fade-up-${i + 4}`}>
                  <div className="font-heading text-2xl font-black tracking-tight">{s.k}</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-[#A3A3A3] mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: hero visual */}
          <div className="lg:col-span-5 relative scale-in">
            <div className="relative aspect-[4/5] border border-black overflow-hidden">
              <img src={HERO_IMG} alt="Klein blue geometry" className="absolute inset-0 w-full h-full object-cover"
                   onError={e => { e.target.src = 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=900&q=80' }} />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white border border-black p-4 max-w-[220px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] hidden md:block">
              <div className="font-heading font-bold text-sm leading-snug">"Marketing is no longer about the stuff you make, but about the stories you tell."</div>
              <div className="mt-2 text-[10px] text-[#A3A3A3] font-mono">— Seth Godin</div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-t border-black/10 overflow-hidden">
          <div className="marquee py-3 text-xs uppercase tracking-[0.3em] font-bold text-[#A3A3A3]">
            {[0, 1].map(j => (
              <div key={j} className="flex items-center gap-10 pr-10 whitespace-nowrap">
                {MARQUEE_ITEMS.map((item, k) => (
                  <span key={k}>{item}{k < MARQUEE_ITEMS.length - 1 && <span className="mx-4">·</span>}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold">/ 01 — Workflow</div>
            <h2 className="font-heading text-4xl md:text-5xl font-black tracking-tight mt-3 leading-none">
              A multi-step <br /> agent, not a <br /> chat-wrapper.
            </h2>
            <p className="text-[#525252] mt-6 max-w-sm">
              Each stage has a focused system prompt and a strict JSON contract. That is what turns Gemini into a marketing strategist.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-0 border border-black/15">
            {[
              { n: '01', t: 'Vision Analysis', d: 'Gemini reads the product image + brand context and outputs category, tone, audience pain-points and platform priorities.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" fill="currentColor"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/></svg> },
              { n: '02', t: 'Content Engine', d: '3 captions, 3 ad units, 5 hooks, 5 CTAs and 15 hashtags — all on-brand and ready to ship.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" fill="currentColor"><path d="M48,64a8,8,0,0,1,8-8H72V40a8,8,0,0,1,16,0V56h16a8,8,0,0,1,0,16H88V88a8,8,0,0,1-16,0V72H56A8,8,0,0,1,48,64ZM184,192h-8v-8a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16Zm56-48H224V128a8,8,0,0,0-16,0v16H192a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V160h16a8,8,0,0,0,0-16ZM230.61,68.69,187.31,25.39a16,16,0,0,0-22.63,0L25.4,164.68a16,16,0,0,0,0,22.63l43.3,43.31a16,16,0,0,0,22.63,0L230.61,91.31A16,16,0,0,0,230.61,68.69ZM176,42.34l16,16L173.66,76.69l-16-16ZM80,219.31l-43.3-43.3,110.34-110.35,43.3,43.3Z"/></svg> },
              { n: '03', t: 'Creative Director', d: 'Reel storyboards with shot lists, carousel scripts, and 2 full campaign concepts with KPIs.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" fill="currentColor"><path d="M104,104V40H40v64Zm112,16V64H160v56Zm-64,16v80h64V136Zm-48,16H40v64h64Z" opacity="0.3"/><path d="M104,32H40A8,8,0,0,0,32,40v64a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V40A8,8,0,0,0,104,32ZM96,96H48V48H96Zm120-40H160a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8h56a8,8,0,0,0,8-8V64A8,8,0,0,0,216,56Zm-8,56H168V72h40Zm8,16H152a8,8,0,0,0-8,8v80a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V136A8,8,0,0,0,216,128Zm-8,80H160V144h48Zm-104-64H40a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V152A8,8,0,0,0,104,144Zm-8,64H48V160H96Z"/></svg> },
            ].map((s, i) => (
              <div key={s.n} className={`p-7 ${i < 2 ? 'sm:border-r border-black/15' : ''} border-b sm:border-b-0 last:border-b-0`}>
                <div className="flex items-start justify-between">
                  <div className="text-[#002FA7]">{s.icon}</div>
                  <span className="font-mono text-xs text-[#A3A3A3]">/ {s.n}</span>
                </div>
                <h3 className="font-heading font-bold text-xl mt-6">{s.t}</h3>
                <p className="text-sm text-[#525252] mt-2 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brief / Upload ── */}
      <section id="upload" className="border-t border-b border-black bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold">/ 02 — Brief</div>
            <h2 className="font-heading text-4xl md:text-5xl font-black tracking-tight mt-3 leading-none">
              Tell us about <br /> the product.
            </h2>
            <p className="text-[#525252] mt-6 max-w-md">
              Drop a clean product photo and a one-paragraph brief. The richer the context, the sharper the output.
            </p>
            <div className="mt-10 border border-black/15 bg-white p-5 flex items-start gap-4 max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="#FFCC00" className="shrink-0 mt-0.5">
                <path d="M213.85,125.46l-112,120A8,8,0,0,1,88.5,239.93l21.42-85.7-67.42-25.28a8,8,0,0,1-3.93-11.66l112-120a8,8,0,0,1,13.36,7.81L143,89.31l67.41,25.28a8,8,0,0,1,3.93,11.66Z" />
              </svg>
              <div>
                <div className="font-bold text-sm">Tip</div>
                <p className="text-xs text-[#525252] mt-1 leading-relaxed">
                  A flat lay or studio shot on a neutral background gives the AI the cleanest visual signal.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="lg:col-span-7 bg-white border border-black">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Dropzone */}
              <div className="p-7 border-b md:border-b-0 md:border-r border-black/15">
                <label className="text-[11px] uppercase tracking-[0.22em] font-bold text-[#050505]">Product image</label>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                       onChange={e => handleFile(e.target.files?.[0])} />
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]) }}
                  className="mt-3 aspect-square border border-dashed border-black/30 hover:border-black cursor-pointer flex items-center justify-center text-center transition-colors relative overflow-hidden"
                >
                  {preview
                    ? <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                    : (
                      <div className="flex flex-col items-center gap-2 p-6 text-[#525252]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 256 256" fill="#002FA7">
                          <path d="M74.34,85.66l48-48a8,8,0,0,1,11.32,0l48,48a8,8,0,0,1-11.32,11.32L136,67.31V168a8,8,0,0,1-16,0V67.31L85.66,97A8,8,0,0,1,74.34,85.66ZM240,136v72a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V136a8,8,0,0,1,16,0v72H224V136a8,8,0,0,1,16,0Z" />
                        </svg>
                        <div className="font-bold text-sm text-[#050505]">Drop your image</div>
                        <div className="text-xs">or click to browse · JPEG / PNG / WEBP · max 6 MB</div>
                      </div>
                    )
                  }
                </div>
                {preview && (
                  <button type="button" onClick={() => { setImageFile(null); setPreview(null) }}
                          className="mt-3 text-xs font-bold uppercase tracking-wider text-[#A3A3A3] hover:text-[#FF4500]">
                    Replace image
                  </button>
                )}
              </div>

              {/* Fields */}
              <div className="p-7 space-y-7">
                <Field label="Brand name" value={brandName} onChange={setBrandName} placeholder="e.g. Lumen Skin" />
                <Field label="Product description" value={productDescription} onChange={setProductDescription}
                       placeholder="A 2% retinol night serum in recyclable glass…" multiline />
                <Field label="Target audience" value={targetAudience} onChange={setTargetAudience}
                       placeholder="Women, 28-42, urban, sustainability-conscious" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4 px-7 py-5 border-t border-black/15 bg-[#FAFAFA]">
              <button type="submit" disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 bg-[#002FA7] text-white px-7 py-3.5 hover:bg-[#001D66] disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                {submitting
                  ? <><svg className="spin-slow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M224,123.4l-72-12L195.31,55a8,8,0,0,0-11.31-11.31L128,87.31,72,43.69A8,8,0,0,0,60.69,55l43.31,56.4-72,12a8,8,0,1,0,2.63,15.78l72-12L60.69,193.31A8,8,0,0,0,72,204.69l56-56,56,56a8,8,0,0,0,11.31-11.32L155.43,135.18l72,12a8,8,0,1,0,2.6-15.78Z"/></svg><span className="font-medium">Creating project…</span></>
                  : <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M197.58,129.06l-51.61-19-19-51.65a15.92,15.92,0,0,0-29.88,0L78.07,110l-51.65,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0l19-51.61,51.65-19a15.92,15.92,0,0,0,0-29.88ZM230.6,72H216V57.4a8,8,0,0,0-16,0V72H185.4a8,8,0,0,0,0,16H200v14.6a8,8,0,0,0,16,0V88h14.6a8,8,0,0,0,0-16ZM168,24h-8V16a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V40h8a8,8,0,0,0,0-16Z"/></svg><span className="font-medium">Generate marketing kit</span></>
                }
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── Output preview ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#A3A3A3] font-bold">/ 03 — Output</div>
            <h2 className="font-heading text-4xl md:text-5xl font-black tracking-tight mt-3 leading-none">What you get back.</h2>
          </div>
          <a href="#upload" className="text-sm font-bold underline underline-offset-4 hover:text-[#002FA7]">Try it now →</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <PreviewTile span="md:col-span-5" tag="Analysis" title="Product category, brand tone, platform priorities."
            desc="Gemini Vision reads your product image and brand brief, then returns category, tone, audience demographics, pain points, motivations, and the channels worth investing in."
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M128,72a56,56,0,1,0,56,56A56.06,56.06,0,0,0,128,72Zm0,96a40,40,0,1,1,40-40A40,40,0,0,1,128,168Zm0-144A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"/></svg>} />
          <PreviewTile span="md:col-span-7" tag="Content" title="Captions · Ads · Hooks · CTAs · Hashtags."
            desc="Ship-ready copy in seconds — 3 Instagram captions, 3 ad units (Meta / Google / IG), 5 scroll-stopping hooks, 5 CTAs, and 15 hashtags grouped by primary, niche, and trending."
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M224,88H175.4l8.47-46.57a8,8,0,0,0-15.74-2.86l-9,49.43H111.4l8.47-46.57a8,8,0,0,0-15.74-2.86L95.14,88H48a8,8,0,0,0,0,16H92.23L83.5,152H32a8,8,0,0,0,0,16H80.6l-8.47,46.57a8,8,0,0,0,6.44,9.3A7.79,7.79,0,0,0,80,224a8,8,0,0,0,7.86-6.57l9-49.43H144.6l-8.47,46.57a8,8,0,0,0,6.44,9.3,7.79,7.79,0,0,0,1.43.13,8,8,0,0,0,7.86-6.57l9-49.43H208a8,8,0,0,0,0-16H163.77l8.73-48H224a8,8,0,0,0,0-16Zm-76.5,64H99.77l8.73-48h47.73Z"/></svg>} />
          <PreviewTile span="md:col-span-7" tag="Creative" title="Reel storyboards, carousel decks, campaign briefs."
            desc="Production-ready concepts your team can shoot tomorrow — 2 reel storyboards with shot lists and music vibes, 2 carousel breakdowns, and 2 full campaign concepts with KPIs."
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" fill="currentColor"><path d="M48,64a8,8,0,0,1,8-8H72V40a8,8,0,0,1,16,0V56h16a8,8,0,0,1,0,16H88V88a8,8,0,0,1-16,0V72H56A8,8,0,0,1,48,64ZM184,192h-8v-8a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16Zm56-48H224V128a8,8,0,0,0-16,0v16H192a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V160h16a8,8,0,0,0,0-16ZM230.61,68.69,187.31,25.39a16,16,0,0,0-22.63,0L25.4,164.68a16,16,0,0,0,0,22.63l43.3,43.31a16,16,0,0,0,22.63,0L230.61,91.31A16,16,0,0,0,230.61,68.69ZM176,42.34l16,16L173.66,76.69l-16-16ZM80,219.31l-43.3-43.3,110.34-110.35,43.3,43.3Z"/></svg>} />
          <div className="md:col-span-5 border border-black/15 overflow-hidden aspect-[4/3] relative">
            <img src={LIFESTYLE} alt="Creative team collaborating on a marketing strategy" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

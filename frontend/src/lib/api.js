import axios from 'axios'

const BASE = 'http://localhost:8000'
const http = axios.create({ baseURL: `${BASE}/api` })

export const imgUrl = (path) => `${BASE}/${path}`

export const apiHealth = () => http.get('/health').then(r => r.data)

export const apiCreateProject = ({ brandName, productDescription, targetAudience, imageFile }) => {
  const fd = new FormData()
  fd.append('brand_name', brandName)
  fd.append('product_description', productDescription)
  fd.append('target_audience', targetAudience)
  fd.append('image', imageFile)
  return http.post('/projects', fd).then(r => r.data)
}

export const apiListProjects = () => http.get('/projects').then(r => r.data)

export const apiGetProject = (id) => http.get(`/projects/${id}`).then(r => r.data)

export const apiDeleteProject = (id) => http.delete(`/projects/${id}`).then(r => r.data)

export const apiAnalyze = (id) => http.post(`/projects/${id}/analyze`).then(r => r.data)

export const apiGenerateContent = (id) => http.post(`/projects/${id}/content`).then(r => r.data)

export const apiGenerateCreatives = (id) => http.post(`/projects/${id}/creatives`).then(r => r.data)

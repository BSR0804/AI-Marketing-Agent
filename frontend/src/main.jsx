import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: '13px',
          borderRadius: '0',
          border: '1px solid rgba(0,0,0,0.15)',
        },
      }}
    />
  </BrowserRouter>
)

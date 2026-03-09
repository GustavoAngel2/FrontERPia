import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'

// Global styles
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'react-toastify/dist/ReactToastify.css'

import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './utils/auth'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
    <ToastContainer position="top-right" />
  </React.StrictMode>
)

// Prevent page refresh on F5 and Ctrl+R
window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (
    event.key === "F5" ||
    (event.ctrlKey && event.key.toLowerCase() === "r")
  ) {
    event.preventDefault()
  }
}, { passive: false })

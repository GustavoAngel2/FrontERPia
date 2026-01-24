import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'

import './index.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './utils/auth';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
    <ToastContainer
      position="top-right"
    />
  </React.StrictMode>

)

window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (
    event.key === "F5" ||
    (event.ctrlKey && event.key.toLowerCase() === "r")
  ) {
    event.preventDefault();
  }
});

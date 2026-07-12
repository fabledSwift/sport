import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/bebas-neue'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Écran de démarrage : on le laisse respirer un instant puis on le fond
const splash = document.getElementById('splash')
if (splash) {
  setTimeout(() => {
    splash.classList.add('splash-out')
    setTimeout(() => splash.remove(), 450)
  }, 650)
}

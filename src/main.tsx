import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './styles.css'
import './brand.css'

// With registerType: 'autoUpdate', this fetches the latest service worker and
// reloads once it takes control — so every installed device picks up new
// recipes the next time the app is opened, no reinstall needed.
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    // Re-check for a new deploy every hour while the app stays open.
    if (registration) {
      setInterval(() => registration.update(), 60 * 60 * 1000)
    }
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)

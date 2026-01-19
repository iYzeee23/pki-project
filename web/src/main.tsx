import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from "./app";
import "leaflet/dist/leaflet.css";
import "./index.css"
import "./i18n"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

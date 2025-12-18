import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from './config/routes.tsx'
import AccessibilityWidget from './components/layout/Accessibility.tsx' // Importe aqui

import './index.css'
import './config/vars.css'
import './lib/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccessibilityWidget />
    
    <RouterProvider router={router} />
  </StrictMode>,
)
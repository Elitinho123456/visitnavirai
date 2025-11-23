// Default import statements
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

// Importing the router configuration
import router from './config/routes.tsx'

// Importing global CSS styles
import './index.css'
import './config/vars.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import router from './config/routes.tsx'
import AccessibilityWidget from './components/layout/Accessibility.tsx'
import ToastContainer from './components/ui/ToastContainer.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'

import '@/styles/index.css'
import '@/styles/vars.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AccessibilityWidget />
        <ToastContainer />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
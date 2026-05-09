import { StrictMode } from 'react'
import "@/index.css"
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "@tanstack/react-router"
import { router } from "@/app/router"
import { AppProviders } from '@/app/provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)

// src/App.tsx
import React, { useEffect, useState } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'

import Index from './pages/Index'
import Cadastro from './pages/Cadastro'
import Painel from './pages/Painel'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

const queryClient = new QueryClient()

export default function App() {
  const [supabaseReady, setSupabaseReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const supabaseUrl =
        (window as any).__SUPABASE_URL__ ||
        import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey =
        (window as any).__SUPABASE_ANON_KEY__ ||
        import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn(
          'Configurações do Supabase não encontradas. Verifique sua integração.'
        )
      }
      setSupabaseReady(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!supabaseReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Carregando configurações…</p>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/painel" element={<Painel />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

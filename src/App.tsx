
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Cadastro from "./pages/Cadastro";
import Painel from "./pages/Painel";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [supabaseReady, setSupabaseReady] = useState(false);

  useEffect(() => {
    // Check if Supabase is ready
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
      (typeof window !== 'undefined' ? (window as any).__SUPABASE_URL__ : '');
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
      (typeof window !== 'undefined' ? (window as any).__SUPABASE_ANON_KEY__ : '');
      
    // Set a small delay to ensure env vars are loaded
    const timer = setTimeout(() => {
      setSupabaseReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!supabaseReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/painel" element={<Painel />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

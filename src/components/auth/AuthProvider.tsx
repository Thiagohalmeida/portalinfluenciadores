// src/components/auth/AuthProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  isAllowedDomain: (email: string) => boolean
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // 1) Carrega sessão existente e já navega para /painel se houver
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      if (session) {
        navigate('/painel')
      }
    })

    // 2) Escuta mudanças de autenticação e navega quando fizer login
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
      if (newSession) {
        navigate('/painel')
      }
    })

    // 3) Cleanup
    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  const isAllowedDomain = (email: string) =>
    email.toLowerCase().endsWith('@controlf5.com.br')

  const signIn = async (email: string, password: string) => {
    if (!isAllowedDomain(email)) {
      return {
        error: new Error(
          'Apenas emails do domínio @controlf5.com.br são permitidos.'
        ),
      }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) {
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo ao Portal de Influenciadores!',
      })
      // aqui o navigate também vai ocorrer pelo onAuthStateChange
    }
    return { error }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          hd: 'controlf5.com.br',
          scope: 'openid profile email',
        },
        // volta só para a raiz (que está na whitelist do Supabase)
        redirectTo: window.location.origin,
      },
    })
    if (error) {
      toast({
        title: 'Erro ao fazer login com Google',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    toast({ title: 'Logout realizado com sucesso' })
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signOut,
        isAllowedDomain,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}

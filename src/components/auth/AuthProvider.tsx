
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client'; // Atualizando para usar o cliente correto
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAllowedDomain: (email: string) => boolean;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const isAllowedDomain = (email: string) => {
    return email.endsWith('@controlf5.com.br');
  };

  const signIn = async (email: string, password: string) => {
    if (!isAllowedDomain(email)) {
      return { 
        error: { message: 'Apenas emails do domínio @controlf5.com.br são permitidos para acesso ao painel.' } 
      };
    }
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (!error) {
      navigate('/painel');
      toast('Login realizado com sucesso', {
        description: 'Bem-vindo ao Portal de Influenciadores!'
      });
    }
    
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          // Configurando para apenas permitir emails do domínio específico
          hd: 'controlf5.com.br',
          // Escopo de acesso solicitado
          scope: 'profile email'
        },
        redirectTo: `${window.location.origin}/painel`
      }
    });
    
    if (error) {
      toast('Erro ao fazer login com Google', {
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast('Logout realizado com sucesso');
    navigate('/login');
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signOut,
    isAllowedDomain,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

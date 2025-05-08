
import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import { toast } from 'sonner';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      toast('Acesso restrito', {
        description: 'Você precisa estar logado para acessar esta página.'
      });
    }
  }, [loading, user, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg">Carregando...</span>
      </div>
    );
  }
  
  if (!user) {
    return <LoginPage />;
  }
  
  // Usuário está autenticado, renderiza o conteúdo
  return <Outlet />;
};

export default ProtectedRoute;

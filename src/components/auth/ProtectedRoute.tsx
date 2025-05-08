
import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';
import LoginPage from '@/pages/Login';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Add a loading state here if needed
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  if (!user) {
    return <LoginPage />;
  }
  
  // User is authenticated, render the outlet
  return <Outlet />;
};

export default ProtectedRoute;

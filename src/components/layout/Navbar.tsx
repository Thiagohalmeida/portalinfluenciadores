
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/components/auth/AuthProvider';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-card shadow-md dark:shadow-gray-800 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/224a8a68-7ca2-49af-b5de-e240f7398a6f.png" alt="Logo" className="h-8" />
          <h1 className="text-xl font-semibold text-foreground">Portal Influenciadores</h1>
        </Link>
      </div>
      
      <div className="flex items-center space-x-6">
        <Link to="/cadastro" className="text-muted-foreground hover:text-foreground transition-colors">
          Cadastrar
        </Link>
        
        {user ? (
          <>
            <Link to="/painel" className="text-muted-foreground hover:text-foreground transition-colors">
              Painel
            </Link>
            <button 
              onClick={() => signOut()}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <LogOut size={16} />
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <LogIn size={16} />
            Login
          </Link>
        )}
        
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;

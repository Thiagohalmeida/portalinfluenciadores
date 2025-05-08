
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Navbar: React.FC = () => {
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
        <Link to="/painel" className="text-muted-foreground hover:text-foreground transition-colors">
          Painel
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;

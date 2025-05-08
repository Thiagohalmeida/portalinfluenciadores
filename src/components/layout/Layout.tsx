
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      <footer className="bg-card shadow-inner py-4 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Portal Influenciadores. Todos os direitos reservados.
        <div className="mt-1">Desenvolvido por Planejamento - Business Intelligence</div>
      </footer>
    </div>
  );
};

export default Layout;

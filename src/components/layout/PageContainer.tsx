
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '', title }) => {
  return (
    <main className={`container mx-auto p-6 animate-fade-in ${className}`}>
      {title && (
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
          <div className="h-1 w-20 bg-brand-500 mt-2 rounded-full"></div>
        </div>
      )}
      {children}
    </main>
  );
};

export default PageContainer;

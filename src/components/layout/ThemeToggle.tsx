
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme based on user preference or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else if (prefersDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
      <Sun className={`h-5 w-5 transition-all ${theme === 'dark' ? 'opacity-0 scale-0' : 'opacity-100 scale-100'} absolute`} />
      <Moon className={`h-5 w-5 transition-all ${theme === 'light' ? 'opacity-0 scale-0' : 'opacity-100 scale-100'} rotate-90`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

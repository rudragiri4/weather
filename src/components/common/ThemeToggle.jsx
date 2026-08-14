import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useSettings();

  return (
    <button
      onClick={toggleTheme}
      title="Toggle Dark / Light Mode"
      className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-cyan-400 hover:border-slate-500 transition shadow-inner"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400" />
      )}
    </button>
  );
};

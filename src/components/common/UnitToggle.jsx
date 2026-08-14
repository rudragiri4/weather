import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export const UnitToggle = () => {
  const { tempUnit, toggleTempUnit } = useSettings();

  return (
    <button
      onClick={toggleTempUnit}
      title="Toggle °C / °F"
      className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs font-semibold text-slate-300 hover:border-slate-500 transition shadow-inner"
    >
      <span className={`px-2.5 py-1 rounded-lg transition-all ${tempUnit === 'C' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
        °C
      </span>
      <span className={`px-2.5 py-1 rounded-lg transition-all ${tempUnit === 'F' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
        °F
      </span>
    </button>
  );
};

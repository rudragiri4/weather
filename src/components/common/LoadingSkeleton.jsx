import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 w-full">
      {/* Hero Skeleton */}
      <div className="h-64 bg-slate-800/60 rounded-3xl w-full border border-slate-700/40"></div>
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-800/60 rounded-2xl border border-slate-700/40"></div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="h-72 bg-slate-800/60 rounded-3xl border border-slate-700/40"></div>
    </div>
  );
};

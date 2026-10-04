import React from 'react';

export const TeamCardSkeleton = () => (
  <div className="card p-4 animate-pulse">
    <div className="skeleton h-32 rounded-xl mb-3" />
    <div className="skeleton h-5 w-3/4 mb-2" />
    <div className="skeleton h-4 w-1/2 mb-1" />
    <div className="skeleton h-4 w-2/3" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-white rounded-lg animate-pulse">
        <div className="skeleton h-4 w-8" />
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-4 w-16" />
      </div>
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 font-medium animate-pulse">Loading...</p>
    </div>
  </div>
);

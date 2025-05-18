// src/components/ui/Loader.tsx
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-neon-purple-indigo bg-opacity-90 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-neon-electric-blue border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-neon-pink text-xl animate-neon-flicker">Loading 3D Experience...</p>
    </div>
  );
};

export default Loader;